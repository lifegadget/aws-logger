"use strict";
exports.EVENT_QUEUE_URL = function (evt) { return 'https://sqs.eu-west-1.amazonaws.com/947418478752/LOGGER_EVENTS'; };
exports.QUEUE_REGION = function (evt) {
    return { region: 'eu-west' };
};
