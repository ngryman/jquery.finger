/*! jQuery Finger - v0.1.0 - 2013-01-22
* https://github.com/ngryman/jquery.finger
* Copyright (c) 2013 ngryman; Licensed MIT */

(function($) {

    var hasTouch = 'ontouchstart' in window,
        startEvent = hasTouch ? 'touchstart' : 'mousedown',
        stopEvent = hasTouch ? 'touchend touchcancel' : 'mouseup',
        moveEvent = hasTouch ? 'touchmove' : 'mousemove';

    $.event.special.tap = (function() {
        function startHandler(event) {
            $.event.add(this, moveEvent, moveHandler, event);
            $.event.add(this, stopEvent, stopHandler, event);
        }

        function moveHandler() {
            $.event.remove(this, stopEvent, stopHandler);
        }

        function stopHandler(event) {
            var handler = $._data(
                event.data.delegateTarget, 'events'
            ).finger.tap[event.data.data.guid].handler;

            handler.apply(this, arguments);
        }

        return {
            add: function(handleObj) {
                var events = $._data(this, 'events');
                events.finger = events.finger || { tap: [] };
                events.finger.tap.push({
                    handler: handleObj.handler
                });

                $.event.add(this, startEvent, startHandler, { guid: events.finger.tap.length - 1 }, handleObj.selector);
            }
        };
    })();

})(jQuery);
