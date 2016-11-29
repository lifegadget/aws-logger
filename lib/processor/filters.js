"use strict";
function hasBody(message) {
    return message.Body;
}
exports.hasBody = hasBody;
function bodyIsParsable(message) {
    try {
        JSON.parse(message.Body);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.bodyIsParsable = bodyIsParsable;
