/*global Mocha, describe, xdescribe, before, beforeEach, afterEach, it, xit, sinon, VirtualPointer, console*/

(function($) {

	/** test suite */

	describe('jquery.finger', function() {
		before(function() {
			this.pointer = VirtualPointer(this);

			// adjusting time values for testing purposes
			this.pointer.DOUBLETAP_DURATION = $.Finger.doubleTapInterval = 25;
			this.pointer.PRESS_DURATION = $.Finger.pressDuration = 25;
			this.pointer.FLICK_DURATION = $.Finger.flickDuration = 25;
		});

		beforeEach(function() {
			this.$elems = $('#fixtures').find('.touchme');
		});

		afterEach(function(done) {
			$('body').off();
			this.$elems.off().text('');
			this.$elems = null;

			// wait a enough time between tests in order to not trigger double tap events
			setTimeout(done, $.Finger.doubleTapInterval);
		});

		describe('tap event', function() {
			it('should work with direct events', function() {
				var handler = sinon.spy();
				this.$elems.on('tap', handler);
				this.pointer.tap();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(this.$elems[0]);
			});

			it('should work with delegated events', function() {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.pointer.tap();
				handler.should.have.been.calledOnce;
				handler.should.have.been.calledOn(this.$elems[0]);
			});

			it('should pass the correct event type', function() {
				this.$elems.on('tap', function(e) {
					e.type.should.equal('tap');
				});
				this.pointer.tap();
			});

			it('should fire handlers in order', function() {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('tap', '.touchme', handler1);
				$('body').on('tap', '.touchme', handler2);
				this.pointer.tap();
				handler1.should.have.been.calledOnce;
				handler2.should.have.been.calledOnce;
				handler1.should.have.been.calledBefore(handler2);
			});

			it('should fire direct/delegated handlers', function() {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('tap', handler1);
				$('body').on('tap', '.touchme', handler2);
				this.pointer.tap();
				handler1.should.have.been.calledOnce;
				handler2.should.have.been.calledOnce;
				handler2.should.have.been.calledBefore(handler1);
			});

			it('should not fire removed direct events', function() {
				var handler = sinon.spy();
				this.$elems.on('tap', handler);
				this.pointer.tap();
				this.$elems.off('tap', handler);
				this.pointer.tap();
				handler.should.have.been.calledOnce;
			});

			it('should not fire removed delegated events', function() {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.pointer.tap();
				$('body').off('tap', '.touchme', handler);
				this.pointer.tap();
				handler.should.have.been.calledOnce;
			});

			it('should not fire when moving', function(done) {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.pointer.drag(50, 0, function() {
					handler.should.not.have.been.called;
					done();
				});
			});

			it('should not fire when another target is under the pointer before release', function() {
				var handler = sinon.spy();
				$('body').on('tap', '.touchme', handler);
				this.pointer.tapStart();
				this.pointer.y = 100;
				this.pointer.tapEnd();
				handler.should.not.have.been.called;
			});

			it('should not fire mix events multiple times (#1)', function() {
				var directHandler = sinon.spy();
				var delegatedHandler = sinon.spy();
				$('.touchme').on('tap', directHandler);
				$('body').on('tap', '.touchme', delegatedHandler);
				this.pointer.tap();
				directHandler.should.have.been.calledOnce;
				delegatedHandler.should.have.been.calledOnce;
			});
		});

		describe('press event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('press', handler);
				this.pointer.press(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('press', '.touchme', handler);
				this.pointer.press(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should pass the correct event type', function(done) {
				this.$elems.on('press', function(e) {
					e.type.should.equal('press');
				});
				this.pointer.press(done);
			});

			it('should not fire tap event', function(done) {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('tap', '.touchme', handler1);
				$('body').on('press', '.touchme', handler2);
				this.pointer.press(function() {
					handler1.should.not.have.been.called;
					handler2.should.have.been.calledOnce;
					done();
				});
			});

			it('should not trigger press when tapping twice', function(done) {
				var handler = sinon.spy();
				$('body').on('press', '.touchme', handler);
				this.pointer.doubleTap(function() {
					handler.should.not.have.been.calledOnce;
					done();
				}, $.Finger.pressDuration);
			});

			it('should not trigger press when tapping twice', function(done) {
				var handler = sinon.spy();
				$('body').on('press', '.touchme', handler);
				this.pointer.doubleTap(function() {
					handler.should.not.have.been.calledOnce;
					done();
				}, $.Finger.pressDuration);
			});

			it('should not trigger press when dragging a long time', function(done) {
				var handler = sinon.spy();
				$('body').on('press', '.touchme', handler);
				this.pointer.drag(100, 0, function() {
					handler.should.not.have.been.calledOnce;
					done();
				}, $.Finger.pressDuration * 1.5);
			});

			it('should not fire mix events multiple times (#1)', function(done) {
				var directHandler = sinon.spy();
				var delegatedHandler = sinon.spy();
				$('.touchme').on('press', directHandler);
				$('body').on('press', '.touchme', delegatedHandler);
				this.pointer.press(function() {
					directHandler.should.have.been.calledOnce;
					delegatedHandler.should.have.been.calledOnce;
					done();
				});
			});

			it('should not fire double tap event (#2)', function(done) {
				var handler1 = sinon.spy();
				var handler2 = sinon.spy();
				$('body').on('doubletap', '.touchme', handler1);
				$('body').on('press', '.touchme', handler2);
				this.pointer.press(function() {
					handler1.should.not.have.been.called;
					handler2.should.have.been.calledOnce;
					done();
				});
			});
		});

		describe('double tap event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('doubletap', handler);
				this.pointer.doubleTap(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('doubletap', '.touchme', handler);
				this.pointer.doubleTap(function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should pass the correct event type', function(done) {
				this.$elems.on('doubletap', function(e) {
					e.type.should.equal('doubletap');
				});
				this.pointer.doubleTap(done);
			});

			it('should not fire mix events multiple times (#1)', function(done) {
				var directHandler = sinon.spy();
				var delegatedHandler = sinon.spy();
				$('.touchme').on('doubletap', directHandler);
				$('body').on('doubletap', '.touchme', delegatedHandler);
				this.pointer.doubleTap(function() {
					directHandler.should.have.been.calledOnce;
					delegatedHandler.should.have.been.calledOnce;
					done();
				});
			});
		});

		describe('drag event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('drag', handler);
				this.pointer.drag(100, 0, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('drag', '.touchme', handler);
				this.pointer.drag(100, 0, function() {
					handler.callCount.should.be.above(1);
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should always been fired when there is motion', function(done) {
				var handler = sinon.spy();
				this.$elems.on('drag', handler);
				this.pointer.flick(100, 0, function() {
					handler.callCount.should.be.at.least(1);
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should pass the correct event type', function(done) {
				this.$elems.on('drag', function(e) {
					e.type.should.equal('drag');
				});
				this.pointer.drag(100, 0, done);
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
				this.pointer.drag(100, 100, done);
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
				this.pointer.drag(0, 100, done);
			});

			it('should detect horizontal orientation', function(done) {
				this.$elems.on('drag', function(e) {
					e.orientation.should.be.equal('horizontal');
				});
				this.pointer.drag(100, 50, done);
			});

			it('should detect vertical orientation', function(done) {
				this.$elems.on('drag', function(e) {
					e.orientation.should.be.equal('vertical');
				});
				this.pointer.drag(50, 100, done);
			});

			it('should tell what the last event is', function(done) {
				var end = false;
				this.$elems.on('drag', function(e) {
					end = e.end;
				});
				this.pointer.drag(100, 0, function() {
					end.should.be.truthy;
					done();
				});
			});

			it('should not fire removed events', function(done) {
				var self = this;
				var handler = sinon.spy();
				this.$elems.on('drag', handler);
				this.pointer.drag(100, 100, function() {
					var callCount = handler.callCount;
					self.$elems.off('drag', handler);
					self.pointer.drag(0, 100, function() {
						handler.callCount.should.equal(callCount);
						done();
					});
				});
			});

			it('should correctly stop at the edge of an element for delegated events', function(done) {
				var targets = [], end = false;
				$('body').on('drag', '.touchme', function(e) {
					if (!~targets.indexOf(e.target)) {
						targets.push(e.target);
					}
					end = e.end;
				});
				this.pointer.drag(0, 200, function() {
					targets.length.should.equal(1);
					end.should.be.truthy;
					done();
				});
			});

			it('should reset end flag for subsequent motion events', function(done) {
				var self = this, endTrueCount = 0;

				this.$elems.on('drag', function(e) {
					if (e.end) endTrueCount++;
				});
				this.pointer.drag(100, 100, function() {
					self.pointer.drag(100, 100, function() {
						endTrueCount.should.equal(2);
						done();
					});
				});
			});

			it('should correctly fire if binded to an element that has child and target changes', function(done) {
				var end = false, y = 0;
				$('#fixtures').css('padding', 10).on('drag', function(e) {
					y = e.y;
					end = e.end;
				});
				this.pointer.drag(0, 300, function() {
					y.should.be.greaterThan(200);
					end.should.be.truthy;
					done();
				});
			});
		});

		xdescribe('flick event', function() {
			it('should work with direct events', function(done) {
				var handler = sinon.spy();
				this.$elems.on('flick', handler);
				this.pointer.flick(100, 0, function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should work with delegated events', function(done) {
				var handler = sinon.spy();
				$('body').on('flick', '.touchme', handler);
				this.pointer.flick(100, 0, function() {
					handler.should.have.been.calledOnce;
					handler.should.have.been.calledOn(this.$elems[0]);
					done();
				});
			});

			it('should pass the correct event type', function(done) {
				this.$elems.on('flick', function(e) {
					e.type.should.equal('flick');
				});
				this.pointer.flick(100, 0, done);
			});

			it('should not fire mix events multiple times (#1)', function(done) {
				var directHandler = sinon.spy();
				var delegatedHandler = sinon.spy();
				$('.touchme').on('flick', directHandler);
				$('body').on('flick', '.touchme', delegatedHandler);
				this.pointer.flick(100, 0, function() {
					directHandler.should.have.been.calledOnce;
					delegatedHandler.should.have.been.calledOnce;
					done();
				});
			});
		});
	});

}(jQuery));