/*
 * jquery.finger
 * https://github.com/ngryman/jquery.finger
 *
 * Copyright (c) 2013 ngryman
 * Licensed under the MIT license.
 */

(function($) {

    var hasTouch = 'ontouchstart' in window,
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        stopEvent = hasTouch ? 'touchend touchcancel' : 'mouseup',
        moveEvent = hasTouch ? 'touchmove' : 'touchmove';

    $.event.special.tap = (function() {
        return {
            add: function(handleObj) {
                var events = $._data(this, 'events');
                events.tap.push(handleObj.handler);

                $.event.add(this, startEvent, startHandler, null, handleObj.selector);
            }
        }

        function startHandler() {
            $.event.add(this, moveEvent, moveHandler);
            $.event.add(this, stopEvent, stopHandler);
        }

        function moveHandler() {
            var events = $._data(this, 'events');
            $.event.remove(this, stopEvent, stopHandler);
        }

        function stopHandler() {
            var tapEvts = $._data(this, 'events').tap,
                handler;

            for (var i = 0, len = tapEvts.length; i < len; i++) {
                handler = tapEvts[i];
                if ($.isFunction(handler)) {
                    handler.apply(this, arguments);
                }
            }
        }
    })();

})(jQuery);
