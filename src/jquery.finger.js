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
		stopEvent = hasTouch ? 'touchend touchcancel' : 'mouseup mouseleave',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove',

		namespace = 'finger',
		safeguard,

		start = {},
		move = {},
		motion,
		cancel,
		timeout,

		Finger = $.Finger = {
			pressDuration: 300,
			doubleTapInterval: 300,
			flickDuration: 150,
			motionThreshold: 5
		};

	function page(coord, event) {
		return (hasTouch ? event.originalEvent.touches[0] : event)['page' + coord.toUpperCase()];
	}

	function trigger(el, evtName, remove) {
		$.event.trigger($.Event(evtName, move), null, start.target);
		if (remove) {
			$.event.remove(el, moveEvent + '.' + namespace, moveHandler);
			$.event.remove(el, stopEvent + '.' + namespace, stopHandler);
		}
	}

	function triggerPress(el) {
		cancel = true;
		trigger(el, 'press');
	}

	function Event(name, data, originalEvent) {
		return $.Event(name, $.extend(data, { originalEvent: originalEvent }));
	}

	function startHandler(event) {
		var timeStamp = event.timeStamp || +new Date(),
			f = $.data(this, namespace);

		if (safeguard == timeStamp) return;
		safeguard = timeStamp;

		// initializes data
		start.x = move.x = page('x', event);
		start.y = move.y = page('y', event);
		start.time = timeStamp;
		start.target = event.target;
		move.orientation = null;
		motion = false;
		cancel = false;
		timeout = setTimeout(triggerPress, $.Finger.pressDuration);

		$.event.add(this, moveEvent + '.' + namespace, moveHandler);
		$.event.add(this, stopEvent + '.' + namespace, stopHandler);

		if (Finger.preventDefault || f.options.preventDefault) event.preventDefault();
	}

	function moveHandler(event) {
		// motion data
		move.x = page('x', event);
		move.y = page('y', event);
		move.dx = move.x - start.x;
		move.dy = move.y - start.y;
		move.adx = Math.abs(move.dx);
		move.ady = Math.abs(move.dy);

		// security
		motion = move.adx > Finger.motionThreshold || move.ady > Finger.motionThreshold;
		if (!motion) return;

		// moves cancel press events
		clearTimeout(timeout);

		// orientation
		if (!move.orientation) {
			if (move.adx > move.ady) {
				move.orientation = 'horizontal';
				move.direction = move.dx > 0 ? +1 : -1;
			}
			else {
				move.orientation = 'vertical';
				move.direction = move.dy > 0 ? +1 : -1;
			}
		}

		// for delegated events, the target may change over time
		// this ensures we notify the right target and simulates the mouseleave behavior
		if (event.target !== start.target) {
			event.target = start.target;
			stopHandler.call(this, Event(stopEvent + '.' + namespace, event));
			return;
		}

		// fire drag event
		trigger(this, 'drag');
	}

	function stopHandler(event) {
		var timeStamp = event.timeStamp || +new Date(),
			f = $.data(this, namespace),
			dt = timeStamp - start.time,
			evtName;

		// always clears press timeout
		clearTimeout(timeout);

		// ensures start target and end target are the same
		if (event.target !== start.target) return;

		// tap-like events
		if (!motion && !cancel) {
			evtName = !f.prev || f.prev && timeStamp - f.prev > Finger.doubleTapInterval ? 'tap' : 'doubletap';
			f.prev = timeStamp;
		}
		// motion events
		else {
			if (dt < Finger.flickDuration) trigger(this, 'flick');
			move.end = true;
			evtName = 'drag';
		}

		trigger(this, evtName, true);
	}

	var fingerCustom = {
		add: function(handleObj) {
			if (!$.data(this, namespace)) {
				$.event.add(this, startEvent + '.' + namespace, startHandler);
				$.data(this, namespace, { options: handleObj.data || {} });
			}
		},

		teardown: function() {
			if ($.data(this, namespace)) {
				$.event.remove(this, startEvent + '.' + namespace, startHandler);
				$.data(this, namespace, null);
			}
		}
	};

	// registers custom events
	$.event.special.tap = fingerCustom;
	$.event.special.press = fingerCustom;
	$.event.special.doubletap = fingerCustom;
	$.event.special.drag = fingerCustom;
	$.event.special.flick = fingerCustom;

})(jQuery);
