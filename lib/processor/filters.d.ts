import * as AWS from 'aws-sdk';
export declare function hasBody(message: AWS.SQS.Types.Message): string;
export declare function bodyIsParsable(message: AWS.SQS.Types.Message): boolean;
