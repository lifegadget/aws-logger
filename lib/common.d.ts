interface IDictionary<T> {
    [key: string]: T;
}
interface AWSRequest {
    region: string;
}
interface IHospitalVisitor {
    visitor: IServerlessEvent | AWS.SQS.Types.Message;
    reason: string;
}
interface IServerlessEvent {
    id?: string;
    eventType: 'log' | 'performance' | 'workflow';
    queueId?: string;
    sourceId?: string;
    tagId?: string;
    message?: string;
    device?: IDictionary<any>;
    ui?: IDictionary<any>;
    architecture?: 'frontend' | 'backend' | 'db' | 'infra' | 'other';
    geo?: IDictionary<any>;
    app?: IDictionary<any>;
    user?: IDictionary<any>;
    transaction?: IDictionary<any>;
    ipAddress?: string;
    severity?: 'error' | 'warn' | 'info' | 'debug';
    error?: IEventError;
    senderId?: string;
    sentTimestamp?: number;
    processTimestamp?: number;
    attributes?: IDictionary<any>;
    ReceiptHandle?: string;
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
    id: string;
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
declare type nullOrString = string | null;
interface IGatewayResponse {
    statusCode: Number;
    headers?: IDictionary<String>;
    body?: string;
    error?: string;
}
declare type IGatewayCallback = (err: nullOrString, response?: IGatewayResponse) => void;
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
