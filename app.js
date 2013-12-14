(function() {
	var $elem = $('#touchzone'),
//		$nipple = $('#nipple'),
		colors = 'green blue pink'.split(' '),
		w, eventTimeout;

	colors.index = 0;

	function notify(eventName) {
		$('[data-event=' + eventName + ']').addClass('is-active');
		clearTimeout(eventTimeout);
		eventTimeout = setTimeout(function() {
			$('[data-event].is-active').removeClass('is-active');
		}, 1000);
	}

	window.Tralala = {
		tap: function(e) {
			$elem.cssreset()
				.cssAnimate('tap');
			notify('tap');

//			$nipple.css({
//				left: e.x - w / 20,
//				top: e.y - w / 20,
//				width: w / 10,
//				height: w / 10
//			}).cssAnimate('tap');
		},

		doubleTap: function(e) {
			var $html = $('html');
			$html.removeClass(colors[colors.index]);
			colors.index = (colors.index + 1) % colors.length;
			$html.addClass(colors[colors.index]);
			notify('doubletap');
		},

		press: function(e) {
			$elem.cssreset()
				.cssAnimate('press');
			notify('press');
		},

		drag: function(e) {
			var dx = e.dx, dy = e.dy, transform = '';

			if (e.end) {
				transform += 'rotateX(0) rotateY(0)';
			}
			else {
				if ('horizontal' == e.orientation) {
					transform += 'rotateY(' + (-dx / 10) + 'deg)';
				}
				else {
					transform += 'rotateX(' + (dy / 10) + 'deg)';
				}
			}

			$elem.toggleClass('grabbing', !e.end).css({
				transition: e.end ?  '.2s linear' : 'none',
				transform: transform
			});

			notify('drag');

			e.preventDefault();
		},

		flick: function(e) {
//			/** TODO
//			 * s'abonner a animationend pour reset et s'assurer qu'il n'y a aucun attribut de style de transformation et de transition
//			 */
//			$elem.cssAnimate('flick-' + e.orientation, 'touchzone', -1 == e.direction).attr('data-event', 'flick');
//			notify('flick');
		}
	};

	//
	// events
	//

	$elem.on({
		tap: Tralala.tap,
		doubletap: Tralala.doubleTap,
		press: Tralala.press,
		drag: Tralala.drag
//		flick: Tralala.flick
	});

	$(window).on('load resize', $.debounce(function(e) {
		w = $elem.outerWidth();
		$('#touchzone').css('perspective', $('.touchzone-wrapper').innerWidth());
	}, 100));
})();

/**
 * gga
 */
(function(i, s, o, g, r, a, m) {
	i['GoogleAnalyticsObject'] = r;
	i[r] = i[r] || function() {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o),
		m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-5779130-4', 'github.io');
ga('send', 'pageview');