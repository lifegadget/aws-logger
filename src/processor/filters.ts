import * as AWS from 'aws-sdk';

export function hasBody(message: AWS.SQS.Types.Message) {
  return message.Body;
}

export function bodyIsParsable(message: AWS.SQS.Types.Message) {
  try {
    JSON.parse(message.Body);
  } catch(e) {
    return false;
  }
  return true;
}