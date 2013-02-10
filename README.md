# jQuery Finger

jQuery touch gestures, fingers in the nose.

[![Build Status](https://travis-ci.org/ngryman/jquery.finger.png)](https://travis-ci.org/ngryman/jquery.finger)

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
Available |  ✔ |     ✔     |   ✔  |      |       |       |        |

Here is a complete list of gestures that will *probably* be supported: http://smustalks.appspot.com/io-12/#44

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
