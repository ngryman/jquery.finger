(function($) {

	// https://code.google.com/p/jquery-debounce/
	$.debounce = function(fn, timeout, invokeAsap, ctx) {

		if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
			ctx = invokeAsap;
			invokeAsap = false;
		}

		var timer;

		return function() {

			var args = arguments;
			ctx = ctx || this;

			invokeAsap && !timer && fn.apply(ctx, args);

			clearTimeout(timer);

			timer = setTimeout(function() {
				invokeAsap || fn.apply(ctx, args);
				timer = null;
			}, timeout);

		};

	};

})(jQuery);

(function($) {
	$.fn.cssAnimate = function(animation, reversed) {
		// removes the current animation, commits it by forcing a reflow, and them applies the new animation
		this.attr('data-animation', false);
		this[0].offsetWidth;
		return this.attr({
			'data-animation': animation,
			'data-animation-reversed' : reversed
		});
	};

	$.fn.cssreset = function() {
		return this.css({
			transition: 'none',
			transform: 'rotateY(0) rotateX(0)'
		});
	};
})(jQuery);