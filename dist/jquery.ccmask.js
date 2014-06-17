/**
 * @license
 * jquery-ccmask
 * Simple jQuery Credit Card Masking Plugin
 * Copyright Drew Foehn <drew@pixelburn.net> All Rights Reserved
 * License MIT
 */

(function(root, factory) {
    "use strict";
    if(typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(root.jQuery);
    }
}(this, function($) {

    "use strict";

    function getKeys(o) {
        if(Object.keys) {
            return Object.keys(o);
        }
        if(o !== Object(o)) {
            throw new TypeError('Object.keys called on a non-object');
        }
        var k = [], p;
        for(p in o) {
            if(Object.prototype.hasOwnProperty.call(o, p)) {
                k.push(p);
            }
        }
        return k;
    }

    function registerEvents(ele, eventCollection) {
        var events = getKeys(eventCollection), e;
        for(var i = 0; i < events.length; i++) {
            e = events[i];

            if(e === 'submit') {
                $(ele).parents('form').on(e, {ccmask: ele}, eventCollection[e]);
            } else {
                $(ele).on(e, eventCollection[e]);
            }
        }
    }

    function deRegisterEvents(ele, eventCollection) {
        var events = getKeys(eventCollection), e;
        for(var i = 0; i < events.length; i++) {
            e = events[i];

            if(e === 'submit') {
                $(ele).parents('form').off(e, {ccmask: ele}, eventCollection[e]);
            } else {
                $(ele).off(e, eventCollection[e]);
            }
        }
    }

    function format(cardnumber) {
        var spaceCount = Math.floor(cardnumber.length / 4);
        var cn = cardnumber.split(''), val = [], i = 0;

        do {
            val = val.concat(cn.slice(i * 4, (i + 1) * 4));
            val.push(' ');
        } while(i++ < spaceCount);

        return val.join('').replace(/\s\s*$/, '');
    }

    function mask(val) {
        var ret = new Array(val.length - (val.slice(-3).length));
        return ret.join('•') + val.slice(-4);
    }

    function caretEnd(ele) {
        if(ele.setSelectionRange) {
            var len = $(ele).prop('value').length;
            ele.setSelectionRange(len, len);

        } else {
            $(ele).prop('value', $(ele).prop('value'));
        }

        ele.scrollTop = 999999;
    }

    var oldHooks = $.valHooks.input;

    $.valHooks.text = {
        get: function(ele) {
            if($(ele).data('ccmask')) {
                return $(ele).data('unmaskedValue');
            }
            if(oldHooks) {
                return oldHooks.get.apply(this, arguments);
            }
        },
        set: function(ele, value) {

            if(oldHooks) {
                oldHooks.set.apply(this, arguments);
            }

            if($(ele).data('ccmask')) {
                value = value.replace(/![0-9]+/, '').substring(0, 16);
                $(ele).data('unmaskedValue', value);
                if(!$(ele).hasClass('placeholder')) {
                    $(ele).prop('value', format(mask(value)));
                }
            }

            return value;
        }
    };

    var ccmask = {
        mouseup: function() {
            caretEnd(this);
        },
        keypress: function(e) {
            var val = String.fromCharCode(e.charCode || e.which);

            if(this.value === '') {
                $(this).val('');
            }

            if(/([0-9])/.test(val) && $(this).val().length < 16) {

                if($(this).val() !== '') {
                    val = $(this).val() + val;
                }
                if(val !== '') {
                    $(this).val(val);
                }
            }

            caretEnd(this);
            e.preventDefault();

        },
        keydown: function(e) {
            // on delete
            if(e.keyCode === 8) {
                $(this).val($(this).val().substring(0, $(this).val().length - 1));
                e.preventDefault();
            }
        },
        keyup: function() {
            if(this.value === '') {
                $(this).val('');
            }
            caretEnd(this);
        },
        blur: function() {
            if(this.value === '') {
                $(this).val('');
            }
        },
        // broken for now
        paste: function() {
            var ele = this;
            setTimeout(function() {

                $(ele).val($(ele).prop('value'));
            }, 100);
        },
        submit: function(e) {

            var ele = e.data.ccmask;

            if($(this).data('validator')) {
                if(!$(this).data('validator').element(ele)) {
                    return false;
                }
            }

            $(ele).ccmask();
        }

    };

    $.fn.ccmask = function() {
        return this.each(function() {

            if($(this).data('ccmask')) {

                $(this).removeData('ccmask');
                $(this).prop('value', $(this).data('unmaskedValue'));
                $(this).removeData('unmaskedValue');

                deRegisterEvents(this, ccmask);

            } else {

                $(this).data('unmaskedValue', this.value);
                $(this).data('ccmask', true);
                $(this).val($(this).data('unmaskedValue'));

                registerEvents(this, ccmask);

            }

        });
    };

    return $.fn.ccmask;

}));