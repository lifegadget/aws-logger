"use strict";
require('./common');
var AWS = require('aws-sdk');
var Queue = require('./queues');
exports.handler = function (event, context, cb) {
    console.log('EVENT:', JSON.stringify(event, null, 2));
    console.log('CONTEXT:', JSON.stringify(event, null, 2));
    console.log('ENV:', JSON.stringify(process.env, null, 2));
    var sqs = new AWS.SQS(Queue.QUEUE_REGION(event));
    var lambda = new AWS.Lambda(Queue.QUEUE_REGION(event));
    var message = {
        MessageBody: event.body,
        QueueUrl: Queue.EVENT_QUEUE_URL(event)
    };
    var PROCESSOR_FUNCTION = process.env['AWS_LAMBDA_FUNCTION_NAME'].replace('receiver', 'processor');
    sqs.sendMessage(message, function (err, data) {
        if (err) {
            console.log('problem occurred: ', err, message);
            cb(err.stack, {
                statusCode: 500,
                body: 'There were problems adding to SQS:\n' + err.stack
            });
            return;
        }
        cb(null, {
            statusCode: 200,
            body: 'message added to queue'
        });
    });
};
