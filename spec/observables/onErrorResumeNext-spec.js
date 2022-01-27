"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var marble_testing_1 = require("../helpers/marble-testing");
var operators_1 = require("rxjs/operators");
var chai_1 = require("chai");
describe('onErrorResumeNext', function () {
    it('should continue with observables', function () {
        var s1 = marble_testing_1.hot('--a--b--#');
        var s2 = marble_testing_1.cold('--c--d--#');
        var s3 = marble_testing_1.cold('--e--#');
        var s4 = marble_testing_1.cold('--f--g--|');
        var subs1 = '^       !';
        var subs2 = '        ^       !';
        var subs3 = '                ^    !';
        var subs4 = '                     ^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(rxjs_1.onErrorResumeNext(s1, s2, s3, s4)).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs1);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(subs2);
        marble_testing_1.expectSubscriptions(s3.subscriptions).toBe(subs3);
        marble_testing_1.expectSubscriptions(s4.subscriptions).toBe(subs4);
    });
    it('should continue array of observables', function () {
        var s1 = marble_testing_1.hot('--a--b--#');
        var s2 = marble_testing_1.cold('--c--d--#');
        var s3 = marble_testing_1.cold('--e--#');
        var s4 = marble_testing_1.cold('--f--g--|');
        var subs1 = '^       !';
        var subs2 = '        ^       !';
        var subs3 = '                ^    !';
        var subs4 = '                     ^       !';
        var expected = '--a--b----c--d----e----f--g--|';
        marble_testing_1.expectObservable(rxjs_1.onErrorResumeNext([s1, s2, s3, s4])).toBe(expected);
        marble_testing_1.expectSubscriptions(s1.subscriptions).toBe(subs1);
        marble_testing_1.expectSubscriptions(s2.subscriptions).toBe(subs2);
        marble_testing_1.expectSubscriptions(s3.subscriptions).toBe(subs3);
        marble_testing_1.expectSubscriptions(s4.subscriptions).toBe(subs4);
    });
    it('should complete single observable throws', function () {
        var source = marble_testing_1.hot('#');
        var subs = '(^!)';
        var expected = '|';
        marble_testing_1.expectObservable(rxjs_1.onErrorResumeNext(source)).toBe(expected);
        marble_testing_1.expectSubscriptions(source.subscriptions).toBe(subs);
    });
    it('should skip invalid sources and move on', function () {
        var results = [];
        rxjs_1.onErrorResumeNext(rxjs_1.of(1), [2, 3, 4], { notValid: 'LOL' }, rxjs_1.of(5, 6))
            .subscribe({
            next: function (value) { return results.push(value); },
            complete: function () { return results.push('complete'); }
        });
        chai_1.expect(results).to.deep.equal([1, 2, 3, 4, 5, 6, 'complete']);
    });
    it('should call finalize after each sync observable', function () {
        var results = [];
        rxjs_1.onErrorResumeNext(rxjs_1.of(1).pipe(operators_1.finalize(function () { return results.push('finalize 1'); })), rxjs_1.of(2).pipe(operators_1.finalize(function () { return results.push('finalize 2'); })), rxjs_1.of(3).pipe(operators_1.finalize(function () { return results.push('finalize 3'); })), rxjs_1.of(4).pipe(operators_1.finalize(function () { return results.push('finalize 4'); }))).subscribe({
            next: function (value) { return results.push(value); },
            complete: function () { return results.push('complete'); }
        });
        chai_1.expect(results).to.deep.equal([
            1, 'finalize 1',
            2, 'finalize 2',
            3, 'finalize 3',
            4, 'finalize 4',
            'complete'
        ]);
    });
});
//# sourceMappingURL=onErrorResumeNext-spec.js.map