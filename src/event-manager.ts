import './common';
import * as AWS from 'aws-sdk';
import * as Queue from './queues';
const PROCESSOR_FUNCTION = process.env['AWS_LAMBDA_FUNCTION_NAME'].replace('event-manager', 'processor');
let workersDeployed: boolean = true;

export const handler = (event: ITimedRequest, context: IContext, cb: IGatewayCallback) => {
  console.log('EVENT:\n', JSON.stringify(event, null, 2));
  console.log('Stats:', JSON.stringify({
    memory: context.memoryLimitInMB,
    invokeId: context.invokeid,
    id: event.id,
    region: event.region,
  }, null, 2));
  const sqs = new AWS.SQS(Queue.QUEUE_REGION(event));
  const lambda = new AWS.Lambda(Queue.QUEUE_REGION(event));

  sqs.getQueueAttributes({
      QueueUrl: Queue.EVENT_QUEUE_URL(event),
      AttributeNames: ['ApproximateNumberOfMessages']
    },
    (err, data) => {
      if (err) {
        console.log('Error getting queue attributes:\n', JSON.stringify(err));
      }

      const queueDepth = Number(data.Attributes['ApproximateNumberOfMessages']);
      const batchSize = 10;
      const workers = Math.round(queueDepth / batchSize);
      
      console.log(`Queue depth is ${queueDepth}, batch size is ${batchSize} so creating ${workers} processor workers to drain queue`);

      for ( let i = 1; i <= workers; i++) {
        lambda.invoke({
          InvocationType: 'Event',
          FunctionName: PROCESSOR_FUNCTION,
          Payload: JSON.stringify({
            batchSize,
            parent: event.id,
            sequence: `${i} of ${workers}`
          }),          
        }, (err, data) => {
          if (err) {
            console.log(`Problem with worker ${i}: ` + err);
            cb(JSON.stringify(err));
            workersDeployed = false;
            return;
          }

          console.log(`Worker ${i} successfully engaged: ` + JSON.stringify(data, null, 2));
        })
      }
      cb(null, {
        statusCode: workersDeployed ? 200 : 512,
        body: workersDeployed ? 'completed worker deployment' : 'problems in at least one worker deployment'
      })
    });
};
