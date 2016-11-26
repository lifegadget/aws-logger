interface IDictionary<T> {
    [key: string]: T;
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
