"use strict";
require('./common');
var AWS = require('aws-sdk');
var Queue = require('./queues');
var _ = require('lodash');
var constants = require('./constants');
var Promise = require('bluebird');
var filter = require('./processor/filters');
var utils = require('./utils');
require('source-map-support/register');
exports.handler = function (event, context, cb) {
    var sqs = new AWS.SQS(Queue.QUEUE_REGION(event));
    console.log('EVENT: ', event);
    var queueParams = {
        AttributeNames: [
            "All"
        ],
        MaxNumberOfMessages: event.batchSize,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: Queue.EVENT_QUEUE_URL
    };
    sqs.receiveMessage(queueParams, function (err, data) {
        if (err) {
            console.log("There was an error in receiving the message batch from SQS:\n " + JSON.stringify(err));
            cb(JSON.stringify(err));
            return;
        }
        console.log(JSON.stringify(data.Messages, null, 2));
        console.log("Received batch of " + data.Messages.length + " events. Beginning to process.");
        var state = {
            stage: 'validation',
            completed: [],
            rejected: [],
            hospital: [],
            events: data.Messages
                .map(function (m) { return utils.parseProperty(utils.onlyWith(m, 'Body', 'ReceiptHandle'), 'Body'); })
        };
        console.log('STATE: ', JSON.stringify(state, null, 2));
        validateEvents(state)
            .then(enrichEvents)
            .then(saveToS3)
            .then(dequeue)
            .then(hospitalize)
            .catch(function (err) {
            console.log("Ran into problem processing message " + context.awsRequestId + " during " + state.stage + " stage:\n", JSON.stringify(err, null, 2));
        });
    });
};
function validateEvents(state) {
    return new Promise(function (resolve, reject) {
        switch (state.stage) {
            case 'validation':
                state.events = state.events.filter(function (event) {
                    if (filter.hasBody(event)) {
                        return true;
                    }
                    else {
                        state.hospital.push({
                            reason: 'failed-validation-events',
                            visitor: _.assign({}, event)
                        });
                        return false;
                    }
                });
                resolve(state);
                break;
            default:
                reject('state was not in VALIDATION stage during validation');
        }
    });
}
function enrichEvents(state) {
    state.stage = 'enrichment';
    return new Promise(function (resolve, reject) {
        console.log('Enrichment started');
        var promises = [];
        state.events.map(function (m) { return promises.push(enrichEvent(m)); });
        Promise.all(promises)
            .then(function (events) {
            console.log('Enriched event:', JSON.stringify(events, null, 2));
            resolve(state);
        })
            .catch(reject);
    });
}
function enrichEvent(event) {
    return Promise.resolve(event);
}
function saveToS3(state) {
    state.stage = 'saving';
    var s3 = new AWS.S3(_.assign(Queue.QUEUE_REGION({ region: 'eu-west-1' }), { Bucket: constants.S3_BUCKET }));
    var sqs = new AWS.SQS({ region: 'eu-west-1' });
    state.events.map(function (event) {
        var objectParams = {
            Bucket: constants.S3_BUCKET,
            Key: event.eventType + "/" + event.id,
            Body: JSON.stringify(event)
        };
        s3.putObject(objectParams, function (err, data) {
            if (err) {
                state.hospital.push({
                    visitor: event,
                    reason: JSON.stringify(err)
                });
                console.log("Error in putting S3 Object: " + JSON.stringify(err));
            }
            else {
                console.log("successfully PUT " + event.id, data);
                var sqsParams = {
                    QueueUrl: Queue.EVENT_QUEUE_URL,
                    ReceiptHandle: event.ReceiptHandle
                };
                sqs.deleteMessage(sqsParams);
            }
        });
    });
    return Promise.resolve(state);
}
function dequeue(state) {
    state.stage = 'dequeue';
    return Promise.resolve(state);
}
function hospitalize(state) {
    state.stage = 'hospitalization';
    var sqs = new AWS.SQS(Queue.QUEUE_REGION());
    console.log('hospitalised: ', JSON.stringify(state.hospital, null, 2));
    state.hospital = state.hospital.filter(function (item) {
        var id = item.visitor.ReceiptHandle;
        var params = {
            QueueUrl: Queue.EVENT_QUEUE_URL,
            ReceiptHandle: item.visitor.ReceiptHandle
        };
        sqs.deleteMessage(params, function (err, data) {
            if (err) {
                console.log("Problems deleting " + id + " from the queue.");
                return true;
            }
            else {
                return false;
            }
        });
    });
    return Promise.resolve(state);
}
function convertMessageToEvent(message) {
    var body = message.Body ? JSON.parse(message.Body) : { eventType: 'unknown' };
    console.log('BODY IS: ', body);
    return {
        id: body.id || message.MessageId,
        eventType: body.eventType,
        ipAddress: body.ipAddress,
        queueId: message.MessageId,
        sourceId: body.sourceId || 'undefined-app',
        tagId: body.tagId || 'untagged',
        message: body.message,
        severity: body.severity,
        architecture: body.architecture || 'other',
        device: body.device,
        ui: body.ui || {},
        geo: body.geo || {},
        app: body.app || {},
        transaction: body.transaction || {},
        senderId: message.Attributes['SenderId'],
        sentTimestamp: Number(message.Attributes['SentTimestamp']),
        processTimestamp: new Date().getTime(),
        attributes: message.MessageAttributes || {},
        ReceiptHandle: message.ReceiptHandle
    };
}
//# sourceMappingURL=processor.js.map