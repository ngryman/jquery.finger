/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function($) {

    /*
     ======== A Handy Little QUnit Reference ========
     http://docs.jquery.com/QUnit

     Test methods:
     expect(numAssertions)
     stop(increment)
     start(decrement)
     Test assertions:
     ok(value, [message])
     equal(actual, expected, [message])
     notEqual(actual, expected, [message])
     deepEqual(actual, expected, [message])
     notDeepEqual(actual, expected, [message])
     strictEqual(actual, expected, [message])
     notStrictEqual(actual, expected, [message])
     raises(block, [expected], [message])
     */

    var hasTouch = 'ontouchstart' in window,
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        stopEvent = hasTouch ? 'touchend' : 'mouseup',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove';

    module('tap event', {
        setup: function() {
            this.$elems = $('#qunit-fixture .touchme');
        },
        teardown: function() {
            $('body').off();
            this.$elems.text('').off();
            this.$elems = null;
        }
    });

    test('works with direct events', 3, function() {
        this.$elems.on('tap', function() {
            $(this).text('tap');
        });

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('works with delegated events', 3, function() {
        $('body').on('tap', '.touchme', function() {
            $(this).text('tap');
        });

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with delegated events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('fires handlers in order', 3, function() {
        $('body').on('tap', '.touchme', function() {
            $(this).text($(this).text() + 'tip');
        });

        $('body').on('tap', '.touchme', function() {
            $(this).text($(this).text() + 'tap');
        });

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

        strictEqual(this.$elems.filter(':first').text(), 'tiptap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('fires direct/delegated handlers', 3, function() {
        $('.touchme').on('tap', function() {
            $(this).text($(this).text() + 'tip');
        });

        $('body').on('tap', '.touchme', function() {
            $(this).text($(this).text() + 'tap');
        });

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

        strictEqual(this.$elems.filter(':first').text(), 'tiptap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tiptap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tiptap', 'should not fire to last element');
    });

    test('does not fire removed direct events', 3, function() {
        function handler() {
            $(this).text($(this).text() + 'tap');
        }

        $('.touchme').on('tap', handler);

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

        $('.touchme').off('tap', handler);

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('does not fire removed delegated events', 3, function() {
        function handler() {
            $(this).text($(this).text() + 'tap');
        }

        $('body').on('tap', '.touchme', handler);

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

        $('body').off('tap', '.touchme', handler);

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    module('tap hold event', {
        setup: function() {
            this.$elems = $('#qunit-fixture .touchme');
        },
        teardown: function() {
            $('body').off();
            this.$elems.text('').off();
            this.$elems = null;
        }
    });

    asyncTest('works with direct events', 3, function() {
        this.$elems.on('taphold', function() {
            $(this).text('taphold');
        });

        this.$elems.filter(':first').trigger(startEvent);
        setTimeout($.proxy(function() {
            this.$elems.filter(':first').trigger(stopEvent);

            strictEqual(this.$elems.filter(':first').text(), 'taphold', 'should work with direct events');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        }, this), $.Finger.tapHoldDuration);
    });

    asyncTest('works with delegated events', 3, function() {
        $('body').on('taphold', '.touchme', function() {
            $(this).text('taphold');
        });

        this.$elems.filter(':first').trigger(startEvent);
        setTimeout($.proxy(function() {
            this.$elems.filter(':first').trigger(stopEvent);

            strictEqual(this.$elems.filter(':first').text(), 'taphold', 'should work with delegated events');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        }, this), $.Finger.tapHoldDuration);
    });

    asyncTest('does not fire tap event', 3, function() {
        this.$elems.on('tap', function() {
            $(this).text('tap');
        });

        this.$elems.on('taphold', function() {
            $(this).text('taphold');
        });

        this.$elems.filter(':first').trigger(startEvent);
        setTimeout($.proxy(function() {
            this.$elems.filter(':first').trigger(stopEvent);

            strictEqual(this.$elems.filter(':first').text(), 'taphold', 'should fire tap event');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        }, this), $.Finger.tapHoldDuration);
    });

    asyncTest('does not trigger taphold when tapping twice', 3, function() {
        this.$elems.on('taphold', function() {
            $(this).text('taphold');
        });

        this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);
        setTimeout($.proxy(function() {
            this.$elems.filter(':first').trigger(startEvent).trigger(stopEvent);

            notEqual(this.$elems.filter(':first').text(), 'taphold', 'should not fire taphold event');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        }, this), $.Finger.tapHoldDuration);
    });

}(jQuery));