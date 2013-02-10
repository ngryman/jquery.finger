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
        tapHoldDuration: 300,
        doubleTapInterval: 300
    };

    function finger(el) {
        return $._data(el, 'events').finger;
    }

    function prop(evt, prop, value) {
        if (evt) {
            evt[prop] = value;
        }
    }

    function $event(action, el, handleObj) {
        $.event[action](el, startEvent, startHandler, null, handleObj.selector);
        $.event[action](el, moveEvent, moveHandler, null, handleObj.selector);
        $.event[action](el, stopEvent, stopHandler, null, handleObj.selector);
    }

    function startHandler(event) {
        finger(event.delegateTarget).start = {
            time: +new Date()
        };
    }

    function moveHandler(event) {
        var f = finger(event.delegateTarget);
        if (!f.start) {
            return;
        }

        prop(f.tap, 'canceled', true);
        prop(f.taphold, 'canceled', true);
    }

    function stopHandler(event) {
        var f = finger(event.delegateTarget),
            now = Date.now(),
            evtName = now - f.start.time < $.Finger.tapHoldDuration ? 'tap' : 'taphold';

        // is it a double tap ?
        if ('tap' === evtName && f.doubletap) {
            if (now - f.doubletap.prev < $.Finger.doubleTapInterval) {
                evtName = 'doubletap';
            }
            else {
                f.doubletap.prev = now;
            }
        }

        // event exists and is not canceled
        if (f[evtName] && !f[evtName].canceled) {
            var handlers = f[evtName].handlers;
            for (var handler in handlers) {
                if ($.isFunction(handlers[handler])) {
                    handlers[handler].apply(this, arguments);
                }
            }
        }

        // start over
        f.start = null;
        prop(f.tap, 'canceled', false);
        prop(f.taphold, 'canceled', false);
    }

    var fingerCustom = {
        add: function(handleObj) {
            var events = $._data(this, 'events');
            events.finger = events.finger || {};
            var f = events.finger;

            // creates under the hood events?
            if (!f.refCount) {
                $event('add', this, handleObj);
                f.refCount = 0; // ensures this is an number
            }

            // increments ref count
            f.refCount++;

            // handler
            f[handleObj.type] = f[handleObj.type] || { handlers: [] };
            f[handleObj.type].handlers[handleObj.handler.guid] = handleObj.handler;
        },

        remove: function(handleObj) {
            var events = $._data(this, 'events');
            var f = events.finger;

            // decrements ref count
            f.refCount--;

            // cleanup?
            if (0 === f.refCount) {
                $event('remove', this, handleObj);
                events.finger = null;
                return;
            }

            // handler
            f[handleObj.type].handlers[handleObj.handler.guid] = null;
        }
    };

    // registers custom events
    $.event.special.tap = fingerCustom;
    $.event.special.taphold = fingerCustom;
    $.event.special.doubletap = fingerCustom;

})(jQuery);