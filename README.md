# jQuery Finger [![Version](http://img.shields.io/badge/version-0.1.2-brightgreen.svg)](https://github.com/ngryman/jquery.finger#release-history)

[![Build Status](http://img.shields.io/travis/ngryman/jquery.finger.svg)](https://travis-ci.org/ngryman/jquery.finger)
[![Dependency Status](http://img.shields.io/gemnasium/ngryman/jquery.finger.svg)](https://gemnasium.com/ngryman/jquery.finger)
[![Size](http://img.shields.io/badge/size-0.4%20kB-blue.svg)](https://raw2.github.com/ngryman/jquery.finger/master/dist/jquery.finger.min.js)
[![Gittip](http://img.shields.io/gittip/ngryman.svg)](https://www.gittip.com/ngryman/)

jQuery tap & gestures, fingers in the nose.

**Finger** unifies click and touch events by removing the **300ms delay** on touch devices. It also provides a common
set of events to handle basic gestures such as **flick**, **drag**, **press** and **double tap**.<br>
Very small (< 0.5kb gzipped), it is focused on **performance** and **KISS**, is well tested and also supports jQuery **delegated events**.

## Getting Started

Download the [production version][min] *(454 bytes gzipped)* or the [development version][max] *(4269 bytes)*.<br>
You can also install it via [Jam] or [Bower].

[min]: https://raw.github.com/ngryman/jquery.finger/master/dist/jquery.finger.min.js
[max]: https://raw.github.com/ngryman/jquery.finger/master/dist/jquery.finger.js
[Jam]: http://jamjs.org
[Bower]: http://twitter.github.io/bower

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.finger.min.js"></script>
<script>
  // direct event
  $('.touchme').on('tap', function() {
    console.log('direct');
  });

  // delegated event
  $('body').on('tap', '.touchme', function() {
    console.log('delegated');
  });
});
</script>
```

## Documentation

### Gestures

**Finger** focuses on one finger events:

          | tap | doubletap | press | drag | flick |
----------|-----|-----------|-------|------|-------|
Available |  ✔ |     ✔     |   ✔  |  ✔  |   ✔  |

### Thresholds

You can tweak how **Finger** handles events by modifying thresholds found in the `$.Finger` object.

#### `pressDuration`

This is the time the user will have to hold in order to fire a `press` event.
If this time is not reached, a `tap` event will be fired instead.
This defaults to `300`ms.

#### `doubleTapInterval`

This is the maximum time between two `tap` events to fire a `doubletap` event.
If this time is reached, two distinct `tap` events will be fired instead.
This defaults to `300`ms.

#### `flickDuration`

This is the maximum time the user will have to swipe in order to fire a `flick` event.
If this time is reached, only `drag` events will continue to be fired.
This defaults to `150`ms.

#### `motionThreshold`

This is the number of pixel the user will have to move in order to fire motion events (drag or flick).
If this time is not reached, no motion will be handled and `tap`, `doubletap` or `press` event will be fired.
This defaults to `5`px.

### Additional event parameters

**Finger** enhances the default event object when there is motion (drag & flick). It gives information about
the pointer position and motion:
 - **x**: the `x` page coordinate.
 - **y**: the `y` page coordinate.
 - **dx**: this `x` *delta* (amount of pixels moved) since the last event.
 - **dy**: this `y` delta since the last event.
 - **adx**: this `x` absolute delta since the last event.
 - **ady**: this `y` absolute delta since the last event.
 - **orientation**:
   - `horizontal`: motion was detected as an horizontal one. This can be tweaked with `$.Finger.motionThreshold`.
   - `vertical`: motion was detected as a vertical one. This can be tweaked with `$.Finger.motionThreshold`.
 - **direction**:
   - `1`: motion has a positive direction, either left to right for horizontal, or top to bottom for vertical.
   - `-1`: motion has a negative direction, either right to left for horizontal, or bottom to top for vertical.

### Prevent default behavior

There are three ways of preventing default behavior.

#### Globally

You can prevent **every native behavior** globally:
```javascript
$.Finger.preventDefault = true;
```

#### Specifically

You can prevent default behavior, just like any other standard events:
```javascript
$('body').on('tap', '.touchme', function(e) {
	// ...
	e.preventDefault();
});
```

Note that if you bind multiple events of the same type on the same element, and one of them is preventing default,
every trigger of that event will implicitly prevent default of other bound events.

**press** event can only be prevented globally, not specifically.

#### Original event

Internally **Finger** binds a global `touch` / `mouse` event to do its duty. This *native* event can be accessed via
the `e.originalEvent` property. This is a *shared* event, that means that this will be the same object across all your
handlers.

With this original event you are able to decide how you want to prevent default behavior by adding any logic in any of
your handlers.

This is an example on how to prevent horizontal scrolling, but not vertical:
```javascript
$('body').on('drag', '.drag', function(e) {
	// let the default vertical scrolling happen
	if ('vertical' == e.orientation) return;

	// prevent default horizontal scrolling
	e.preventDefault();
});
```

#### Notes

This is how **Finger** prevents default behavior:

                        | tap | doubletap | press | drag | flick | globally |
------------------------|-----|-----------|-------|------|-------|----------|
touchstart / mousedown  |     |           |       |      |       |    ✔    |
touchmove / mousemove   |     |           |       |  ✔   |  ✔   |          |
touchend / mouseup      |  ✔ |     ✔     |       |  ✔   |  ✔   |          |

More [details].

[details]: http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/How-to-prevent-default-touch-and-mouse-events-in-the-BlackBerry/ta-p/1223685

## Examples

### Remove the 300ms delay on every links of your page

```javascript
$('body').on('tap', 'a', function(e) {
	window.location = $(this).attr('href');
	e.preventDefault();
});
```

### Delegated events for dynamically loaded elements (AJAX):

```javascript
$('body').on('tap', '.toggle', function() {
	$(this).toggleClass('is-selected');
});
```

### Swipe to reveal

```javascript
$('#menu').on('flick', function(e) {
	if ('horizontal' == e.orientation) {
		if (1 == e.direction) {
			$(this).addClass('is-opened');
		}
		else {
			$(this).removeClass('is-opened');
		}
	}
});
```

## Notes

 - **Finger** uses [VirtualPointer] in its test suite to simulate mouse and touch events.
 - On Chrome 25+, `preventDefault` does not work as expected because `ontouchstart` is defined. To make it work, you
 have to manually prevent the default behavior in the `mousedown` or `click` event.
 - When using `flick` or `drag` event on an image, you have to set `user-drag: none` on it (and the prefixed
   versions).

[VirtualPointer]: https://github.com/ngryman/virtual-pointer

## Instacode

<p align="center">
  <img src="http://instacod.es/file/65854">
</p>

## Projects using Finger

- Webplate: http://getwebplate.com
- Others?

## Release History

```
v0.1.1
 - fixed `preventDefault` on desktop browsers for `tap` and `doubletap` events (#24).

v0.1.0
 - stable release.

v0.1.0-beta.2
 - fixed Chrome desktop and false positive touch detection.
 - fixed drag events with a correct end flag value (#17).

v0.1.0-beta.1 (buggy)
 - fixed successive taps to fail on different elements.

v0.1.0-beta (buggy)
 - better prevent default logic (#9, #12).
 - huge internal refactoring.

v0.1.0-alpha.1
 - give access to original events (#12).

v0.1.0-alpha
 - ie8 legacy support.
 - fixed prevent default event parameter.

v0.0.11
 - `press` event is now fired by `timeout` instead of `touchend`.

v0.0.10
 - fixed events fired multiple times (#1).
 - added `preventDefault` support.
 - internal refactoring for size and performance.

v0.0.9
  - fixed incorrect event type.
  - added to jam.
  - added to bower.

v0.0.8
  - fixed bugs on delegated events.
  - better cross-browser support (still needs some work/tests).
  - internal refactoring for consistency and performance.

v0.0.7
  - various cross browsers fixes.

v0.0.6
  - updated description.

v0.0.5
  - updated jquery manifest and published on http://plugins.jquery.com.

v0.0.4
  - added `drag` and `flick` gestures.
  - enhanced `event` object.
  - internal refactoring for consistency.

v0.0.3
  - migration to **grunt** 0.4.
  - migration to **mocha** / **chaijs** for tests.

v0.0.2
  - added `doubletap` and `press` gestures.
  - internal refactoring for consistency and performance.

v0.0.1
  - `tap` gesture first implementation.
```

## Author

| [![twitter/ngryman](http://gravatar.com/avatar/2e1c2b5e153872e9fb021a6e4e376ead?size=70)](http://twitter.com/ngryman "Follow @ngryman on Twitter") |
|---|
| [Nicolas Gryman](http://ngryman.sh) |

<img width="1" height="1" src="https://cruel-carlota.pagodabox.com/cec9f8a0012c619d46fc5398ab2f3046">
