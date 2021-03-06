"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var rxjs_1 = require("rxjs");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('shareReplay', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should mirror a simple source Observable', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('--1-2---3-4--5-|');
            var sourceSubs = ' ^--------------!';
            var expected = '   --1-2---3-4--5-|';
            var published = source.pipe(operators_1.shareReplay());
            expectObservable(published).toBe(expected);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should do nothing if result is not subscribed', function () {
        var subscribed = false;
        var source = new rxjs_1.Observable(function () {
            subscribed = true;
        });
        source.pipe(operators_1.shareReplay());
        chai_1.expect(subscribed).to.be.false;
    });
    it('should multicast the same values to multiple observers, bufferSize=1', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('    -1-2-3----4-|');
            var sourceSubs = '     ^-----------!';
            var subscriber1 = hot('a|           ');
            var expected1 = '      -1-2-3----4-|';
            var subscriber2 = hot('----b|       ');
            var expected2 = '      ----23----4-|';
            var subscriber3 = hot('--------c|   ');
            var expected3 = '      --------3-4-|';
            var shared = source.pipe(operators_1.shareReplay(1));
            expectObservable(subscriber1.pipe(operators_1.mergeMapTo(shared))).toBe(expected1);
            expectObservable(subscriber2.pipe(operators_1.mergeMapTo(shared))).toBe(expected2);
            expectObservable(subscriber3.pipe(operators_1.mergeMapTo(shared))).toBe(expected3);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should multicast the same values to multiple observers, bufferSize=2', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('    -1-2-----3------4-|');
            var sourceSubs = '     ^-----------------!';
            var subscriber1 = hot('a|                 ');
            var expected1 = '      -1-2-----3------4-|';
            var subscriber2 = hot('----b|             ');
            var expected2 = '      ----(12)-3------4-|';
            var subscriber3 = hot('-----------c|      ');
            var expected3 = '      -----------(23)-4-|';
            var shared = source.pipe(operators_1.shareReplay(2));
            expectObservable(subscriber1.pipe(operators_1.mergeMapTo(shared))).toBe(expected1);
            expectObservable(subscriber2.pipe(operators_1.mergeMapTo(shared))).toBe(expected2);
            expectObservable(subscriber3.pipe(operators_1.mergeMapTo(shared))).toBe(expected3);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should multicast an error from the source to multiple observers', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('    -1-2-3----4-#');
            var sourceSubs = '     ^-----------!';
            var subscriber1 = hot('a|           ');
            var expected1 = '      -1-2-3----4-#';
            var subscriber2 = hot('----b|       ');
            var expected2 = '      ----23----4-#';
            var subscriber3 = hot('--------c|   ');
            var expected3 = '      --------3-4-#';
            var shared = source.pipe(operators_1.shareReplay(1));
            expectObservable(subscriber1.pipe(operators_1.mergeMapTo(shared))).toBe(expected1);
            expectObservable(subscriber2.pipe(operators_1.mergeMapTo(shared))).toBe(expected2);
            expectObservable(subscriber3.pipe(operators_1.mergeMapTo(shared))).toBe(expected3);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should multicast an empty source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('|   ');
            var sourceSubs = ' (^!)';
            var expected = '   |   ';
            var shared = source.pipe(operators_1.shareReplay(1));
            expectObservable(shared).toBe(expected);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should multicast a never source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('-');
            var sourceSubs = ' ^';
            var expected = '   -';
            var shared = source.pipe(operators_1.shareReplay(1));
            expectObservable(shared).toBe(expected);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should multicast a throw source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('#   ');
            var sourceSubs = ' (^!)';
            var expected = '   #   ';
            var shared = source.pipe(operators_1.shareReplay(1));
            expectObservable(shared).toBe(expected);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should replay results to subsequent subscriptions if source completes, bufferSize=2', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('    -1-2-----3-|        ');
            var sourceSubs = '     ^----------!        ';
            var subscriber1 = hot('a|                  ');
            var expected1 = '      -1-2-----3-|        ';
            var subscriber2 = hot('----b|              ');
            var expected2 = '      ----(12)-3-|        ';
            var subscriber3 = hot('---------------(c|) ');
            var expected3 = '      ---------------(23|)';
            var shared = source.pipe(operators_1.shareReplay(2));
            expectObservable(subscriber1.pipe(operators_1.mergeMapTo(shared))).toBe(expected1);
            expectObservable(subscriber2.pipe(operators_1.mergeMapTo(shared))).toBe(expected2);
            expectObservable(subscriber3.pipe(operators_1.mergeMapTo(shared))).toBe(expected3);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should completely restart for subsequent subscriptions if source errors, bufferSize=2', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('    -1-2-----3-#               ');
            var sourceSubs1 = '    ^----------!               ';
            var subscriber1 = hot('a|                         ');
            var expected1 = '      -1-2-----3-#               ';
            var subscriber2 = hot('----b|                     ');
            var expected2 = '      ----(12)-3-#               ';
            var subscriber3 = hot('---------------(c|)        ');
            var expected3 = '      ----------------1-2-----3-#';
            var sourceSubs2 = '    ---------------^----------!';
            var shared = source.pipe(operators_1.shareReplay(2));
            expectObservable(subscriber1.pipe(operators_1.mergeMapTo(shared))).toBe(expected1);
            expectObservable(subscriber2.pipe(operators_1.mergeMapTo(shared))).toBe(expected2);
            expectObservable(subscriber3.pipe(operators_1.mergeMapTo(shared))).toBe(expected3);
            expectSubscriptions(source.subscriptions).toBe([sourceSubs1, sourceSubs2]);
        });
    });
    it('should be retryable, bufferSize=2', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var subs = [];
            var source = cold('    -1-2-----3-#                      ');
            subs.push('              ^----------!                      ');
            subs.push('              -----------^----------!           ');
            subs.push('              ----------------------^----------!');
            var subscriber1 = hot('a|                                ');
            var expected1 = '      -1-2-----3--1-2-----3-#           ';
            var subscriber2 = hot('----b|                            ');
            var expected2 = '      ----(12)-3--1-2-----3-#           ';
            var subscriber3 = hot('---------------(c|)               ');
            var expected3 = '      ---------------(12)-3--1-2-----3-#';
            var shared = source.pipe(operators_1.shareReplay(2), operators_1.retry(1));
            expectObservable(subscriber1.pipe(operators_1.mergeMapTo(shared))).toBe(expected1);
            expectObservable(subscriber2.pipe(operators_1.mergeMapTo(shared))).toBe(expected2);
            expectObservable(subscriber3.pipe(operators_1.mergeMapTo(shared))).toBe(expected3);
            expectSubscriptions(source.subscriptions).toBe(subs);
        });
    });
    it('when no windowTime is given ReplaySubject should be in _infiniteTimeWindow mode', function () {
        var spy = sinon.spy(testScheduler, 'now');
        rxjs_1.of(1).pipe(operators_1.shareReplay(1, undefined, testScheduler)).subscribe();
        spy.restore();
        chai_1.expect(spy, 'ReplaySubject should not call scheduler.now() when no windowTime is given').to.be.not.called;
    });
    it('should not restart due to unsubscriptions if refCount is false', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('a-b-c-d-e-f-g-h-i-j');
            var sourceSubs = ' ^------------------';
            var sub1 = '       ^------!           ';
            var expected1 = '  a-b-c-d-           ';
            var sub2 = '       -----------^-------';
            var expected2 = '  -----------fg-h-i-j';
            var shared = source.pipe(operators_1.shareReplay({ bufferSize: 1, refCount: false }));
            expectObservable(shared, sub1).toBe(expected1);
            expectObservable(shared, sub2).toBe(expected2);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should restart due to unsubscriptions if refCount is true', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var sourceSubs = [];
            var source = cold('a-b-c-d-e-f-g-h-i-j           ');
            sourceSubs.push('    ^------!----------------------');
            sourceSubs.push('    -----------^------------------');
            var sub1 = '       ^------!                      ';
            var expected1 = '  a-b-c-d-                      ';
            var sub2 = '       -----------^------------------';
            var expected2 = '  -----------a-b-c-d-e-f-g-h-i-j';
            var shared = source.pipe(operators_1.shareReplay({ bufferSize: 1, refCount: true }));
            expectObservable(shared, sub1).toBe(expected1);
            expectObservable(shared, sub2).toBe(expected2);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should not restart due to unsubscriptions if refCount is true when the source has completed', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('a-(b|)         ');
            var sourceSubs = ' ^-!            ';
            var sub1 = '       ^------!       ';
            var expected1 = '  a-(b|)         ';
            var sub2 = '       -----------^!  ';
            var expected2 = '  -----------(b|)';
            var shared = source.pipe(operators_1.shareReplay({ bufferSize: 1, refCount: true }));
            expectObservable(shared, sub1).toBe(expected1);
            expectObservable(shared, sub2).toBe(expected2);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should not restart a synchronous source due to unsubscriptions if refCount is true when the source has completed', function () {
        var subscriptions = 0;
        var source = rxjs_1.defer(function () {
            ++subscriptions;
            return rxjs_1.of(42);
        }).pipe(operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        source.subscribe();
        source.subscribe();
        chai_1.expect(subscriptions).to.equal(1);
    });
    it('should default to refCount being false', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source = cold('a-b-c-d-e-f-g-h-i-j');
            var sourceSubs = ' ^------------------';
            var sub1 = '       ^------!           ';
            var expected1 = '  a-b-c-d-           ';
            var sub2 = '       -----------^-------';
            var expected2 = '  -----------fg-h-i-j';
            var shared = source.pipe(operators_1.shareReplay(1));
            expectObservable(shared, sub1).toBe(expected1);
            expectObservable(shared, sub2).toBe(expected2);
            expectSubscriptions(source.subscriptions).toBe(sourceSubs);
        });
    });
    it('should not break lift() composability', function (done) {
        var MyCustomObservable = (function (_super) {
            __extends(MyCustomObservable, _super);
            function MyCustomObservable() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MyCustomObservable.prototype.lift = function (operator) {
                var observable = new MyCustomObservable();
                observable.source = this;
                observable.operator = operator;
                return observable;
            };
            return MyCustomObservable;
        }(rxjs_1.Observable));
        var result = new MyCustomObservable(function (observer) {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(operators_1.shareReplay());
        chai_1.expect(result instanceof MyCustomObservable).to.be.true;
        var expected = [1, 2, 3];
        result.subscribe({
            next: function (n) {
                chai_1.expect(expected.length).to.be.greaterThan(0);
                chai_1.expect(n).to.equal(expected.shift());
            },
            error: function () {
                done(new Error('should not be called'));
            },
            complete: function () {
                done();
            },
        });
    });
    it('should not skip values on a sync source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var a = rxjs_1.from(['a', 'b', 'c', 'd']);
            var x = cold('  x-------x');
            var expected = '(abcd)--d';
            var shared = a.pipe(operators_1.shareReplay(1));
            var result = x.pipe(operators_1.mergeMapTo(shared));
            expectObservable(result).toBe(expected);
        });
    });
    it('should stop listening to a synchronous observable when unsubscribed', function () {
        var sideEffects = [];
        var synchronousObservable = new rxjs_1.Observable(function (subscriber) {
            for (var i = 0; !subscriber.closed && i < 10; i++) {
                sideEffects.push(i);
                subscriber.next(i);
            }
        });
        synchronousObservable.pipe(operators_1.shareReplay({ refCount: true }), operators_1.take(3)).subscribe(function () {
        });
        chai_1.expect(sideEffects).to.deep.equal([0, 1, 2]);
    });
    var FinalizationRegistry = global.FinalizationRegistry;
    if (FinalizationRegistry && global.gc) {
        it('should not leak the subscriber for sync sources', function (done) {
            var _a;
            var callback = function () {
            };
            var registry = new FinalizationRegistry(function (value) {
                chai_1.expect(value).to.equal('callback');
                done();
            });
            registry.register(callback, 'callback');
            var shared = rxjs_1.of(42).pipe(operators_1.shareReplay(1));
            shared.subscribe(callback);
            callback = undefined;
            (_a = global.gc) === null || _a === void 0 ? void 0 : _a.call(global);
        });
    }
    else {
        console.warn("No support for FinalizationRegistry in Node " + process.version);
    }
    it('should be referentially-transparent', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var source1 = cold('-1-2-3-4-5-|');
            var source1Subs = ' ^----------!';
            var expected1 = '   -1-2-3-4-5-|';
            var source2 = cold('-6-7-8-9-0-|');
            var source2Subs = ' ^----------!';
            var expected2 = '   -6-7-8-9-0-|';
            var partialPipeLine = rxjs_1.pipe(operators_1.shareReplay({ refCount: false }));
            var shared1 = source1.pipe(partialPipeLine);
            var shared2 = source2.pipe(partialPipeLine);
            expectObservable(shared1).toBe(expected1);
            expectSubscriptions(source1.subscriptions).toBe(source1Subs);
            expectObservable(shared2).toBe(expected2);
            expectSubscriptions(source2.subscriptions).toBe(source2Subs);
        });
    });
});
//# sourceMappingURL=shareReplay-spec.js.map