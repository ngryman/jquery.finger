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

		Finger = $.Finger = {
			pressDuration: 300,
			doubleTapInterval: 300,
			flickDuration: 150,
			motionThreshold: 5
		};

	function page(coord, e) {
		return (hasTouch ? e.originalEvent.touches[0] : e)['page' + coord.toUpperCase()];
	}

	function startHandler(event) {
		var data = {},
			f = $.data(this, namespace);

		if (safeguard == event.timeStamp) return;
		safeguard = event.timeStamp;

		data.move = { x: page('x', event), y: page('y', event) };
		data.start = $.extend({ time: event.timeStamp, target: event.target }, data.move);

		$.event.add(this, moveEvent + '.' + namespace, moveHandler, data);
		$.event.add(this, stopEvent + '.' + namespace, stopHandler, data);

		if (f.preventDefault) event.preventDefault();
	}

	function moveHandler(event) {
		var data = event.data,
			start = data.start,
			move = data.move;

		// motion data
		move.x = page('x', event);
		move.y = page('y', event);
		move.dx = move.x - start.x;
		move.dy = move.y - start.y;
		move.adx = Math.abs(move.dx);
		move.ady = Math.abs(move.dy);

		// security
		data.motion = move.adx > Finger.motionThreshold || move.ady > Finger.motionThreshold;
		if (!data.motion) return;

		// orientation
		if (!move.orientation) {
			if (move.adx > data.move.ady) {
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
			stopHandler.call(this, $.Event(stopEvent + '.' + namespace, event));
			return;
		}

		// fire drag event
		$.event.trigger($.Event('drag', move), null, event.target);
	}

	function stopHandler(event) {
		var data = event.data,
			now = event.timeStamp,
			f = $.data(this, namespace),
			dt = now - data.start.time,
			evtName;

		// ensures start target and end target are the same
		if (event.target !== data.start.target) return;

		// tap-like events
		if (!data.motion) {
			evtName = dt < Finger.pressDuration ?
				!f.prev || f.prev && now - f.prev > Finger.doubleTapInterval ? 'tap' : 'doubletap' :
				'press';
			f.prev = now;
		}
		// motion events
		else {
			evtName = dt < Finger.flickDuration ? 'flick' : 'drag';
			data.move.end = true;
		}

		$.event.trigger($.Event(evtName, data.move), null, event.target);

		$.event.remove(this, moveEvent + '.' + namespace, moveHandler);
		$.event.remove(this, stopEvent + '.' + namespace, stopHandler);
	}

	var fingerCustom = {
		add: function(handleObj) {
			var data = handleObj.data, f;

			if (!$.data(this, namespace)) {
				$.event.add(this, startEvent + '.' + namespace, startHandler);
				f = $.data(this, namespace, {});
				if (Finger.preventDefault || data && data.preventDefault) f.preventDefault = true;
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