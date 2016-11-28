# serverless-event

## Installation

The first step is to install the Serverless Framework which handles most of the heavly lifting of deploying your microservices into the cloud. 

```sh
# install Serverless as a global dependency
npm install -g serverless
# now let's create a working directory for your microservices
mkdir your-event-service
cd your-event-service
# and pull in the code for _serverless-event_
git clone https://github.com/lifegadget/serverless-event.git 
```

Now you have all the code you'll but to configure it for your needs you'll need to modify is the `serverless.yml` configuration file. The repo has a `serverless.yml.example` file so start with that by copying it into place:

```sh
cp serverless.yml.example serverless.yml
```

### Configuration of Serverless

### AWS Permissions

The base permissions of the API Gateway and Lambda function is done for us by the Serverless functions but it doesn't give our Lambda functions permissions to use services such as S3, SNS, or SQS so we'll need to set this up on a one time basis right now.

#### SQS

The following permissions must be given to the Lambda Role that Serverless has setup for our Lambda functions:

- sqs:DeleteMessage
- sqs:DeleteMessageBatch
- sqs:GetQueueAttributes
- sqs:GetQueueUrl
- sqs:ReceiveMessage
- sqs:SendMessage
- sqs:SendMessageBatch

