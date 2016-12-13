import './common';
import * as AWS from 'aws-sdk';
import * as Queue from './queues';
import * as _ from 'lodash';
import * as constants from './constants';
import * as Promise from 'bluebird';
import * as filter from './processor/filters';
import * as utils from './utils';
import 'source-map-support/register';

export interface IProcessorRequest extends AWSRequest {
  batchSize: number;
  parent: string;
  sequence: string;
}

/**
 * Pulls off a batch of events from the queue and:
 * 
 *  - validates events
 *  - filters unwanted events
 *  - enriches events
 *  - and then saves each transaction to s3
 *  - all successfully saved transacactions are batch-removed from queue
 * 
 */
export const handler = (event: IProcessorRequest, context: IContext, cb: IGatewayCallback) => {
  const sqs = new AWS.SQS(Queue.QUEUE_REGION(event));
  console.log('EVENT: ', event);

  const queueParams = {
    AttributeNames: [
      "All"
    ], 
    MaxNumberOfMessages: event.batchSize, 
    MessageAttributeNames: [
      "All"
    ], 
    QueueUrl: Queue.EVENT_QUEUE_URL
 };

  sqs.receiveMessage(queueParams, (err, data) => {
    if(err) {
      console.log(`There was an error in receiving the message batch from SQS:\n ${JSON.stringify(err)}`);
      cb(JSON.stringify(err));
      return;
    }
    console.log(JSON.stringify(data.Messages, null, 2));
    
    console.log(`Received batch of ${data.Messages.length} events. Beginning to process.`);

    let state:IState = {
      stage: 'validation', 
      completed: [], 
      rejected: [],
      hospital: [],
      events: data.Messages
        .map(
          m => utils.parseProperty(utils.onlyWith(m, 'Body', 'ReceiptHandle'), 'Body')
        )
    };

    console.log('STATE: ', JSON.stringify(state, null, 2));

    validateEvents(state)
      .then(enrichEvents)
      .then(saveToS3)
      .then(dequeue)
      .then(hospitalize)
      .catch(err => {
        console.log(`Ran into problem processing message ${context.awsRequestId} during ${state.stage} stage:\n`, JSON.stringify(err, null, 2));
        
      });
  }); 

};

type IState = IProcessingState | IMessageState; 

/** State as it's been converted to "events" */
interface IProcessingState {
  stage: 'enrichment' | 'saving' | 'dequeue' |'hospitalization';
  completed: string[];
  rejected: string[];
  hospital: IHospitalVisitor[],
  events: IServerlessEvent[];
}

/** State as it's passed in from SQS */
interface IMessageState {
  stage: 'validation';
  completed: string[];
  rejected: string[];
  hospital: IHospitalVisitor[],
  events: AWS.SQS.Types.Message[];  
}


/**
 * Remove messages that are unneeded or unable to be tracked
 */
function validateEvents(state: IState): Promise<IState> {
  return new Promise<IState>( (resolve, reject) => {

    switch(state.stage) {
      case 'validation': 
        state.events = state.events.filter(event => {
          if (
            filter.hasBody(event)
          ) {
            return true;
          } else {
            state.hospital.push({
              reason: 'failed-validation-events',
              visitor: _.assign({}, event)
            });
            return false;
          }
        });
        resolve(state);
        break;

      default: 
        // this should never happen
        reject('state was not in VALIDATION stage during validation');
    } // end switch

  }); // end promise
} 

/**
 * Parallelize all enrichments across the messages
 */
function enrichEvents(state: IProcessingState): Promise<IProcessingState> {
  state.stage = 'enrichment';
  return new Promise<IProcessingState>( (resolve, reject) => {

  console.log('Enrichment started');
  const promises: Promise<any>[] = [];
  
  state.events.map(m => promises.push(enrichEvent(m)));
  Promise.all(promises)
    .then(events => {
      console.log('Enriched event:', JSON.stringify(events, null, 2));
      resolve(state);
    })
    .catch(reject);
  });
}

/**
 * Enrich an event with additional context (as well as convert from a generic
 * SQS "message" to a IServerlessEvent).
 */
function enrichEvent(event: IServerlessEvent): Promise<IServerlessEvent> {
  return Promise.resolve(event);
} 

function saveToS3(state: IProcessingState): Promise<IProcessingState> {
  state.stage = 'saving';
  const s3 = new AWS.S3(
    _.assign(Queue.QUEUE_REGION({ region: 'eu-west-1' }), { Bucket: constants.S3_BUCKET })
  );
  const sqs = new AWS.SQS({ region: 'eu-west-1' });

  // iterate through each event
  state.events.map(event => {
    const objectParams = {
      Bucket: constants.S3_BUCKET,
      Key: `${event.eventType}/${event.id}`,
      Body: JSON.stringify(event),
    };
    s3.putObject(objectParams, (err, data) => {
      if (err) {
        state.hospital.push({
          visitor: event,
          reason: JSON.stringify(err)
        });
        console.log(`Error in putting S3 Object: ${JSON.stringify(err)}`);
        
      } else {
        console.log(`successfully PUT ${event.id}`, data);
        const sqsParams = {
          QueueUrl: Queue.EVENT_QUEUE_URL, 
          ReceiptHandle: event.ReceiptHandle
        };
        sqs.deleteMessage(sqsParams);
      }
    });
  });
  return Promise.resolve(state);
} 

function dequeue(state: IProcessingState): Promise<IProcessingState> {
  state.stage = 'dequeue';
  return Promise.resolve(state);
} 

function hospitalize(state: IProcessingState): Promise<IState> {
  state.stage = 'hospitalization';
  const sqs = new AWS.SQS(Queue.QUEUE_REGION());
  console.log('hospitalised: ', JSON.stringify(state.hospital, null, 2));
  state.hospital = state.hospital.filter(item => {
    const id = item.visitor.ReceiptHandle;
    const params = {
      QueueUrl: Queue.EVENT_QUEUE_URL,
      ReceiptHandle: item.visitor.ReceiptHandle
    };
    sqs.deleteMessage(params, (err, data) => {
      if(err) {
        console.log(`Problems deleting ${id} from the queue.`);
        return true;
      } else {
        return false;
      }
    });
  });

  return Promise.resolve(state);
}

/** Converts an SQS message to a Serverless Event */
function convertMessageToEvent(message: AWS.SQS.Types.Message): IServerlessEvent {
  let body:IServerlessEvent = message.Body ? JSON.parse(message.Body) : { eventType: 'unknown' };
  console.log('BODY IS: ', body);
  
  return {
    id: body.id || message.MessageId,
    eventType: body.eventType,
    ipAddress: body.ipAddress,
    queueId: message.MessageId,
    sourceId: body.sourceId || 'undefined-app',
    tagId: body.tagId || 'untagged',
    message: body.message,
    severity: body.severity,
    architecture: body.architecture || 'other',
    device: body.device,
    ui: body.ui || {},
    geo: body.geo || {},
    app: body.app || {},
    transaction: body.transaction || {},
    senderId: message.Attributes['SenderId'],
    sentTimestamp: Number(message.Attributes['SentTimestamp']),
    processTimestamp: new Date().getTime(),
    attributes: message.MessageAttributes || {},
    ReceiptHandle: message.ReceiptHandle
  }
}