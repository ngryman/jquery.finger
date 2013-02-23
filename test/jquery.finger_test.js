/*global Mocha:false, describe: true, xdescribe: true, before: true, after: true, it: true, xit: true, sinon:false*/

(function($) {

	var hasTouch = 'ontouchstart' in window,
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		stopEvent = hasTouch ? 'touchend' : 'mouseup',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove';

	/** extend Mocha.Context to hence event trigger */

	Mocha.Context.prototype.tapStart = function() {
		this.$elems.filter(':first').trigger(startEvent);
	};

	Mocha.Context.prototype.tapEnd = function() {
		this.$elems.filter(':first').trigger(stopEvent);
	};

	Mocha.Context.prototype.move = function(callback, x, y, duration) {
		var self = this, last = Date.now(), t = 0;

		this.tapStart();
		(function mv() {
			var now = Date.now(),
				dt = now - last;

			t += dt;
			if (t >= duration) {
				self.tapEnd();
				callback.call(self);
				return;
			}
			last = now;

			self.$elems.filter(':first').trigger($.Event(moveEvent, {
				pageX: Math.ceil(t / duration * x),
				pageY: Math.ceil(t / duration * y)
			}));
			setTimeout(mv, 0);
		})();
	};

	Mocha.Context.prototype.tap = function() {
		this.tapStart();
		this.tapEnd();
	};

	Mocha.Context.prototype.press = function(callback, duration) {
		var self = this;
		duration = duration || $.Finger.pressDuration * 1.5 /* security */;

		this.tapStart();
		setTimeout(function() {
			self.tapEnd();
			callback.call(self);
		}, duration);
	};

	Mocha.Context.prototype.doubleTap = function(callback, duration) {
		var self = this;
		duration = duration || $.Finger.doubleTapInterval * 0.5 /* security */;

		this.tap();
		setTimeout(function() {
			self.tap();
			callback.call(self);
		}, duration);
	};

	Mocha.Context.prototype.drag = function(callback, x, y, duration) {
		duration = duration || $.Finger.flickDuration * 1.5 /* security */;

		this.move(callback, x, y, duration);
	};

	/** adjusting time values for testing purposes */

	$.Finger.doubleTapInterval = 25;
	$.Finger.pressDuration = 25;
	$.Finger.flickDuration = 25;

	/** test suite */

	describe('jquery.finger', function() {
		before(function() {
			this.$elems = $('#qunit-fixture .touchme');
		});

		after(function() {
			$('body').off();
			this.$elems.text('').off();
			this.$elems = null;
		});

		describe('tap event', function() {
			it('should work with direct events', function() {
				var handler = sinon.spy();
				this.$elems.on('tap', handler);
				this.tap();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(this.$elems[0]);
			});

			it('should work with delegated events', function() {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.tap();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(this.$elems[0]);
			});

			it('should fire handlers in order', function() {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('tap', '.touchme', handler1);
				$('body').on('tap', '.touchme', handler2);
				this.tap();
				handler1.should.have.been.calledOnce;
				handler2.should.have.been.calledOnce;
				handler1.should.have.been.calledBefore(handler2);
			});

			it('should fire direct/delegated handlers', function() {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('tap', handler1);
				$('body').on('tap', '.touchme', handler2);
				this.tap();
				handler1.should.have.been.calledOnce;
				handler2.should.have.been.calledOnce;
				handler1.should.have.been.calledBefore(handler2);
			});

			it('should not fire removed direct events', function() {
				var handler = sinon.spy();
				$('body').on('tap', handler);
				this.tap();
				$('body').off('tap', handler);
				this.tap();
				handler.should.have.been.calledOnce;
			});

			it('should not fire removed delegated events', function() {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.tap();
				$('body').off('tap', '.touchme', handler);
				this.tap();
				handler.should.have.been.calledOnce;
			});

			it('should not fire when moving', function(done) {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.drag(function() {
					handler.should.not.have.been.called;
					done();
				}, 50, 0);
			});
		});

		describe('press event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('press', handler);
				this.press(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('press', '.touchme', handler);
				this.press(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should not fire tap event', function(done) {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('tap', '.touchme', handler1);
				$('body').on('press', '.touchme', handler2);
				this.press(function() {
					handler1.should.not.have.been.called;
					handler2.should.have.been.calledOnce;
					done();
				});
			});

			it('should not trigger press when tapping twice', function(done) {
				var handler = sinon.spy();
				$('body').on('press', '.touchme', handler);
				this.doubleTap(function() {
					handler.should.not.have.been.calledOnce;
					done();
				}, $.Finger.pressDuration);
			});
		});

		describe('double tap event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('doubletap', handler);
				this.doubleTap(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('doubletap', '.touchme', handler);
				this.doubleTap(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});
		});

		describe('drag event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('drag', handler);
				this.drag(function() {
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				}, 100, 0);
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('drag', '.touchme', handler);
				this.drag(function() {
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				}, 100, 0);
			});

			it('should pass valid coordinates', function(done) {
				var lastX = -1;
				var lastY = -1;
				this.$elems.on('drag', function(e) {
					e.pageX.should.exist;
					e.pageX.should.be.at.least(lastX);
					lastX = e.pageX;
					e.pageY.should.exist;
					e.pageY.should.be.at.least(lastY);
					lastY = e.pageY;
					e.pageX.should.equal(e.pageY);
				});
				this.drag(done, 100, 100);
			});
		});
	});

}(jQuery));