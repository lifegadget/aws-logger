import * as AWS from 'aws-sdk';

export function hasBody(message: AWS.SQS.Types.Message) {
  return message.Body;
}