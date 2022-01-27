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
var marble_testing_1 = require("../helpers/marble-testing");
var rxjs_1 = require("rxjs");
var queueScheduler = rxjs_1.queueScheduler;
describe('static zip', function () {
    it('should combine a source with a second', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b))
            .toBe(expected, { x: ['1', '4'], y: ['2', '5'], z: ['3', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should zip the provided observables', function (done) {
        var expected = ['a1', 'b2', 'c3'];
        var i = 0;
        rxjs_1.zip(rxjs_1.from(['a', 'b', 'c']), rxjs_1.from([1, 2, 3]), function (a, b) { return a + b; })
            .subscribe({ next: function (x) {
                chai_1.expect(x).to.equal(expected[i++]);
            }, complete: done });
    });
    it('should end once one observable completes and its buffer is empty', function () {
        var e1 = marble_testing_1.hot('---a--b--c--|               ');
        var e1subs = '^           !               ';
        var e2 = marble_testing_1.hot('------d----e----f--------|  ');
        var e2subs = '^                 !         ';
        var e3 = marble_testing_1.hot('--------h----i----j---------');
        var e3subs = '^                 !         ';
        var expected = '--------x----y----(z|)      ';
        var values = {
            x: ['a', 'd', 'h'],
            y: ['b', 'e', 'i'],
            z: ['c', 'f', 'j']
        };
        marble_testing_1.expectObservable(rxjs_1.zip(e1, e2, e3)).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    it('should end once one observable nexts and zips value from completed other ' +
        'observable whose buffer is empty', function () {
        var e1 = marble_testing_1.hot('---a--b--c--|             ');
        var e1subs = '^           !             ';
        var e2 = marble_testing_1.hot('------d----e----f|        ');
        var e2subs = '^                !        ';
        var e3 = marble_testing_1.hot('--------h----i----j-------');
        var e3subs = '^                 !       ';
        var expected = '--------x----y----(z|)    ';
        var values = {
            x: ['a', 'd', 'h'],
            y: ['b', 'e', 'i'],
            z: ['c', 'f', 'j']
        };
        marble_testing_1.expectObservable(rxjs_1.zip(e1, e2, e3)).toBe(expected, values);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        marble_testing_1.expectSubscriptions(e2.subscriptions).toBe(e2subs);
        marble_testing_1.expectSubscriptions(e3.subscriptions).toBe(e3subs);
    });
    describe('with iterables', function () {
        it('should zip them with values', function () {
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
            var e1 = marble_testing_1.hot('---a---b---c---d---|');
            var e1subs = '^              !';
            var expected = '---w---x---y---(z|)';
            var values = {
                w: ['a', 0],
                x: ['b', 1],
                y: ['c', 2],
                z: ['d', 3]
            };
            marble_testing_1.expectObservable(rxjs_1.zip(e1, myIterator)).toBe(expected, values);
            marble_testing_1.expectSubscriptions(e1.subscriptions).toBe(e1subs);
        });
        it('should work with empty observable and empty iterable', function () {
            var a = marble_testing_1.cold('|');
            var asubs = '(^!)';
            var b = [];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with empty observable and non-empty iterable', function () {
            var a = marble_testing_1.cold('|');
            var asubs = '(^!)';
            var b = [1];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should complete instantly if given an empty iterable', function () {
            var a = marble_testing_1.hot('---^----a--|');
            var asubs = '(^!)';
            var b = [];
            var expected = '|';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with never observable and non-empty iterable', function () {
            var a = marble_testing_1.cold('-');
            var asubs = '^';
            var b = [1];
            var expected = '-';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and non-empty iterable', function () {
            var a = marble_testing_1.hot('---^----1--|');
            var asubs = '^    !   ';
            var b = [2];
            var expected = '-----(x|)';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['1', 2] });
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with observable which raises error and non-empty iterable', function () {
            var a = marble_testing_1.hot('---^----#');
            var asubs = '^    !';
            var b = [1];
            var expected = '-----#';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty many observable and non-empty many iterable', function () {
            var a = marble_testing_1.hot('---^--1--2--3--|');
            var asubs = '^        !   ';
            var b = [4, 5, 6];
            var expected = '---x--y--(z|)';
            marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['1', 4], y: ['2', 5], z: ['3', 6] });
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
        it('should work with non-empty observable and non-empty iterable selector that throws', function () {
            var a = marble_testing_1.hot('---^--1--2--3--|');
            var asubs = '^     !';
            var b = [4, 5, 6];
            var expected = '---x--#';
            var selector = function (x, y) {
                if (y === 5) {
                    throw new Error('too bad');
                }
                else {
                    return x + y;
                }
            };
            marble_testing_1.expectObservable(rxjs_1.zip(a, b, selector)).toBe(expected, { x: '14' }, new Error('too bad'));
            marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        });
    });
    it('should combine two observables and selector', function () {
        var a = marble_testing_1.hot('---1---2---3---');
        var asubs = '^';
        var b = marble_testing_1.hot('--4--5--6--7--8--');
        var bsubs = '^';
        var expected = '---x---y---z';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (e1, e2) { return e1 + e2; }))
            .toBe(expected, { x: '14', y: '25', z: '36' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with n-ary symmetric', function () {
        var a = marble_testing_1.hot('---1-^-1----4----|');
        var asubs = '^         !  ';
        var b = marble_testing_1.hot('---1-^--2--5----| ');
        var bsubs = '^         !  ';
        var c = marble_testing_1.hot('---1-^---3---6-|  ');
        var expected = '----x---y-|  ';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, c)).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with n-ary symmetric selector', function () {
        var a = marble_testing_1.hot('---1-^-1----4----|');
        var asubs = '^         !  ';
        var b = marble_testing_1.hot('---1-^--2--5----| ');
        var bsubs = '^         !  ';
        var c = marble_testing_1.hot('---1-^---3---6-|  ');
        var expected = '----x---y-|  ';
        var observable = rxjs_1.zip(a, b, c, function (r0, r1, r2) { return [r0, r1, r2]; });
        marble_testing_1.expectObservable(observable).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with n-ary symmetric array selector', function () {
        var a = marble_testing_1.hot('---1-^-1----4----|');
        var asubs = '^         !  ';
        var b = marble_testing_1.hot('---1-^--2--5----| ');
        var bsubs = '^         !  ';
        var c = marble_testing_1.hot('---1-^---3---6-|  ');
        var expected = '----x---y-|  ';
        var observable = rxjs_1.zip(a, b, c, function (r0, r1, r2) { return [r0, r1, r2]; });
        marble_testing_1.expectObservable(observable).toBe(expected, { x: ['1', '2', '3'], y: ['4', '5', '6'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with some data asymmetric 1', function () {
        var a = marble_testing_1.hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
        var asubs = '^                 !    ';
        var b = marble_testing_1.hot('---1-^--2--4--6--8--0--|    ');
        var bsubs = '^                 !    ';
        var expected = '---a--b--c--d--e--|    ';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (r1, r2) { return r1 + r2; }))
            .toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with some data asymmetric 2', function () {
        var a = marble_testing_1.hot('---1-^--2--4--6--8--0--|    ');
        var asubs = '^                 !    ';
        var b = marble_testing_1.hot('---1-^-1-3-5-7-9-x-y-z-w-u-|');
        var bsubs = '^                 !    ';
        var expected = '---a--b--c--d--e--|    ';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (r1, r2) { return r1 + r2; }))
            .toBe(expected, { a: '21', b: '43', c: '65', d: '87', e: '09' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with some data symmetric', function () {
        var a = marble_testing_1.hot('---1-^-1-3-5-7-9------| ');
        var asubs = '^                ! ';
        var b = marble_testing_1.hot('---1-^--2--4--6--8--0--|');
        var bsubs = '^                ! ';
        var expected = '---a--b--c--d--e-| ';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b, function (r1, r2) { return r1 + r2; }))
            .toBe(expected, { a: '12', b: '34', c: '56', d: '78', e: '90' });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with selector throws', function () {
        var a = marble_testing_1.hot('---1-^-2---4----|  ');
        var asubs = '^       !     ';
        var b = marble_testing_1.hot('---1-^--3----5----|');
        var bsubs = '^       !     ';
        var expected = '---x----#     ';
        var selector = function (x, y) {
            if (y === '5') {
                throw new Error('too bad');
            }
            else {
                return x + y;
            }
        };
        var observable = rxjs_1.zip(a, b, selector);
        marble_testing_1.expectObservable(observable).toBe(expected, { x: '23' }, new Error('too bad'));
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with right completes first', function () {
        var a = marble_testing_1.hot('---1-^-2-----|');
        var asubs = '^     !';
        var b = marble_testing_1.hot('---1-^--3--|');
        var bsubs = '^     !';
        var expected = '---x--|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: ['2', '3'] });
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two nevers', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^';
        var b = marble_testing_1.cold('-');
        var bsubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and empty', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and never', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('-');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and empty', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and non-empty', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('---1--|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with non-empty and empty', function () {
        var a = marble_testing_1.hot('---1--|');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and non-empty', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^';
        var b = marble_testing_1.hot('---1--|');
        var bsubs = '^     !';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with non-empty and never', function () {
        var a = marble_testing_1.hot('---1--|');
        var asubs = '^     !';
        var b = marble_testing_1.cold('-');
        var bsubs = '^';
        var expected = '-';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with empty and error', function () {
        var a = marble_testing_1.cold('|');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('------#', undefined, 'too bad');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and empty', function () {
        var a = marble_testing_1.hot('------#', undefined, 'too bad');
        var asubs = '(^!)';
        var b = marble_testing_1.cold('|');
        var bsubs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error', function () {
        var a = marble_testing_1.hot('----------|');
        var asubs = '^     !    ';
        var b = marble_testing_1.hot('------#    ');
        var bsubs = '^     !    ';
        var expected = '------#    ';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with never and error', function () {
        var a = marble_testing_1.cold('-');
        var asubs = '^     !';
        var b = marble_testing_1.hot('------#');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and never', function () {
        var a = marble_testing_1.hot('------#');
        var asubs = '^     !';
        var b = marble_testing_1.cold('-');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and error', function () {
        var a = marble_testing_1.hot('------#', undefined, 'too bad');
        var asubs = '^     !';
        var b = marble_testing_1.hot('----------#', undefined, 'too bad 2');
        var bsubs = '^     !';
        var expected = '------#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, null, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two sources that eventually raise errors', function () {
        var a = marble_testing_1.hot('--w-----#----', { w: 1 }, 'too bad');
        var asubs = '^       !';
        var b = marble_testing_1.hot('-----z-----#-', { z: 2 }, 'too bad 2');
        var bsubs = '^       !';
        var expected = '-----x--#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: [1, 2] }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with two sources that eventually raise errors (swapped)', function () {
        var a = marble_testing_1.hot('-----z-----#-', { z: 2 }, 'too bad 2');
        var asubs = '^       !';
        var b = marble_testing_1.hot('--w-----#----', { w: 1 }, 'too bad');
        var bsubs = '^       !';
        var expected = '-----x--#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected, { x: [2, 1] }, 'too bad');
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should work with error and some', function () {
        var a = marble_testing_1.cold('#');
        var asubs = '(^!)';
        var b = marble_testing_1.hot('--1--2--3--');
        var bsubs = '(^!)';
        var expected = '#';
        marble_testing_1.expectObservable(rxjs_1.zip(a, b)).toBe(expected);
        marble_testing_1.expectSubscriptions(a.subscriptions).toBe(asubs);
        marble_testing_1.expectSubscriptions(b.subscriptions).toBe(bsubs);
    });
    it('should combine an immediately-scheduled source with an immediately-scheduled second', function (done) {
        var a = rxjs_1.of(1, 2, 3, queueScheduler);
        var b = rxjs_1.of(4, 5, 6, 7, 8, queueScheduler);
        var r = [[1, 4], [2, 5], [3, 6]];
        var i = 0;
        rxjs_1.zip(a, b).subscribe({ next: function (vals) {
                chai_1.expect(vals).to.deep.equal(r[i++]);
            }, complete: done });
    });
    it('should be able to zip all iterables', function () {
        var results = [];
        rxjs_1.zip('abc', '123', 'xyz').subscribe({
            next: function (value) { return results.push(value); },
            complete: function () { return results.push('complete'); }
        });
        chai_1.expect(results).to.deep.equal([
            ['a', '1', 'x'],
            ['b', '2', 'y'],
            ['c', '3', 'z'],
            'complete'
        ]);
    });
    it('should return EMPTY if passed an empty array as the only argument', function () {
        var results = [];
        rxjs_1.zip([]).subscribe({
            next: function () {
                throw new Error('should not emit');
            },
            complete: function () {
                results.push('done');
            }
        });
        chai_1.expect(results).to.deep.equal(['done']);
    });
});
//# sourceMappingURL=zip-spec.js.map