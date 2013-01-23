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

        this.$elems.filter(':first').trigger('touchstart').trigger('touchend');

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('works with delegated events', 3, function() {
        $('body').on('tap', '.touchme', function() {
            $(this).text('tap');
        });

        this.$elems.filter(':first').trigger('touchstart').trigger('touchend');

        strictEqual(this.$elems.filter(':first').text(), 'tap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

    test('fires handlers in order', 3, function() {
//        $('body').on('tap', '.touchme', function() {
//            $(this).text($(this).text() + 'tip');
//        });

        $('body').on('tap', '.touchme', function() {
            $(this).text($(this).text() + 'tap');
        });

        this.$elems.filter(':first').trigger('touchstart').trigger('touchend');

        strictEqual(this.$elems.filter(':first').text(), 'tiptap', 'should work with direct events');
        notEqual(this.$elems.filter(':eq(1)').text(), 'tap', 'should not fire to second element');
        notEqual(this.$elems.filter(':last').text(), 'tap', 'should not fire to last element');
    });

}(jQuery));
