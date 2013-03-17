/*! jquery.finger - v0.0.9 - 2013-03-17
* https://github.com/ngryman/jquery.finger
* Copyright (c) 2013 Nicolas Gryman; Licensed MIT */

(function($) {

	var hasTouch = 'ontouchstart' in window,
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		stopEvent = hasTouch ? 'touchend touchcancel' : 'mouseup mouseleave',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove';

	$.Finger = {
		pressDuration: 300,
		doubleTapInterval: 300,
		flickDuration: 150,
		motionThreshold: 5
	};

	function page(coord, e) {
		return (hasTouch ? e.originalEvent.touches[0] : e)['page' + coord.toUpperCase()];
	}

	function startHandler(event) {
		var data = {};
		data.move = { x: page('x', event), y: page('y', event) };
		data.start = $.extend({ time: event.timeStamp, target: event.target }, data.move);

		$.event.add(this, moveEvent + '.finger', moveHandler, data);
		$.event.add(this, stopEvent + '.finger', stopHandler, data);
	}

	function moveHandler(event) {
		var data = event.data;

		// motion data
		data.move.x = page('x', event);
		data.move.y = page('y', event);
		data.move.dx = data.move.x - data.start.x;
		data.move.dy = data.move.y - data.start.y;
		data.move.adx = Math.abs(data.move.dx);
		data.move.ady = Math.abs(data.move.dy);

		// security
		data.motion = data.move.adx > $.Finger.motionThreshold || data.move.ady > $.Finger.motionThreshold;
		if (!data.motion) return;

		// orientation
		if (!data.move.orientation) {
			if (data.move.adx > data.move.ady) {
				data.move.orientation = 'horizontal';
				data.move.direction = data.move.dx > 0 ? +1 : -1;
			}
			else {
				data.move.orientation = 'vertical';
				data.move.direction = data.move.dy > 0 ? +1 : -1;
			}
		}

		// for delegated events, the target may change over time
		// this ensures we notify the right target and simulates the mouseleave behavior
		if (event.target !== data.start.target) {
			event.target = data.start.target;
			stopHandler.call(this, $.Event(stopEvent + '.finger', event));
			return;
		}

		// fire drag event
		$.event.trigger($.Event('drag', data.move), null, event.target);
	}

	function stopHandler(event) {
		var data = event.data,
			now = event.timeStamp,
			f = $.data(this, 'finger'),
			evtName;

		// ensures start target and end target are the same
		if (event.target !== data.start.target) return;

		// tap-like events
		if (!data.motion) {
			evtName = now - data.start.time < $.Finger.pressDuration ?
				!f.prev || f.prev && now - f.prev > $.Finger.doubleTapInterval ? 'tap' : 'doubletap' :
				'press';
			f.prev = now;
			$.event.trigger($.Event(evtName, data.move), null, event.target);
		}
		// motion events
		else {
			evtName = now - data.start.time < $.Finger.flickDuration ? 'flick' : 'drag';
			data.move.end = true;
			$.event.trigger($.Event(evtName, data.move), null, event.target);
		}

		$.event.remove(this, moveEvent + '.finger', moveHandler);
		$.event.remove(this, stopEvent + '.finger', stopHandler);
	}

	var fingerCustom = {
		setup: function() {
			if (!$.data(this, 'finger')) {
				$.event.add(this, startEvent + '.finger', startHandler);
				$.data(this, 'finger', {});
			}
		},

		teardown: function() {
			if ($.data(this, 'finger')) {
				$.event.remove(this, startEvent + '.finger', startHandler);
				$.data(this, 'finger', null);
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