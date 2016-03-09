/* global document, $ */

/*
 * be sure to check this page out for lesson examples
 * http://touchtype.co/index.php/typing/lessons/1
 */

var shift = false;
var capsLock = false;
var write = $('#write');


var toggleKeys = function () {
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
                    $('.capslock').addClass('keydown');
                } else {
                    $('.capslock').removeClass('keydown');  
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
        write.val(write.val() + String.fromCharCode(e.keyCode));
    });

    //mouse click, screen taps
    $('#keyboard li').click(function(e) {
        var target = $(this);
        var character = target.html();
        
        //shift
        if(target.hasClass('left-shift') || target.hasClass('right-shift')) {
            target.toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();
            
            shift = (shift === true) ? false : true;
            capslock = false;
            return false;
        }
        
        //caps lock
        if(target.hasClass('capslock')) {
            target.toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            capslock = true;
            return false;
        }
        
        //delete
        if(target.hasClass('delete')) {
            var txt = write.val();
            write.val(txt.substr(0, txt.length - 1));
            return false;
        }
        
        //symbols
        if(target.hasClass('symbol')) {
            character = $('span:visible', target).html();
        }
        
        //ampersand
        if(character === '&amp;') {
            character = '&';
        }
        
        //space
        if(target.hasClass('space')) {
            character = ' ';
        }
        
        //tab
        if(target.hasClass('tab')) {
            character = '\t';
        }
        
        //return
        if(target.hasClass('return')) {
            character = '\n';
        }
        
        //letters
        if(target.hasClass('uppercase')) {
            character = character.toUpperCase();
        }
        
        //remove shift after key click
        if(shift === true) {
            $('.symbol span').toggle();
            $('.left-shift, .right-shift').removeClass('keydown');
            if(capslock === false) {
                $('.letter').toggleClass('uppercase');
            }
            shift = false;
        }
        
        //add the character
        write.val(write.val() + character);
    });
};

$(document).ready(function () {
    registerHandlers();
});
