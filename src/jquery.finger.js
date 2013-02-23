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
		pressDuration: 300,
		doubleTapInterval: 300,
		flickDuration: 150,
		motionThreshold: 5
	};

	function finger(el) {
		return $._data(el, 'events').finger;
	}

	function flag(evt, p, value) {
		if (3 == arguments.length) {
			evt && (evt[p] = value);
		}
		else {
			return evt ? evt[p] : undefined;
		}
	}

	function $event(action, el, handleObj) {
		$.event[action](el, startEvent, startHandler, null, handleObj.selector);
		$.event[action](el, moveEvent, moveHandler, null, handleObj.selector);
		$.event[action](el, stopEvent, stopHandler, null, handleObj.selector);
	}

	function fire(evtName, event, f) {
		if (f[evtName] && !f[evtName].canceled) {
			$.extend(event, f.move);
			var handlers = f[evtName].handlers;
			for (var handler in handlers) {
				if ($.isFunction(handlers[handler])) {
					handlers[handler].call(event.currentTarget, event);
				}
			}
		}
	}

	function startHandler(event) {
		var f = finger(event.delegateTarget);
		f.move = { x: event.pageX, y: event.pageY };
		f.start = $.extend({ time: event.timeStamp }, f.move);
	}

	function moveHandler(event) {
		var f = finger(event.delegateTarget);

		// no start event fired, do nothing
		if (!f.start) return;

		// motion data
		f.move.x = event.pageX;
		f.move.y = event.pageY;
		f.move.dx = event.pageX - f.start.x;
		f.move.dy = event.pageY - f.start.y;
		f.move.adx = Math.abs(f.move.dx);
		f.move.ady = Math.abs(f.move.dy);

		// security
		if (f.move.adx < $.Finger.motionThreshold && f.move.ady < $.Finger.motionThreshold) return;

		// orientation
		if (!f.move.orientation) {
			if (f.move.adx > f.move.ady) {
				f.move.orientation = 'horizontal';
				f.move.direction = f.move.dx > 0 ? +1 : -1;
			}
			else {
				f.move.orientation = 'vertical';
				f.move.direction = f.move.dy > 0 ? +1 : -1;
			}
		}

		// fire drag event
		fire('drag', event, f);

		flag(f.tap, 'canceled', true);
		flag(f.press, 'canceled', true);
	}

	function stopHandler(event) {
		var f = finger(event.delegateTarget),
			now = event.timeStamp,
			evtName;

		// tap-like events
		evtName = now - f.start.time < $.Finger.pressDuration ? 'tap' : 'press';
		// is it a double tap ?
		if ('tap' == evtName && f.doubletap) {
			if (now - f.doubletap.prev < $.Finger.doubleTapInterval) {
				evtName = 'doubletap';
			}
			else {
				f.doubletap.prev = now;
			}
		}
		fire(evtName, event, f);

		// motion events
		evtName = now - f.start.time < $.Finger.flickDuration ? 'flick' : 'drag';
		fire(evtName, event, f);

		// start over
		f.start = null;
		flag(f.tap, 'canceled', false);
		flag(f.press, 'canceled', false);
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
	$.event.special.press = fingerCustom;
	$.event.special.doubletap = fingerCustom;
	$.event.special.drag = fingerCustom;
	$.event.special.flick = fingerCustom;

})(jQuery);