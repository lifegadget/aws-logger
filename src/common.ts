interface IDictionary<T> {
  [key: string]: T;
};

interface AWSRequest {
  region: string;
}

interface IHospitalVisitor {
  visitor: any,
  reason: string,
}

interface IServerlessEvent {
  /** Unique identififier for the event */
  id?: string;
  /** Unique identifier provided by SQS */
  queueId?: string;
  /** The application/micro-service which originated the event */
  sourceId?: string;
  /** 
   * A generic tracker cookie/identifier for understanding longer 
   * running workflow 
   */
  tagId?: string;
  /** Prose message */
  message?: string;
  /** a dictionary of attributes that describe the device */
  device?: IDictionary<any>,
  /** a dictionary of attributes describing the user interface of the device */
  ui?: IDictionary<any>,
  architecture?: 'frontend' | 'backend' | 'db' | 'infra' | 'other',
  geo?: IDictionary<any>,
  app?: IDictionary<any>,
  user?: IDictionary<any>,
  transaction?: IDictionary<any>,
  /** the source's IP address */
  ipAddress?: string,
  /** how significant is the message? */
  severity?: 'error' | 'warn' | 'info' | 'debug';
  /** error information, if appropriate */
  error?: IEventError;
  /** unique identifier of entity who posted this queue item */
  senderId?: string;
  /** time sent into SQS queue */
  sentTimestamp?: number;
  /** time being processed */
  processTimestamp?: number;
  /**  Any SQS message attributes that were passed into the queue */
  attributes?: IDictionary<any>;
  ReceiptHandle: string;
}

interface IEventError {
  code?: string;
  line?: number;
  column?: number;
  message?: string;
  stack?: any;
}

interface IRequestInput extends AWSRequest {
  resource?: string;
  path?: string;
  httpMethod?: string;
  headers?: IRequestHeaders;
  querystringParameters?: IDictionary<string>;
  pathParameters?: IDictionary<string>;
  stageParameters?: IDictionary<string>;
  requestContext?: IRequestContext;
  body?: string;
}

interface ITimedRequest extends AWSRequest {
  version: string;
  /**
   * A unique ID for the transaction
   */
  id: string;
  /**
   * Scheduled Type, etc.
   */
  'detail-type': string;
  source: string;
  account: string;
  time: string;
  region: string;
  resource: string[];
  detail: IDictionary<any>;
}

interface IContext {
  callbackWaitsForEmptyEventLoop?: Function;
  done?: Function;
  succeed?: Function;
  fail?: Function;
  logGroupName?: string;
  logStreamName?: string;
  functionName?: string;
  memoryLimitInMB?: string;
  functionVersion?: string;
  getRemainingTimeInMillis?: string;
  invokeid?: string;
  awsRequestId?: string;
  invokedFunctionArn?: string;
}

type nullOrString = string | null;

interface IGatewayResponse {
  statusCode: Number;
  headers?: IDictionary<String>;

  body?: string;
  error?: string;
}

/**
 * An AWS Lambda function which returns it's response to an API Gateway endpoint
 */
type IGatewayCallback = (err: nullOrString, response?: IGatewayResponse) => void;

interface IRequestIdentity {
  cognitoIdentityPoolId: nullOrString;
  accountId: nullOrString;
  cognitoIdentityId: nullOrString;
  caller: nullOrString;
  apiKey: nullOrString;
  sourceIp: nullOrString;
  cognitoAuthenticationType: nullOrString;
  cognitoAuthenticationProvider: nullOrString;
  userArn: nullOrString;
  /**
   * type/subtype (e.g., PostmanRuntime/2.4.5)
   *
   * @type {nullOrString}
   * @memberOf IRequestIdentity
   */
  userAgent: nullOrString;
  user: nullOrString;
}

interface IRequestContext {
  accountId: String;
  resourceId: String;
  stage: String;
  requestId: String;
  identity: IRequestIdentity;
  resourcePath: String;
  /**
   * UPPER CASE string of the method: GET, POST, etc.
   *
   * @type {String}
   * @memberOf IRequestContext
   */
  httpMethod: String;
  apiId: String;
}

interface IRequestHeaders {
  Accept?: string;
  ['Accept-Encoding']?: string;
  ['cache-control']?: string;
  ['CloudFront-Forwarded-Proto']?: string;
  ['CloudFront-Is-Desktop-Viewer']?: string;
  ['CloudFront-Is-Mobile-Viewer']?: string;
  ['CloudFront-Is-SmartTV-Viewer']?: string;
  ['CloudFront-Is-Tablet-Viewer']?: string;
  ['CloudFront-Viewer-Country']?: string;
  ['Content-Type']?: string;
  headername?: string;
  Host?: string;
  ['Postman-Token']?: string;
  ['User-Agent']?: string;
  ['Via']?: string;
  ['X-Amz-Cf-Id']?: string;
  ['X-Forwarded-For']?: string;
  ['X-Forwarded-Port']?: string;
  ['X-Forwarded-Proto']?: string;
  [key: string]: string;
}
