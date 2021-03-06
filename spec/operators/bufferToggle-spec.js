"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('bufferToggle operator', function () {
    var testScheduler;
    beforeEach(function () {
        testScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit buffers using hot openings and hot closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, expectObservable = _a.expectObservable;
            var e1 = hot('  ---a---b---c---d---e---f---g---|');
            var e2 = hot('  --o------------------o---------|');
            var e3 = hot('  ---------c---------------c-----|');
            var expected = '---------x---------------y-----|';
            var values = {
                x: ['a', 'b'],
                y: ['f'],
            };
            var result = e1.pipe(operators_1.bufferToggle(e2, function (x) { return e3; }));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should emit buffers that are opened by an observable from the first argument ' +
        'and closed by an observable returned by the function in the second argument', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = hot('  -----a----b----c----d----e----f----g----h----i----|');
            var e2 = cold(' -------------x-------------y--------------z-------|');
            var e3 = cold('              ---------------(j|)');
            var expected = '----------------------------q-------------r-------(s|)';
            var values = {
                q: ['c', 'd', 'e'],
                r: ['f', 'g', 'h'],
                s: ['i']
            };
            var innerVals = ['x', 'y', 'z'];
            expectObservable(e1.pipe(operators_1.bufferToggle(e2, function (x) {
                chai_1.expect(x).to.equal(innerVals.shift());
                return e3;
            }))).toBe(expected, values);
        });
    });
    it('should emit buffers using varying cold closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var e2 = cold('    --x-----------y--------z---|              ');
            var subs = '       ^----------------------------------!      ';
            var closings = [
                cold('               ---------------s--|                     '),
                cold('                           ----(s|)                    '),
                cold('                                    ---------------(s|)')
            ];
            var closeSubs = [
                '                 --^--------------!                         ',
                '                 --------------^---!                        ',
                '                 -----------------------^-----------!       '
            ];
            var expected = '  -----------------ij----------------(k|)    ';
            var values = {
                i: ['b', 'c', 'd', 'e'],
                j: ['e'],
                k: ['g', 'h']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
        });
    });
    it('should emit buffers using varying hot closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|   ');
            var e2 = cold('    --x-----------y--------z---|           ');
            var subs = '       ^----------------------------------!   ';
            var closings = [
                {
                    obs: hot('   -1--^----------------s-|                   '),
                    sub: '           --^--------------!                     '
                },
                {
                    obs: hot('       -----3----4-------(s|)                 '),
                    sub: '           --------------^---!                    '
                },
                {
                    obs: hot('       -------3----4-------5----------------s|'),
                    sub: '           -----------------------^-----------!   '
                }
            ];
            var expected = '   -----------------ij----------------(k|)';
            var values = {
                i: ['b', 'c', 'd', 'e'],
                j: ['e'],
                k: ['g', 'h']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++].obs; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            for (var j = 0; j < closings.length; j++) {
                expectSubscriptions(closings[j].obs.subscriptions).toBe(closings[j].sub);
            }
        });
    });
    it('should emit buffers using varying empty delayed closings', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|     ');
            var e2 = cold('    --x-----------y--------z---|             ');
            var subs = '       ^----------------------------------!     ';
            var closings = [
                cold('               ---------------|                       '),
                cold('                           ----|                      '),
                cold('                                    ---------------|  ')
            ];
            var expected = '   -----------------------------------(ijk|)';
            var values = {
                i: ['b', 'c', 'd', 'e', 'f', 'g', 'h'],
                j: ['e', 'f', 'g', 'h'],
                k: ['g', 'h']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should emit buffers using varying cold closings, outer unsubscribed early', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var subs = '       ^---------!                               ';
            var e2 = cold('    --x-----------y--------z---|              ');
            var closings = [
                cold('               ---------------s--|                     '),
                cold('                           ----(s|)                    '),
                cold('                                    ---------------(s|)')
            ];
            var csub0 = '      --^-------!                               ';
            var expected = '   -----------                               ';
            var unsub = '      ----------!                               ';
            var values = {
                i: ['b', 'c', 'd', 'e']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++]; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(csub0);
            expectSubscriptions(closings[1].subscriptions).toBe([]);
            expectSubscriptions(closings[2].subscriptions).toBe([]);
        });
    });
    it('should not break unsubscription chains when result is unsubscribed explicitly', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var subs = '       ^-----------------!                       ';
            var e2 = cold('    --x-----------y--------z---|              ');
            var closings = [
                cold('               ---------------s--|                     '),
                cold('                           ----(s|)                    '),
                cold('                                    ---------------(s|)')
            ];
            var expected = '   -----------------i-                       ';
            var unsub = '      ------------------!                       ';
            var values = {
                i: ['b', 'c', 'd', 'e']
            };
            var i = 0;
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.bufferToggle(e2, function () { return closings[i++]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should propagate error thrown from closingSelector', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|      ');
            var e2 = cold('    --x-----------y--------z---|              ');
            var subs = '       ^-------------!                           ';
            var closings = [
                cold('               ---------------s--|                     '),
                cold('                           ----(s|)                    '),
                cold('                                    ---------------(s|)')
            ];
            var closeSubs0 = ' --^-----------!                           ';
            var expected = '   --------------#                           ';
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () {
                if (i === 1) {
                    throw 'error';
                }
                return closings[i++];
            }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs0);
            expectSubscriptions(closings[1].subscriptions).toBe([]);
            expectSubscriptions(closings[2].subscriptions).toBe([]);
        });
    });
    it('should propagate error emitted from a closing', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var e2 = cold('    --x-----------y--------z---|        ');
            var subs = '       ^-------------!                     ';
            var closings = [
                cold('               ---------------s--|               '),
                cold('                           #                     ')
            ];
            var closeSubs = [
                '                  --^-----------!                     ',
                '                  --------------(^!)                  '
            ];
            var expected = '   --------------#                     ';
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++]; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should propagate error emitted late from a closing', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var e2 = cold('    --x-----------y--------z---|        ');
            var subs = '       ^------------------!                ';
            var closings = [
                cold('               ---------------s--|               '),
                cold('                           -----#                ')
            ];
            var closeSubs = [
                '                  --^--------------!                  ',
                '                  --------------^----!                '
            ];
            var expected = '   -----------------i-#                ';
            var values = {
                i: ['b', 'c', 'd', 'e']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should handle errors', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e--#        ');
            var e2 = cold('    --x-----------y--------z---|');
            var subs = '       ^------------------!        ';
            var closings = [
                cold('               ---------------s--|       '),
                cold('                           -------s|     ')
            ];
            var closeSubs = [
                '                  --^--------------!          ',
                '                  --------------^----!        '
            ];
            var expected = '   -----------------i-#        ';
            var values = {
                i: ['b', 'c', 'd', 'e']
            };
            var i = 0;
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should handle empty source', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold(' |');
            var e2 = cold(' --o-----|');
            var e3 = cold('   -----c--|');
            var expected = '|';
            var values = { x: [] };
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return e3; }));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should handle throw', function () {
        testScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = cold(' #');
            var e2 = cold(' --o-----|');
            var e3 = cold('   -----c--|');
            var expected = '#';
            var values = { x: [] };
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return e3; }));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should handle never', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('  -');
            var e2 = cold(' --o-----o------o-----o---o-----|');
            var e3 = cold('   --c-|');
            var unsub = '   --------------------------------------------!';
            var subs = '    ^-------------------------------------------!';
            var expected = '----x-----x------x-----x---x-----------------';
            var values = { x: [] };
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return e3; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
    it('should handle a never opening Observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var e2 = cold('    -');
            var e3 = cold('   --c-|');
            var expected = '   -----------------------------------|';
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return e3; }));
            expectObservable(result).toBe(expected);
        });
    });
    it('should handle a never closing Observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|    ');
            var e2 = cold('    ---o---------------o-----------|        ');
            var e3 = cold('    -');
            var expected = '   -----------------------------------(xy|)';
            var values = {
                x: ['b', 'c', 'd', 'e', 'f', 'g', 'h'],
                y: ['f', 'g', 'h']
            };
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return e3; }));
            expectObservable(result).toBe(expected, values);
        });
    });
    it('should handle opening Observable that just throws', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|');
            var e1subs = '     (^!)';
            var e2 = cold('    #');
            var e2subs = '     (^!)';
            var e3 = cold('    --c-|');
            var expected = '   #';
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return e3; }));
            expectObservable(result).toBe(expected);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should accept openings resolved promise', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.timer(10).pipe(operators_1.mapTo(1)), rxjs_1.timer(100).pipe(operators_1.mapTo(2)), rxjs_1.timer(150).pipe(operators_1.mapTo(3)), rxjs_1.timer(200).pipe(operators_1.mapTo(4)));
        var expected = [[1]];
        e1.pipe(operators_1.bufferToggle(new Promise(function (resolve) { resolve(42); }), function () {
            return rxjs_1.timer(50);
        })).subscribe({ next: function (x) {
                chai_1.expect(x).to.deep.equal(expected.shift());
            }, error: function (x) {
                done(new Error('should not be called'));
            }, complete: function () {
                chai_1.expect(expected.length).to.be.equal(0);
                done();
            } });
    });
    it('should accept openings rejected promise', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(100).pipe(operators_1.mapTo(4)));
        var expected = 42;
        e1.pipe(operators_1.bufferToggle(new Promise(function (resolve, reject) { reject(expected); }), function () {
            return rxjs_1.timer(50);
        })).subscribe({ next: function (x) {
                done(new Error('should not be called'));
            }, error: function (x) {
                chai_1.expect(x).to.equal(expected);
                done();
            }, complete: function () {
                done(new Error('should not be called'));
            } });
    });
    it('should accept closing selector that returns a resolved promise', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(100).pipe(operators_1.mapTo(4)));
        var expected = [[1]];
        e1.pipe(operators_1.bufferToggle(rxjs_1.of(10), function () { return new Promise(function (resolve) { resolve(42); }); }))
            .subscribe({ next: function (x) {
                chai_1.expect(x).to.deep.equal(expected.shift());
            }, error: function () {
                done(new Error('should not be called'));
            }, complete: function () {
                chai_1.expect(expected.length).to.be.equal(0);
                done();
            } });
    });
    it('should accept closing selector that returns a rejected promise', function (done) {
        var e1 = rxjs_1.concat(rxjs_1.of(1), rxjs_1.timer(10).pipe(operators_1.mapTo(2)), rxjs_1.timer(10).pipe(operators_1.mapTo(3)), rxjs_1.timer(100).pipe(operators_1.mapTo(4)));
        var expected = 42;
        e1.pipe(operators_1.bufferToggle(rxjs_1.of(10), function () { return new Promise(function (resolve, reject) { reject(expected); }); }))
            .subscribe({ next: function (x) {
                done(new Error('should not be called'));
            }, error: function (x) {
                chai_1.expect(x).to.equal(expected);
                done();
            }, complete: function () {
                done(new Error('should not be called'));
            } });
    });
    it('should handle empty closing observable', function () {
        testScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|     ');
            var subs = '       ^----------------------------------!     ';
            var e2 = cold('    --x-----------y--------z---|             ');
            var expected = '   -----------------------------------(ijk|)';
            var values = {
                i: ['b', 'c', 'd', 'e', 'f', 'g', 'h'],
                j: ['e', 'f', 'g', 'h'],
                k: ['g', 'h']
            };
            var result = e1.pipe(operators_1.bufferToggle(e2, function () { return rxjs_1.EMPTY; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
        });
    });
});
//# sourceMappingURL=bufferToggle-spec.js.map