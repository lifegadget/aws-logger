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
    // lambda.invoke({
    //   InvocationType: 'Event',
    //   FunctionName: PROCESSOR_FUNCTION,
    //   Payload: JSON.stringify(data),
    // }, (e: any, response: any) => {
    //   if (e) {
    //     console.log(`There was a problem invoking the "processor" lambda function (${PROCESSOR_FUNCTION})`);
    //     console.error(e);
    //     cb(null, {
    //       statusCode: 500,
    //       body: 'Problem invoking a processor after event added to queue',
    //       error: e.code,
    //     });
    //     return;
    //   }
    //   console.log('handed off to processor function\n', JSON.stringify(data, null , 2));
    //   cb(null, {
    //     statusCode: 200,
    //     body: JSON.stringify({
    //       lambda: response,
    //       sqs: data,
    //     }),
    //   });
    // });

  });

};
