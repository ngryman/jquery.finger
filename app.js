(function() {
	var $elem = $('#touchzone'),
		$nipple = $('#nipple'),
		colors = 'green blue pink'.split(' '),
		w;

	colors.index = 0;

	window.Tralala = {
		tap: function(x, y) {
			$elem.cssreset()
				.cssAnimate('tap');

//			$nipple.cssAnimate('tap').css({
//				left: x - w / 20,
//				top: y - w / 20,
//				width: w / 10,
//				height: w / 10
//			});
		},

		doubleTap: function(e) {
			var $html = $('html');
			$html.removeClass(colors[colors.index]);
			colors.index = (colors.index + 1) % colors.length;
			$html.addClass(colors[colors.index]);
		},

		drag: function(e) {
			var dx = e.dx, dy = e.dy, transform = '';

			if (e.end) {
				transform += 'rotateX(0) rotateY(0)';
			}
			else {
				if ('horizontal' == e.orientation) {
					transform += 'rotateY(' + (-dx / 20) + 'deg)';
				}
				else {
					transform += 'rotateX(' + (dy / 20) + 'deg)';
				}
			}

			$elem.toggleClass('grabbing', !e.end).css({
				transition: e.end ?  '.2s linear' : 'none',
				transform: transform
			});
		},

		flick: function() {

		}
	};

	//
	// events
	//

	$elem.on({
		tap: Tralala.tap,
		doubletap: Tralala.doubleTap,
		drag: Tralala.drag
//		flick: Tralala.flick
	});

	$(window).on('load resize', $.debounce(function(e) {
		w = $elem.outerWidth();
		$('#touchzone').css('perspective', $('.touchzone-wrapper').innerWidth());
	}, 100));
})();

(function() {

})();

(function() {
	var $touch = $('.touchzone');
	var $nipple = $('.nipple');
	var w, h;
	var colors = 'green blue pink'.split(' ');
	colors.index = 0;

//	$touch.on('tap', function(e) {
//		var x = e.x,
//			y = e.y;
//
//		$touch.cssreset().cssanim('tap', 'touchzone').attr('data-event', 'tap');
//		$nipple.cssanim('tap', 'nipple');
//		$nipple.css({
//			left: x - w / 20,
//			top: y - w / 20,
//			width: w / 10,
//			height: w / 10
//		});
//	});
//
//	$touch.on('doubletap', function(e) {
//		$('html').removeClass(colors[colors.index]);
//		colors.index = (colors.index + 1) % colors.length;
//		$('html').addClass(colors[colors.index]);
//
//		$touch.attr('data-event', 'doubletap');
//	});
//
//	$touch.on('drag', function(e) {
//		var dx = e.dx,
//			dy = e.dy;
//
//		$touch.css({
//			transition: !e.end ? 'none' : '.2s linear',
//			transform: 'perspective(400px) ' + !e.end ? 'horizontal' == e.orientation ? 'rotateY(' + -dx / 4 + 'deg)' : 'rotateX(' + dy / 4 + 'deg)' : 'rotateY(0)'
//		});
//		$touch.cssanim('drag', 'touchzone').attr('data-event', 'drag');
//	});
//
//	$touch.on('flick', function(e) {
//		/*
//		 * TODO
//		 * s'abonner a animationend pour reset et s'assurer qu'il n'y a aucun attribut de style de transformation et de transition
//		 */
//		$touch.cssanim('flick-' + e.orientation, 'touchzone', -1 == e.direction).attr('data-event', 'flick');;
//	});

	$(window).on('load resize', $.debounce(function(e) {
		w = $touch.outerWidth();
		h = $touch.outerHeight();

            $('#touchzone').parent().css('perspective', $('#touchzone').innerWidth());

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