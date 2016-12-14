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
    QueueUrl: Queue.EVENT_QUEUE_URL,
  };
  const PROCESSOR_FUNCTION = process.env['AWS_LAMBDA_FUNCTION_NAME'].replace('receiver', 'processor');

  sqs.sendMessage(message, (err, data) => {
    if (err) {
      console.log('problem occurred: ', err, message);
      cb(err.stack, {
        statusCode: 500,
        body: 'There were problems adding to SQS:\n' + err.stack,
      });
      return;
    }
    
    cb(null, {
      statusCode: 200,
      body: 'message added to queue'
    });
  });

};
