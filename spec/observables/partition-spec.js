"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var marble_testing_1 = require("../helpers/marble-testing");
describe('Observable.prototype.partition', function () {
    function expectObservableArray(result, expected) {
        for (var idx = 0; idx < result.length; idx++) {
            marble_testing_1.expectObservable(result[idx]).toBe(expected[idx]);
        }
    }
    it('should partition an observable of ' +
        'integers into even and odd', function () {
        var e1 = marble_testing_1.hot('--1-2---3------4--5---6--|');
        var e1subs = '^                        !';
        var expected = ['--1-----3---------5------|',
            '----2----------4------6--|'];
        var result = rxjs_1.partition(e1, function (x) { return x % 2 === 1; });
        expectObservableArray(result, expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition an observable into two using a predicate', function () {
        var e1 = marble_testing_1.hot('--a-b---a------d--a---c--|');
        var e1subs = '^                        !';
        var expected = ['--a-----a---------a------|',
            '----b----------d------c--|'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition an observable into two using a predicate that takes an index', function () {
        var e1 = marble_testing_1.hot('--a-b---a------d--e---c--|');
        var e1subs = '^                        !';
        var expected = ['--a-----a---------e------|',
            '----b----------d------c--|'];
        function predicate(value, index) {
            return index % 2 === 0;
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition an observable into two using a predicate and thisArg', function () {
        var e1 = marble_testing_1.hot('--a-b---a------d--a---c--|');
        var e1subs = '^                        !';
        var expected = ['--a-----a---------a------|',
            '----b----------d------c--|'];
        function predicate(x) {
            return x === this.value;
        }
        expectObservableArray(rxjs_1.partition(e1, predicate, { value: 'a' }), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should pass errors to both returned observables', function () {
        var e1 = marble_testing_1.hot('--a-b---#');
        var e1subs = '^       !';
        var expected = ['--a-----#',
            '----b---#'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should pass errors to both returned observables if source throws', function () {
        var e1 = marble_testing_1.cold('#');
        var e1subs = '(^!)';
        var expected = ['#',
            '#'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should pass errors to both returned observables if predicate throws', function () {
        var e1 = marble_testing_1.hot('--a-b--a--|');
        var e1subs = '^      !   ';
        var expected = ['--a----#   ',
            '----b--#   '];
        var index = 0;
        var error = 'error';
        function predicate(x) {
            var match = x === 'a';
            if (match && index++ > 1) {
                throw error;
            }
            return match;
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition empty observable if source does not emits', function () {
        var e1 = marble_testing_1.hot('----|');
        var e1subs = '^   !';
        var expected = ['----|',
            '----|'];
        function predicate(x) {
            return x === 'x';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition empty observable if source is empty', function () {
        var e1 = marble_testing_1.cold('|');
        var e1subs = '(^!)';
        var expected = ['|',
            '|'];
        function predicate(x) {
            return x === 'x';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition if source emits single elements', function () {
        var e1 = marble_testing_1.hot('--a--|');
        var e1subs = '^    !';
        var expected = ['--a--|',
            '-----|'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition if predicate matches all of source elements', function () {
        var e1 = marble_testing_1.hot('--a--a--a--a--a--a--a--|');
        var e1subs = '^                      !';
        var expected = ['--a--a--a--a--a--a--a--|',
            '-----------------------|'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition if predicate does not match all of source elements', function () {
        var e1 = marble_testing_1.hot('--b--b--b--b--b--b--b--|');
        var e1subs = '^                      !';
        var expected = ['-----------------------|',
            '--b--b--b--b--b--b--b--|'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition to infinite observable if source does not completes', function () {
        var e1 = marble_testing_1.hot('--a-b---a------d----');
        var e1subs = '^                   ';
        var expected = ['--a-----a-----------',
            '----b----------d----'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition to infinite observable if source never completes', function () {
        var e1 = marble_testing_1.cold('-');
        var e1subs = '^';
        var expected = ['-',
            '-'];
        function predicate(x) {
            return x === 'a';
        }
        expectObservableArray(rxjs_1.partition(e1, predicate), expected);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should partition into two observable with early unsubscription', function () {
        var e1 = marble_testing_1.hot('--a-b---a------d-|');
        var unsub = '       !          ';
        var e1subs = '^      !          ';
        var expected = ['--a-----          ',
            '----b---          '];
        function predicate(x) {
            return x === 'a';
        }
        var result = rxjs_1.partition(e1, predicate);
        for (var idx = 0; idx < result.length; idx++) {
            marble_testing_1.expectObservable(result[idx], unsub).toBe(expected[idx]);
        }
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        var e1 = marble_testing_1.hot('--a-b---a------d-|');
        var e1subs = '^      !          ';
        var expected = ['--a-----          ',
            '----b---          '];
        var unsub = '       !          ';
        var e1Pipe = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
        var result = rxjs_1.partition(e1Pipe, function (x) { return x === 'a'; });
        marble_testing_1.expectObservable(result[0], unsub).toBe(expected[0]);
        marble_testing_1.expectObservable(result[1], unsub).toBe(expected[1]);
        marble_testing_1.expectSubscriptions(e1.subscriptions).toBe([e1subs, e1subs]);
    });
    it('should accept thisArg', function () {
        var thisArg = {};
        rxjs_1.partition(rxjs_1.of(1), function (value) {
            chai_1.expect(this).to.deep.equal(thisArg);
            return true;
        }, thisArg)
            .forEach(function (observable) { return observable.subscribe(); });
    });
});
//# sourceMappingURL=partition-spec.js.map