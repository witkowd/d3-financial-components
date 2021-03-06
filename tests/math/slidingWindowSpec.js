(function(d3, fc) {
    'use strict';

    describe('fc.math.slidingWindow', function() {

        it('should not call accumulator for an empty data array', function() {
            var slidingWindow = fc.math.slidingWindow()
                .accumulator(function() { throw new Error('FAIL'); })
                .windowSize(2);
            expect(slidingWindow([])).toEqual([]);
        });

        it('should not call accumulator for a data array smaller than the window windowSize', function() {
            var slidingWindow = fc.math.slidingWindow()
                .accumulator(function() { throw new Error('FAIL'); })
                .windowSize(2);
            expect(slidingWindow([0])).toEqual([]);
        });

        it('should call accumulator once for a data array equal in length to the window windowSize', function() {
            var data = [0, 1];
            var accumulatedValue = {};

            var slidingWindow = fc.math.slidingWindow()
                .accumulator(function(d) {
                    expect(d).toEqual(data);
                    return accumulatedValue;
                })
                .windowSize(2);
            expect(slidingWindow(data)).toEqual([accumulatedValue]);
        });

        it('should call accumulator multiple times for data arrays longer than window windowSize', function() {
            var data = [0, 1, 2];
            var accumulatedValue = {};
            var i = 0;

            var slidingWindow = fc.math.slidingWindow()
                .accumulator(function(d) {
                    i++;
                    // N.B. Jasmine Spies compare arguments by reference
                    // https://github.com/jasmine/jasmine/issues/444
                    if (i === 1) {
                        expect(d).toEqual([0, 1]);
                    } else if (i === 2) {
                        expect(d).toEqual([1, 2]);
                    } else {
                        throw new Error('FAIL ' + i);
                    }
                    return accumulatedValue;
                })
                .windowSize(2);
            expect(slidingWindow(data)).toEqual([accumulatedValue, accumulatedValue]);
        });

        it('should work with the built-in d3 accumulator functions', function() {
            var data = [0, 1, 2];

            var movingAverage = fc.math.slidingWindow()
                .accumulator(d3.mean)
                .windowSize(2);
            expect(movingAverage(data)).toEqual([0.5, 1.5]);
        });
    });

}(d3, fc));