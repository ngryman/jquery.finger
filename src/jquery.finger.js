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
        moveEvent = hasTouch ? 'touchmove' : 'mousemove';

    $.event.special.tap = (function() {

        function startHandler(event) {
            var data = { delegateTarget: event.delegateTarget, guid: event.data.guid };
            $.event.add(this, moveEvent, moveHandler, data);
            $.event.add(this, stopEvent, stopHandler, data);
        }

        function moveHandler(event) {
            $.event.remove(this, moveEvent, moveHandler);
            $.event.remove(this, stopEvent, stopHandler);
        }

        function stopHandler(event) {
            var handler = $._data(
                event.data.delegateTarget, 'events'
            ).finger.tap[event.data.guid].handler;

            handler.apply(this, arguments);

            $.event.remove(this, moveEvent, moveHandler);
            $.event.remove(this, stopEvent, stopHandler);
        }

        return {
            add: function(handleObj) {
                var events = $._data(this, 'events');
                events.finger = events.finger || { tap: {} };
                events.finger.tap[handleObj.handler.guid] = {
                    handler: handleObj.handler
                };

                $.event.add(this, startEvent, startHandler, { guid: handleObj.handler.guid }, handleObj.selector);
            },

            remove: function(handleObj) {
                var events = $._data(this, 'events');
                events.finger.tap[handleObj.handler.guid] = null;

                $.event.remove(this, startEvent, startHandler, handleObj.selector);
            },

            teardown: function() {
                $._data(this, 'events').finger = { tap: {} };
            }
        };

    })();

})(jQuery);
