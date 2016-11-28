"use strict";
require('./common');
var AWS = require('aws-sdk');
var Queue = require('./queues');
var PROCESSOR_FUNCTION = process.env['AWS_LAMBDA_FUNCTION_NAME'].replace('event-manager', 'processor');
var workersDeployed = true;
exports.handler = function (event, context, cb) {
    console.log('EVENT:\n', JSON.stringify(event, null, 2));
    console.log('Stats:', JSON.stringify({
        memory: context.memoryLimitInMB,
        invokeId: context.invokeid,
        id: event.id,
        region: event.region
    }, null, 2));
    var sqs = new AWS.SQS(Queue.QUEUE_REGION(event));
    var lambda = new AWS.Lambda(Queue.QUEUE_REGION(event));
    sqs.getQueueAttributes({
        QueueUrl: Queue.EVENT_QUEUE_URL(event),
        AttributeNames: ['ApproximateNumberOfMessages']
    }, function (err, data) {
        if (err) {
            console.log('Error getting queue attributes:\n', JSON.stringify(err));
        }
        var queueDepth = Number(data.Attributes['ApproximateNumberOfMessages']);
        var batchSize = 10;
        var workers = Math.round(queueDepth / batchSize);
        console.log("Queue depth is " + queueDepth + ", batch size is " + batchSize + " so creating " + workers + " processor workers to drain queue");
        var _loop_1 = function(i) {
            lambda.invoke({
                InvocationType: 'Event',
                FunctionName: PROCESSOR_FUNCTION,
                Payload: JSON.stringify({
                    batchSize: batchSize,
                    parent: event.id,
                    sequence: i + " of " + workers
                })
            }, function (err, data) {
                if (err) {
                    console.log(("Problem with worker " + i + ": ") + err);
                    cb(JSON.stringify(err));
                    workersDeployed = false;
                    return;
                }
                console.log(("Worker " + i + " successfully engaged: ") + JSON.stringify(data, null, 2));
            });
        };
        for (var i = 1; i <= workers; i++) {
            _loop_1(i);
        }
        cb(null, {
            statusCode: workersDeployed ? 200 : 512,
            body: workersDeployed ? 'completed worker deployment' : 'problems in at least one worker deployment'
        });
    });
};
