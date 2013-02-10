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

    var trigger = {
        tapStart: function(m) {
            m.$elems.filter(':first').trigger(startEvent);
        },
        tapEnd: function(m) {
            m.$elems.filter(':first').trigger(stopEvent);
        },
        tap: function(m) {
            trigger.tapStart(m);
            trigger.tapEnd(m);
        },
        press: function(m, duration, callback) {
            trigger.tapStart(m);
            setTimeout(function() {
                trigger.tapEnd(m);
                callback.call(m);
            }, duration);
        },
        doubleTap: function(m, duration, callback) {
            trigger.tap(m);
            setTimeout(function() {
                trigger.tap(m);
                callback.call(m);
            }, duration);
        }
    };

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

        trigger.tap(this);

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('works with delegated events', 3, function() {
        $('body').on('tap', '.touchme', function() {
            $(this).text('tap');
        });

        trigger.tap(this);

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

        trigger.tap(this);

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

        trigger.tap(this);

        strictEqual(this.$elems.filter(':first').text(), 'tiptap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tiptap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tiptap', 'should not fire to last element');
    });

    test('does not fire removed direct events', 3, function() {
        function handler() {
            $(this).text($(this).text() + 'tap');
        }

        $('.touchme').on('tap', handler);

        trigger.tap(this);

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

        trigger.tap(this);

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
        this.$elems.on('press', function() {
            $(this).text('press');
        });

        trigger.press(this, $.Finger.pressDuration, function() {
            strictEqual(this.$elems.filter(':first').text(), 'press', 'should work with direct events');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        });
    });

    asyncTest('works with delegated events', 3, function() {
        $('body').on('press', '.touchme', function() {
            $(this).text('press');
        });

        trigger.press(this, $.Finger.pressDuration, function() {
            strictEqual(this.$elems.filter(':first').text(), 'press', 'should work with delegated events');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        });
    });

    asyncTest('does not fire tap event', 3, function() {
        this.$elems.on('tap', function() {
            $(this).text('tap');
        });

        this.$elems.on('press', function() {
            $(this).text('press');
        });

        trigger.press(this, $.Finger.pressDuration, function() {
            strictEqual(this.$elems.filter(':first').text(), 'press', 'should fire tap event');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        });
    });

    asyncTest('does not trigger press when tapping twice', 3, function() {
        this.$elems.on('press', function() {
            $(this).text('press');
        });

        trigger.doubleTap(this, $.Finger.pressDuration, function() {
            notEqual(this.$elems.filter(':first').text(), 'press', 'should not fire press event');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        });
    });

    module('double tap event', {
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
        this.$elems.on('doubletap', function() {
            $(this).text('doubletap');
        });

        trigger.doubleTap(this, $.Finger.doubleTapInterval * 0.5, function() {
            strictEqual(this.$elems.filter(':first').text(), 'doubletap', 'should work with direct events');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        });
    });

    asyncTest('works with delegated events', 3, function() {
        $('body').on('doubletap', '.touchme', function() {
            $(this).text('doubletap');
        });

        trigger.doubleTap(this, $.Finger.doubleTapInterval * 0.5, function() {
            strictEqual(this.$elems.filter(':first').text(), 'doubletap', 'should work with delegated events');
            strictEqual(this.$elems.filter(':eq(1)').text(), '', 'should not fire to second element');
            strictEqual(this.$elems.filter(':last').text(), '', 'should not fire to last element');

            start();
        });
    });

}(jQuery));