/* global document, $ */

/*
 * be sure to check this page out for lesson examples
 * http://touchtype.co/index.php/typing/lessons/1
 */

var shifted = false;
var keysDown = {};

var toggleKeys = function (shift) {
    if (shift) {
        shifted = true;
        $('.off').hide();
        $('.on').show();
        $('.letter').addClass('uppercase');
    } else {
        shifted = false;
        $('.on').hide();
        $('.off').show();
        $('.letter').removeClass('uppercase');
    }
};

var registerHandlers = function () {
    
    // Prevent the backspace key from navigating back.
    //http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
    $(document).unbind('keydown').bind('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode === 8) {
            var d = event.srcElement || event.target;
            if ((d.tagName.toUpperCase() === 'INPUT' &&
                (
                    d.type.toUpperCase() === 'TEXT' ||
                    d.type.toUpperCase() === 'PASSWORD' ||
                    d.type.toUpperCase() === 'FILE' ||
                    d.type.toUpperCase() === 'SEARCH' ||
                    d.type.toUpperCase() === 'EMAIL' ||
                    d.type.toUpperCase() === 'NUMBER' ||
                    d.type.toUpperCase() === 'DATE')
                ) ||
                d.tagName.toUpperCase() === 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            } else {
                doPrevent = true;
            }
        }
        if (doPrevent) {
            event.preventDefault();
        }
    });


    $(document).on('keyup keydown', function (e) {
        toggleKeys(e.shiftKey);
        console.log(e.keyCode);
    });

    $(document).on('keydown', function (e) {
        if(e.keyCode === 191) { // firefox: prevent quick search '/'
            e.preventDefault();
        }
        keysDown[e.keyCode] = true;
        $('[data-keycode=' + e.keyCode + ']').addClass('keydown');
    });

    $(document).on('keyup', function (e) {
        keysDown[e.keyCode] = false;
        $('[data-keycode=' + e.keyCode + ']').removeClass('keydown');
    });


};

$(document).ready(function () {
    registerHandlers();
});
