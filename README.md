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
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
