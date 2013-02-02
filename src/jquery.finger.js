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

    $.Finger = {
        tapHoldDuration: 300
    };

    function startHandler(event) {
        var events = $._data(event.delegateTarget, 'events');
        events.finger.start = {
            time: +new Date()
        };
    }

    function moveHandler(event) {
        var events = $._data(event.delegateTarget, 'events');
        if (!events.finger.start) { return; }

        if (events.finger.tap) { events.finger.tap.canceled = true; }
        if (events.finger.taphold) { events.finger.taphold.canceled = true; }
    }

    function stopHandler(event) {
        var events = $._data(event.delegateTarget, 'events'),
            start = events.finger.start,
            delta = +new Date() - start.time,
            evtName = delta < $.Finger.tapHoldDuration ? 'tap' : 'taphold',
            evt = events.finger[evtName];

        // event exists and is not canceled
        if (evt && !evt.canceled) {
            var handlers = evt.handlers;
            for (var handler in handlers) {
                if ($.isFunction(handlers[handler])) {
                    handlers[handler].apply(this, arguments);
                }
            }
        }

        // start over
        events.finger.start = null;
        if (events.finger.tap) { events.finger.tap.canceled = false; }
        if (events.finger.taphold) { events.finger.taphold.canceled = false; }
    }

    function install(el, handleObj, evt) {
        var events = $._data(el, 'events');
        events.finger = events.finger || {};

        // is it necessary?
        if (!events.finger.refCount) {
            $.event.add(el, startEvent, startHandler, null, handleObj.selector);
            $.event.add(el, moveEvent, moveHandler, null, handleObj.selector);
            $.event.add(el, stopEvent, stopHandler, null, handleObj.selector);

            // ensure this is an int
            events.finger.refCount = 0;
        }

        // increment ref count
        events.finger.refCount++;

        // handler
        events.finger[evt] = events.finger[evt] || { handlers: [] };
        events.finger[evt].handlers[handleObj.handler.guid] = handleObj.handler;
    }

    function uninstall(el, handleObj, evt) {
        var events = $._data(el, 'events');

        // decrement ref count
        events.finger.refCount--;

        // cleanup?
        if (0 === events.finger.refCount) {
            $.event.remove(el, startEvent, startHandler, null, handleObj.selector);
            $.event.remove(el, moveEvent, moveHandler, null, handleObj.selector);
            $.event.remove(el, stopEvent, stopHandler, null, handleObj.selector);
        }

        // handler
        events.finger[evt].handlers[handleObj.handler.guid] = null;
    }

    $.each(['tap', 'taphold'], function(_, evt) {
        $.event.special[evt] = {
            add: function(handleObj) {
                install(this, handleObj, evt);
            },

            remove: function(handleObj) {
                uninstall(this, handleObj, evt);
            }
        };
    });

})(jQuery);