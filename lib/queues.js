"use strict";
var region = 'eu-west-1';
exports.EVENT_QUEUE_URL = "https://sqs." + region + ".amazonaws.com/947418478752/LOGGER_EVENTS";
exports.QUEUE_REGION = function (evt) {
    return { region: region };
};
//# sourceMappingURL=queues.js.map