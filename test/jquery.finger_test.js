/*global Mocha, describe, xdescribe, beforeEach, afterEach, it, xit, sinon*/

(function($) {

	var hasTouch = 'ontouchstart' in window,
		startEvent = hasTouch ? 'touchstart' : 'mousedown',
		stopEvent = hasTouch ? 'touchend' : 'mouseup',
		moveEvent = hasTouch ? 'touchmove' : 'mousemove';

	/** extend Mocha.Context to hence event trigger */

	Mocha.Context.prototype.tapStart = function() {
		this.$elems.filter(':first').trigger(new $.Event(startEvent, { pageX: 0, pageY: 0 }));
	};

	Mocha.Context.prototype.tapEnd = function() {
		this.$elems.filter(':first').trigger(stopEvent);
	};

	Mocha.Context.prototype.move = function(callback, x, y, duration) {
		var self = this, last = Date.now(), t = 0, timer;

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
			timer = setTimeout(mv, 0);
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

	Mocha.Context.prototype.flick = function(callback, x, y, duration) {
		duration = duration || $.Finger.flickDuration * 0.5 /* security */;
		this.move(callback, x, y, duration);
	};

	/** adjusting time values for testing purposes */

	$.Finger.doubleTapInterval = 25;
	$.Finger.pressDuration = 25;
	$.Finger.flickDuration = 25;

	/** test suite */

	describe('jquery.finger', function() {
		beforeEach(function() {
			this.$elems = $('#qunit-fixture .touchme');
		});

		afterEach(function() {
			$('body').off();
			this.$elems.off().text('');
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
				this.$elems.on('tap', handler);
				this.tap();
				this.$elems.off('tap', handler);
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
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				}, 100, 0);
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('drag', '.touchme', handler);
				this.drag(function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				}, 100, 0);
			});

			it('should pass valid coordinates', function(done) {
				var lastX = -1;
				var lastY = -1;
				this.$elems.on('drag', function(e) {
					e.x.should.exist;
					e.x.should.be.at.least(lastX);
					lastX = e.x;
					e.y.should.exist;
					e.y.should.be.at.least(lastY);
					lastY = e.y;
					e.x.should.equal(e.y);
				});
				this.drag(done, 100, 100);
			});

			it('should pass valid delta', function(done) {
				var lastDy = -1;
				this.$elems.on('drag', function(e) {
					e.dx.should.exist;
					e.dx.should.be.equal(0);
					e.dy.should.exist;
					e.dy.should.be.at.least(lastDy);
					lastDy = e.dy;
				});
				this.drag(done, 0, 100);
			});

			it('should detect horizontal orientation', function(done) {
				this.$elems.on('drag', function(e) {
					e.orientation.should.be.equal('horizontal');
				});
				this.drag(done, 100, 50);
			});

			it('should detect vertical orientation', function(done) {
				this.$elems.on('drag', function(e) {
					e.orientation.should.be.equal('vertical');
				});
				this.drag(done, 50, 100);
			});

			it('should not fire removed events', function(done) {
				var self = this;
				var handler = sinon.spy();
				this.$elems.on('drag', handler);
				this.drag(function() {
					var callCount = handler.callCount;
					self.$elems.off('drag', handler);
					self.drag(function() {
						handler.callCount.should.equal(callCount);
						done();
					}, 100, 100);
				}, 100, 100);
			});
		});

		describe('flick event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('flick', handler);
				this.flick(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				}, 100, 0);
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('flick', '.touchme', handler);
				this.flick(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				}, 100, 0);
			});
		});
	});

}(jQuery));