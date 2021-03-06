"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('zipWith', function () {
    var rxTestScheduler;
    beforeEach(function () {
        rxTestScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should combine a source with a second', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1---2---3-----');
            var asubs = '   ^';
            var b = hot('   --4--5--6--7--8--');
            var bsubs = '   ^';
            var expected = '---x---y---z-----';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should end once one observable completes and its buffer is empty', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a--b--c--|               ');
            var e1subs = '  ^-----------!               ';
            var e2 = hot('  ------d----e----f--------|  ');
            var e2subs = '  ^-----------------!         ';
            var e3 = hot('  --------h----i----j---------');
            var e3subs = '  ^-----------------!         ';
            var expected = '--------x----y----(z|)      ';
            var values = {
                x: ['a', 'd', 'h'],
                y: ['b', 'e', 'i'],
                z: ['c', 'f', 'j'],
            };
            expectObservable(e1.pipe(operators_1.zipWith(e2, e3))).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    it('should end once one observable nexts and zips value from completed other observable whose buffer is empty', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  ---a--b--c--|             ');
            var e1subs = '  ^-----------!             ';
            var e2 = hot('  ------d----e----f|        ');
            var e2subs = '  ^----------------!        ';
            var e3 = hot('  --------h----i----j-------');
            var e3subs = '  ^-----------------!       ';
            var expected = '--------x----y----(z|)    ';
            var values = {
                x: ['a', 'd', 'h'],
                y: ['b', 'e', 'i'],
                z: ['c', 'f', 'j'],
            };
            expectObservable(e1.pipe(operators_1.zipWith(e2, e3))).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
            expectSubscriptions(e3.subscriptions).toBe(e3subs);
        });
    });
    describe('with iterables', function () {
        it('should zip them with values', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var myIterator = (function () {
                    var i;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i < 4)) return [3, 4];
                                return [4, i];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                i++;
                                return [3, 1];
                            case 4: return [2];
                        }
                    });
                })();
                var e1 = hot('  ---a---b---c---d---|');
                var e1subs = '  ^--------------!';
                var expected = '---w---x---y---(z|)';
                var values = {
                    w: ['a', 0],
                    x: ['b', 1],
                    y: ['c', 2],
                    z: ['d', 3],
                };
                expectObservable(e1.pipe(operators_1.zipWith(myIterator))).toBe(expected, values);
                expectSubscriptions(e1.subscriptions).toBe(e1subs);
            });
        });
        it('should complete instantly for an empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  -');
                var asubs = '   (^!)';
                var expected = '|';
                var b = [];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with empty observable and empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  |');
                var asubs = '   (^!)';
                var expected = '|';
                var b = [];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with empty observable and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  |');
                var asubs = '   (^!)';
                var expected = '|';
                var b = [1];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should complete instantly with non-empty observable and empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('   ---^----a--|');
                var asubs = '      (^!)';
                var b = [];
                var expected = '   |';
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with never observable and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = cold('  -');
                var asubs = '   ^';
                var expected = '-';
                var b = [1];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty observable and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^----1--|');
                var asubs = '   ^----!   ';
                var expected = '-----(x|)';
                var b = [2];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['1', 2] });
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with observable which raises error and non-empty iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^----#');
                var asubs = '   ^----!';
                var expected = '-----#';
                var b = [1];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
        it('should work with non-empty many observable and non-empty many iterable', function () {
            rxTestScheduler.run(function (_a) {
                var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
                var a = hot('---^--1--2--3--|');
                var asubs = '   ^--------!   ';
                var expected = '---x--y--(z|)';
                var b = [4, 5, 6];
                expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['1', 4], y: ['2', 5], z: ['3', 6] });
                expectSubscriptions(a.subscriptions).toBe(asubs);
            });
        });
    });
    it('should work with n-ary symmetric', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-1----4----|');
            var asubs = '     ^---------!  ';
            var b = hot('---1-^--2--5----| ');
            var bsubs = '     ^---------!  ';
            var c = hot('---1-^---3---6-|  ');
            var expected = '  ----x---y-|  ';
            expectObservable(a.pipe(operators_1.zipWith(b, c))).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with right completes first', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('---1-^-2-----|');
            var asubs = '     ^-----!';
            var b = hot('---1-^--3--|');
            var bsubs = '     ^-----!';
            var expected = '  ---x--|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: ['2', '3'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with two nevers', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -');
            var asubs = '   ^';
            var b = cold('  -');
            var bsubs = '   ^';
            var expected = '-';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with never and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = cold('  -');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and non-empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = hot('   ---1--|');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with non-empty and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1--|');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with never and non-empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -');
            var asubs = '   ^';
            var b = hot('   ---1--|');
            var bsubs = '   ^-----!';
            var expected = '-';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with non-empty and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1--|');
            var asubs = '   ^-----!';
            var b = cold('  -');
            var bsubs = '   ^';
            var expected = '-';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with empty and error', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  |');
            var asubs = '   (^!)';
            var b = hot('   ------#', undefined, 'too bad');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and empty', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ------#', undefined, 'too bad');
            var asubs = '   (^!)';
            var b = cold('  |');
            var bsubs = '   (^!)';
            var expected = '|';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ----------|');
            var asubs = '   ^-----!    ';
            var b = hot('   ------#    ');
            var bsubs = '   ^-----!    ';
            var expected = '------#    ';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with never and error', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  -------');
            var asubs = '   ^-----!';
            var b = hot('   ------#');
            var bsubs = '   ^-----!';
            var expected = '------#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and never', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ------#');
            var asubs = '   ^-----!';
            var b = cold('  -------');
            var bsubs = '   ^-----!';
            var expected = '------#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and error', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ------#', undefined, 'too bad');
            var asubs = '   ^-----!';
            var b = hot('   ----------#', undefined, 'too bad 2');
            var bsubs = '   ^-----!';
            var expected = '------#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, null, 'too bad');
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with two sources that eventually raise errors', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   --w-----#----', { w: 1 }, 'too bad');
            var asubs = '   ^-------!';
            var b = hot('   -----z-----#-', { z: 2 }, 'too bad 2');
            var bsubs = '   ^-------!';
            var expected = '-----x--#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: [1, 2] }, 'too bad');
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with two sources that eventually raise errors (swapped)', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   -----z-----#-', { z: 2 }, 'too bad 2');
            var asubs = '   ^-------!';
            var b = hot('   --w-----#----', { w: 1 }, 'too bad');
            var bsubs = '   ^-------!';
            var expected = '-----x--#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected, { x: [2, 1] }, 'too bad');
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should work with error and some', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = cold('  #');
            var asubs = '   (^!)';
            var b = hot('   --1--2--3--');
            var bsubs = '   (^!)';
            var expected = '#';
            expectObservable(a.pipe(operators_1.zipWith(b))).toBe(expected);
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
    it('should combine an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.scheduled([1, 2, 3], rxjs_1.queueScheduler);
        var b = rxjs_1.scheduled([4, 5, 6, 7, 8], rxjs_1.queueScheduler);
        var r = [
            [1, 4],
            [2, 5],
            [3, 6],
        ];
        var i = 0;
        a.pipe(operators_1.zipWith(b)).subscribe({
            next: function (vals) {
                chai_1.expect(vals).to.deep.equal(r[i++]);
            },
            complete: done,
        });
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var a = hot('   ---1---2---3---|');
            var unsub = '   ---------!';
            var asubs = '   ^--------!';
            var b = hot('   --4--5--6--7--8--|');
            var bsubs = '   ^--------!';
            var expected = '---x---y--';
            var r = a.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.zipWith(b), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(r, unsub).toBe(expected, { x: ['1', '4'], y: ['2', '5'] });
            expectSubscriptions(a.subscriptions).toBe(asubs);
            expectSubscriptions(b.subscriptions).toBe(bsubs);
        });
    });
});
//# sourceMappingURL=zipWith-spec.js.map