interface IDictionary<T> {
  [key: string]: T;
};

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

interface IRequestInput {
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

interface IGatewayRequest {
  message: string;
  input: IRequestInput;
}
