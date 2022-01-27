"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegisteredTeardowns = void 0;
function getRegisteredTeardowns(subscription) {
    var _a;
    if ('_teardowns' in subscription) {
        return (_a = subscription._teardowns) !== null && _a !== void 0 ? _a : [];
    }
    else {
        throw new TypeError('Invalid Subscription');
    }
}
exports.getRegisteredTeardowns = getRegisteredTeardowns;
//# sourceMappingURL=subscription.js.map