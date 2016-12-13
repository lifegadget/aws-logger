"use strict";
var _ = require('lodash');
function without(dict) {
    var without = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        without[_i - 1] = arguments[_i];
    }
    var narrow = _.assign({}, dict);
    without.map(function (i) { return delete narrow[i]; });
    return narrow;
}
exports.without = without;
function onlyWith(dict) {
    var toInclude = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        toInclude[_i - 1] = arguments[_i];
    }
    var without = Object.keys(dict).filter(function (key) { return toInclude.filter(function (f) { return f === key; }).length === 0; });
    return this.without.apply(this, [dict].concat(without));
}
exports.onlyWith = onlyWith;
function parseProperty(dict) {
    var parse = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        parse[_i - 1] = arguments[_i];
    }
    var copy = _.assign({}, dict);
    parse.map(function (key) {
        copy[key] = JSON.parse(copy[key]);
    });
    return copy;
}
exports.parseProperty = parseProperty;
//# sourceMappingURL=utils.js.map