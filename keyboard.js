/* global document, $ */

/*
 * be sure to check this page out for lesson examples
 * http://touchtype.co/index.php/typing/lessons/1
 */

var shift = false;
var capsLock = false;
var write = $('#write');

var updateKeyboard = function(target, event) {
    var character = target.html();
    
    //color keys (except shift and caps)
    if(!target.hasClass('capslock') && !target.hasClass('left-shift') && !target.hasClass('right-shift')) {
        target.addClass('keydown');
    }

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

    //less than
    if(character === '&lt;') {
        character = '<'
    }

    //greater than
    if(character === '&gt;') {
        character = '>';
    }

    //quote
    if(character === '&quot;') {
        character = '"';
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
    if(shift === true && event.type === 'click') {
        $('.symbol span').toggle();
        $('.left-shift, .right-shift').removeClass('keydown');
        if(capslock === false) {
            $('.letter').toggleClass('uppercase');
        }
        shift = false;
    }
    
    //add the character
    if(character != null) {
        write.val(write.val() + character);
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
    
    $(document).on('keydown', function(e) {
       console.log("down"); 
    });
    
    // key is down
    $(document).on('keydown', function (e) {
        console.log(e.keyCode);
        var target = $('[data-keycode=' + e.keyCode + ']');
        updateKeyboard(target, e);
    });

    // key is up
    $(document).on('keyup', function (e) {
        //undo shift
        var target = $('[data-keycode=' + e.keyCode + ']');
        if(target.hasClass('left-shift') || target.hasClass('right-shift')) {
            target.toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();
            shift = (shift === true) ? false : true;
            return false;
        }
        //uncolor keys (except caps and shift)
        if(!target.hasClass('left-shift') && !target.hasClass('right-shift')) {
            target.removeClass('keydown');
        }
        
        //caps lock off
        if(target.hasClass('capslock')) {
            target.toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            capslock = false;
        }
    });

    //mouse clicked or screen tapped
    $('#keyboard li').click(function(e) {
        var target = $(this);
        updateKeyboard(target, e);
    });
};

$(document).ready(function () {
    registerHandlers();
});
