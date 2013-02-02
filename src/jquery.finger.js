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

    function finger(el) {
        return $._data(el, 'events').finger;
    }

    function startHandler(event) {
        finger(event.delegateTarget).start = {
            time: +new Date()
        };
    }

    function moveHandler(event) {
        var f = finger(event.delegateTarget);
        if (!f.start) { return; }

        if (f.tap) { f.tap.canceled = true; }
        if (f.taphold) { f.taphold.canceled = true; }
    }

    function stopHandler(event) {
        var f = finger(event.delegateTarget),
            start = f.start,
            delta = +new Date() - start.time,
            evtName = delta < $.Finger.tapHoldDuration ? 'tap' : 'taphold',
            evt = f[evtName];

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
        f.start = null;
        if (f.tap) { f.tap.canceled = false; }
        if (f.taphold) { f.taphold.canceled = false; }
    }

    var fingerCustom = {
        add: function(handleObj) {
            var events = $._data(this, 'events');
            events.finger = events.finger || {};
            var f = events.finger;

            // creates under the hood events?
            if (!f.refCount) {
                $.event.add(this, startEvent, startHandler, null, handleObj.selector);
                $.event.add(this, moveEvent, moveHandler, null, handleObj.selector);
                $.event.add(this, stopEvent, stopHandler, null, handleObj.selector);

                // ensures this is an number
                f.refCount = 0;
            }

            // increments ref count
            f.refCount++;

            // handler
            f[handleObj.type] = f[handleObj.type] || { handlers: [] };
            f[handleObj.type].handlers[handleObj.handler.guid] = handleObj.handler;
        },

        remove: function(handleObj) {
            var f = finger(this);

            // decrements ref count
            f.refCount--;

            // cleanup?
            if (0 === f.refCount) {
                $.event.remove(this, startEvent, startHandler, null, handleObj.selector);
                $.event.remove(this, moveEvent, moveHandler, null, handleObj.selector);
                $.event.remove(this, stopEvent, stopHandler, null, handleObj.selector);
            }

            // handler
            f[handleObj.type].handlers[handleObj.handler.guid] = null;
        }
    };

    // register custom events
    $.event.special.tap = fingerCustom;
    $.event.special.taphold = fingerCustom;

})(jQuery);