# jquery-ccmask

## Simple Credit Card Mask Plugin for jQuery

This plugin has two ways of masking input, either on keyup or blur. By default the input will mask the users input on blur.

```js
// masks input on blur
$('input.ccmask-blur').ccmask();

// masks input on keyup
$('input.ccmask-keyup').ccmask({keyup:true});
```

### Demo

A demo is located at http://pixeldrew.github.io/plugins/jquery-ccmask/example/

### Features

- Restricts only Integer Inputs.
- Extends jQuery.valHooks so $.val always returns the unmasked value.
- Unmasks value on form submit (Plugin won't unmask on submit if jquery plugin validation is used and value fails http://jqueryvalidation.org/documentation/)
- Will not interfere with plugin jQuery placeholder fallback https://github.com/mathiasbynens/jquery-placeholder.

Note: If masking is set to keyup, caret position is handled by the plugin and will always be at the end of the input.

### License

Copyright (c) 2014, Drew Foehn. (MIT License)
See LICENSE for more info.
