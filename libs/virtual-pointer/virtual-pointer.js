(function($, window) {

	var hasTouch = 'ontouchstart' in window,
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		stopEvent = hasTouch ? 'touchend' : 'mouseup',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove';

	$.each('click mousedown mouseup mousemove mouseleave touchstart touchmove touchend'.split(' '), function(i, evtName) {
		$.event.special[evtName] = {
			add: function(handleObj) {
				var oldHandler = handleObj.handler;
				handleObj.handler = function(event) {
					if (event.isTrigger) {
						oldHandler.apply(this, arguments);
					}
				};
			}
		};
	});

	window.VirtualPointer = function(scope) {
		return {
			x: 0,
			y: 0,
			autoReset: true,

			tapStart: function() {
				if (this.autoReset) {
					this.x = this.y = 0;
				}

				var $el = $(document.elementFromPoint(this.x, this.y));
				$el.trigger(new $.Event(startEvent, {
					pageX: this.x,
					pageY: this.y,
					originalEvent: {
						touches: [
							{
								pageX: this.x,
								pageY: this.y
							}
						]
					}
				}));
			},

			tapEnd: function() {
				var $el = $(document.elementFromPoint(this.x, this.y));
				$el.trigger(stopEvent);
			},

			move: function(x, y, duration, callback) {
				var self = this, last = Date.now(), t = 0, timer;

				this.tapStart();

				var sx = this.x, sy = this.y;
				(function mv() {
					var now = Date.now();
					t += now - last;
					if (t >= duration) {
						self.tapEnd();
						callback.call(scope);
						return;
					}
					last = now;

					self.x = Math.ceil(t / duration * x) + sx;
					self.y = Math.ceil(t / duration * y) + sy;

					var $el = $(document.elementFromPoint(self.x, self.y));
					$el.trigger($.Event(moveEvent, {
						pageX: self.x,
						pageY: self.y,
						originalEvent: {
							touches: [
								{
									pageX: self.x,
									pageY: self.y
								}
							]
						}
					}));
					timer = setTimeout(mv, 0);
				})();
			},

			tap: function() {
				this.tapStart();
				this.tapEnd();
			},

			press: function(callback, duration) {
				var self = this;
				duration = duration || this.PRESS_DURATION * 1.5 /* security */;
				this.tapStart();
				setTimeout(function() {
					self.tapEnd();
					if (callback) callback.call(scope);
				}, duration);
			},

			doubleTap: function(callback, duration) {
				var self = this;
				duration = duration || this.DOUBLETAP_DURATION * 0.5 /* security */;
				this.tap();
				setTimeout(function() {
					self.tap();
					callback.call(scope);
				}, duration);
			},

			drag: function(x, y, callback, duration) {
				duration = duration || this.FLICK_DURATION * 1.5 /* security */;
				this.move(x, y, duration, callback);
			},

			flick: function(x, y, callback, duration) {
				duration = duration || this.FLICK_DURATION * 0.5 /* security */;
				this.move(x, y, duration, callback);
			},

			START_EVENT: startEvent,
			STOP_EVENT: stopEvent,
			MOVE_EVENT: moveEvent,

			PRESS_DURATION: 25,
			DOUBLETAP_DURATION: 25,
			FLICK_DURATION: 25
		};
	};

})(jQuery, window);