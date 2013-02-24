# jQuery Finger

jQuery touch gestures, fingers in the nose.

[![Build Status](https://travis-ci.org/ngryman/jquery.finger.png)](https://travis-ci.org/ngryman/jquery.finger)
<a href="https://gemnasium.com/ngryman/jquery.finger">
  <img src="https://gemnasium.com/ngryman/jquery.finger.png" width="110" height="13" alt="Dependency Status">
</a>

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

## Release History

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
