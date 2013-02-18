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

	Mocha.Context.prototype.tap = function() {
		this.tapStart();
		this.tapEnd();
	};

	Mocha.Context.prototype.press = function(callback, duration) {
		var self = this;
		duration = duration || $.Finger.pressDuration;

		this.tapStart();
		setTimeout(function() {
			self.tapEnd();
			callback.call(self);
		}, duration);
	};

	Mocha.Context.prototype.doubleTap = function(callback, duration) {
		var self = this;
		duration = duration || $.Finger.doubleTapInterval * 0.5;

		this.tap();
		setTimeout(function() {
			self.tap();
			callback.call(self);
		}, duration);
	};

	/** Adjusting time values for testing purposes */

	$.Finger.doubleTapInterval = 50;
	$.Finger.pressDuration = 25;

	/** test suite */

	describe('tap event', function() {
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
	});

}(jQuery));