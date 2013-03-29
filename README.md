# jQuery Finger <sup>0.0.9</sup>

jQuery tap & gestures, fingers in the nose.

**jQuery Finger** unifies click and touch events by removing the 300ms delay on touch devices. It also provide a common
set of events to handle basic gestures such as drag and pinch.
Small (< 1kb gzipped), it is focused on performance, is well tested and ... also supports jQuery delegated events.

[![Build Status](https://travis-ci.org/ngryman/jquery.finger.png)](https://travis-ci.org/ngryman/jquery.finger)
[![Dependency Status](https://gemnasium.com/ngryman/jquery.finger.png)](https://gemnasium.com/ngryman/jquery.finger)

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ngryman/jquery.finger/master/dist/jquery.finger.min.js
[max]: https://raw.github.com/ngryman/jquery.finger/master/dist/jquery.finger.js

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

          | tap | doubletap | press | drag | flick | pinch | spread | rotate
----------|-----|-----------|-------|------|-------|-------|--------|-------
Available |  ✔ |     ✔     |   ✔  |  ✔  |   ✔  |       |        |

Here is a complete list of gestures that will *probably* be supported: http://smustalks.appspot.com/io-12/#44

## Examples
_(Coming soon)_

## Notes

When running tests in the browser, your mouse / finger must not interact with the page.

## Instacode

<p align="center">
  <img src="http://instacod.es/file/65854">
</p>

## Release History

### v0.0.9
  - fixed incorrect event type.
  - added to jam.
  - added to bower.

### v0.0.8
  - fixed bugs on delegated events.
  - better cross-browser support (still needs some work/tests).
  - internal refactoring for consistency and performance.

### v0.0.7
  - various cross browsers fixes.

### v0.0.6
  - updated description.

### v0.0.5
  - updated jquery manifest and published on http://plugins.jquery.com.

### v0.0.4
  - added `drag` and `flick` gestures.
  - enhanced `event` object.
  - internal refactoring for consistency.

### v0.0.3
  - migration to **grunt** 0.4.
  - migration to **mocha** / **chaijs** for tests.

### v0.0.2
  - added `doubletap` and `press` gestures.
  - internal refactoring for consistency and performance.

### v0.0.1
  - `tap` gesture first implementation.
