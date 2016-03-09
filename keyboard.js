/* global document, $ */

/*
 * be sure to check this page out for lesson examples
 * http://touchtype.co/index.php/typing/lessons/1
 */

var capsLock = false;

var toggleKeys = function (shift) {
    if (shift) {
        $('.off').hide();
        $('.on').show();
        $('.letter').addClass('uppercase');
    } else {
        $('.on').hide();
        $('.off').show();
        $('.letter').removeClass('uppercase');
    }
};

var registerHandlers = function () {
    
    // prevent backspace (delete) navigation
    // http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back
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

    // toggle shift
    $(document).on('keyup keydown', function (e) {
        toggleKeys(e.shiftKey);
    });
    
    // key is down
    $(document).on('keydown', function (e) {
        console.log(e.keyCode);
        switch(e.keyCode) {
            case 191: // firefox: prevent quick search '/'
                e.preventDefault();
                break;
            case 20: // toggle caps lock
                capsLock = !capsLock;
                if(capsLock) {
                    $('[data-keycode=20]').addClass('keydown');
                } else {
                    $('[data-keycode=20]').removeClass('keydown');  
                }
                break;
            default:
                $('[data-keycode=' + e.keyCode + ']').addClass('keydown');
                break;
        }
    });

    // key is up
    $(document).on('keyup', function (e) {
        switch(e.keyCode) {
            case 20: // caps lock
                // ignore
                break;
            default:
                $('[data-keycode=' + e.keyCode + ']').removeClass('keydown');
                break;
        }
    });

    // display keys in text area
    $(document).on('keypress', function (e) {
        var s = String.fromCharCode( e.which );
        var capsKey = $('[data-keycode=20]');
        if (s.toUpperCase() === s && !e.shiftKey) {
            capsKey.addClass('keydown');
        } else {
            capsLock = false;
            capsKey.removeClass('keydown');
        }
        var txt = $('#write');
        txt.val(txt.val() + String.fromCharCode(e.keyCode));
    });

};

$(document).ready(function () {
    registerHandlers();
});
