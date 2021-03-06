"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var testing_1 = require("rxjs/testing");
var observableMatcher_1 = require("../helpers/observableMatcher");
describe('windowWhen', function () {
    var rxTestScheduler;
    beforeEach(function () {
        rxTestScheduler = new testing_1.TestScheduler(observableMatcher_1.observableMatcher);
    });
    it('should emit windows that close and reopen', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e2 = cold('       -----------|                ');
            var e2subs = [
                '                     ^----------!                ',
                '                     -----------^----------!     ',
                '                     ----------------------^----!',
            ];
            var e1 = hot('   --a--^--b--c--d--e--f--g--h--i--|');
            var e1subs = '        ^--------------------------!';
            var expected = '      a----------b----------c----|';
            var a = cold('        ---b--c--d-|                ');
            var b = cold('                   -e--f--g--h|     ');
            var c = cold('                              --i--|');
            var values = { a: a, b: b, c: c };
            var source = e1.pipe(operators_1.windowWhen(function () { return e2; }));
            expectObservable(source).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should emit windows using varying cold closings', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('               -----------------s--|                    '),
                cold('                                -----(s|)               '),
                cold('                                     ---------------(s|)'),
            ];
            var closeSubs = [
                '                    ^----------------!                       ',
                '                    -----------------^----!                  ',
                '                    ----------------------^------------!     ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|     ');
            var e1subs = '       ^----------------------------------!     ';
            var expected = '     x----------------y----z------------|     ';
            var x = cold('       ----b---c---d---e|                       ');
            var y = cold('                        ---f-|                  ');
            var z = cold('                             --g---h------|     ');
            var values = { x: x, y: y, z: z };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
        });
    });
    it('should emit windows using varying hot closings', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                hot('            -1--^----------------s-|                   '),
                hot('                -----3----4-----------(s|)             '),
                hot('                -------3----4-------5----------------s|'),
            ];
            var closeSubs = [
                '                    ^----------------!                     ',
                '                    -----------------^----!                ',
                '                    ----------------------^------------!   ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|   ');
            var subs = '         ^----------------------------------!   ';
            var expected = '     x----------------y----z------------|   ';
            var x = cold('       ----b---c---d---e|                     ');
            var y = cold('                        ---f-|                ');
            var z = cold('                             --g---h------|   ');
            var values = { x: x, y: y, z: z };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
        });
    });
    it('should emit windows using varying empty delayed closings', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('             -----------------|                    '),
                cold('                              -----|               '),
                cold('                                   ---------------|'),
            ];
            var closeSubs = [
                '                  ^----------------!                    ',
                '                  -----------------^----!               ',
                '                  ----------------------^------------!  ',
            ];
            var e1 = hot('--a--^---b---c---d---e---f---g---h------|  ');
            var e1subs = '     ^----------------------------------!  ';
            var expected = '   x----------------y----z------------|  ';
            var x = cold('     ----b---c---d---e|                    ');
            var y = cold('                      ---f-|               ');
            var z = cold('                           --g---h------|  ');
            var values = { x: x, y: y, z: z };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
            expectSubscriptions(closings[2].subscriptions).toBe(closeSubs[2]);
        });
    });
    it('should emit windows using varying cold closings, outer unsubscribed early', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('               -----------------s--|               '),
                cold('                                ---------(s|)      '),
            ];
            var closeSubs = [
                '                    ^----------------!                  ',
                '                    -----------------^---!              ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|');
            var e1subs = '       ^--------------------!              ';
            var expected = '     x----------------y----              ';
            var unsub = '        ---------------------!              ';
            var x = cold('       ----b---c---d---e|                  ');
            var y = cold('                        ---f-              ');
            var values = { x: x, y: y };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should not break unsubscription chain when unsubscribed explicitly', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('               -----------------s--|               '),
                cold('                                ---------(s|)      '),
            ];
            var closeSubs = [
                '                    ^----------------!                  ',
                '                    -----------------^---!              ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|');
            var e1subs = '       ^--------------------!              ';
            var expected = '     x----------------y----              ';
            var unsub = '        ---------------------!              ';
            var x = cold('       ----b---c---d---e|                  ');
            var y = cold('                        ---f-              ');
            var values = { x: x, y: y };
            var i = 0;
            var result = e1.pipe(operators_1.mergeMap(function (x) { return rxjs_1.of(x); }), operators_1.windowWhen(function () { return closings[i++]; }), operators_1.mergeMap(function (x) { return rxjs_1.of(x); }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should propagate error thrown from closingSelector', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('                 -----------------s--|                    '),
                cold('                                  -----(s|)               '),
                cold('                                       ---------------(s|)'),
            ];
            var closeSubs = ['     ^----------------!                       '];
            var e1 = hot('    --a--^---b---c---d---e---f---g---h------|     ');
            var e1subs = '         ^----------------!                       ';
            var expected = '       x----------------(y#)                    ';
            var x = cold('         ----b---c---d---e|                       ');
            var y = cold('                          #                       ');
            var values = { x: x, y: y };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () {
                if (i === 1) {
                    throw 'error';
                }
                return closings[i++];
            }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
        });
    });
    it('should propagate error emitted from a closing', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('               -----------------s--|               '),
                cold('                                #                  '),
            ];
            var closeSubs = [
                '                    ^----------------!                  ',
                '                    -----------------(^!)               ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|');
            var e1subs = '       ^----------------!                  ';
            var expected = '     x----------------(y#)               ';
            var x = cold('       ----b---c---d---e|                  ');
            var y = cold('                        #                  ');
            var values = { x: x, y: y };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should propagate error emitted late from a closing', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('               -----------------s--|               '),
                cold('                                -----#             '),
            ];
            var closeSubs = [
                '                    ^----------------!                  ',
                '                    -----------------^----!             ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|');
            var e1subs = '       ^---------------------!             ';
            var expected = '     x----------------y----#             ';
            var x = cold('       ----b---c---d---e|                  ');
            var y = cold('                        ---f-#             ');
            var values = { x: x, y: y };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should propagate errors emitted from the source', function () {
        rxTestScheduler.run(function (_a) {
            var hot = _a.hot, cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var closings = [
                cold('               -----------------s--|       '),
                cold('                                -------(s|)'),
            ];
            var closeSubs = [
                '                    ^----------------!          ',
                '                    -----------------^----!     ',
            ];
            var e1 = hot('  --a--^---b---c---d---e---f-#     ');
            var e1subs = '       ^---------------------!     ';
            var expected = '     x----------------y----#     ';
            var x = cold('       ----b---c---d---e|          ');
            var y = cold('                        ---f-#     ');
            var values = { x: x, y: y };
            var i = 0;
            var result = e1.pipe(operators_1.windowWhen(function () { return closings[i++]; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(closings[0].subscriptions).toBe(closeSubs[0]);
            expectSubscriptions(closings[1].subscriptions).toBe(closeSubs[1]);
        });
    });
    it('should handle empty source', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e2 = cold(' -----c--|');
            var e2subs = '  (^!)     ';
            var e1 = cold(' |        ');
            var e1subs = '  (^!)     ';
            var expected = '(w|)     ';
            var win = cold('|        ');
            var values = { w: win };
            var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle a never source', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e2 = cold(' -----c--|         ');
            var e2subs = [
                '               ^----!            ',
                '               -----^----!       ',
                '               ----------^----!  ',
                '               ---------------^-!',
            ];
            var e1 = cold(' -                 ');
            var e1subs = '  ^----------------!';
            var expected = 'a----b----c----d--';
            var unsub = '   -----------------!';
            var win = cold('-----|');
            var d = cold('                 ---');
            var values = { a: win, b: win, c: win, d: d };
            var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
            expectObservable(result, unsub).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle throw', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e2 = cold(' -----c--|');
            var e2subs = '  (^!)     ';
            var e1 = cold(' #        ');
            var e1subs = '  (^!)     ';
            var expected = '(w#)     ';
            var win = cold('#        ');
            var values = { w: win };
            var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle a never closing Observable', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e2 = cold('      -                                  ');
            var e2subs = '       ^----------------------------------!';
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|');
            var e1subs = '       ^----------------------------------!';
            var expected = '     x----------------------------------|';
            var x = cold('       ----b---c---d---e---f---g---h------|');
            var values = { x: x };
            var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
    it('should handle a throw closing Observable', function () {
        rxTestScheduler.run(function (_a) {
            var cold = _a.cold, hot = _a.hot, expectObservable = _a.expectObservable, expectSubscriptions = _a.expectSubscriptions;
            var e2 = cold('      #                                   ');
            var e2subs = '       (^!)                                ';
            var e1 = hot('  --a--^---b---c---d---e---f---g---h------|');
            var e1subs = '       (^!)                                ';
            var expected = '     (x#)                                ';
            var x = cold('       #                                   ');
            var values = { x: x };
            var result = e1.pipe(operators_1.windowWhen(function () { return e2; }));
            expectObservable(result).toBe(expected, values);
            expectSubscriptions(e1.subscriptions).toBe(e1subs);
            expectSubscriptions(e2.subscriptions).toBe(e2subs);
        });
    });
});
//# sourceMappingURL=windowWhen-spec.js.map