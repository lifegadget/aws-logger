import './common';
import * as AWS from 'aws-sdk';
import * as Queue from './queues';

export const handler = (event: IRequestInput, context: IContext, cb: IGatewayCallback) => {

  console.log('EVENT:', JSON.stringify(event, null, 2));
  console.log('CONTEXT:', JSON.stringify(event, null, 2));
  console.log('ENV:', JSON.stringify(process.env, null, 2));

  const sqs = new AWS.SQS(Queue.QUEUE_REGION(event));
  const lambda = new AWS.Lambda(Queue.QUEUE_REGION(event));
  const message: AWS.SQS.Types.SendMessageRequest = {
    MessageBody: event.body,
    QueueUrl: Queue.EVENT_QUEUE_URL(event),
  };

  sqs.sendMessage(message, (err, data) => {
    if (err) {
      console.log('problem occurred: ', err, message);
      cb(err.stack, {
        statusCode: 500,
        body: 'There were problems adding to SQS:\n' + err.stack,
      });
    }
    console.log('dropped into queue');
    lambda.invoke({
      InvocationType: 'Event',
      FunctionName: 'processor',
      LogType: 'None',
      Payload: JSON.stringify(data),
    }, (e: any, response: any) => {
      if (e) {
        console.error(e, e.stack);
        cb(e.message, {
          statusCode: 500,
          body: 'Problem invoking a processor after event added to queue',
          error: e.code,
        });
      }
      console.log('handed off to processor function\n', JSON.stringify(data, null , 2));
      cb(null, {
        statusCode: 200,
        body: JSON.stringify({
          lambda: response,
          sqs: data,
        }),
      });
    });

  });

};
