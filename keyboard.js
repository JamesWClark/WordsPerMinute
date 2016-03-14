/* global document, $ */

/*
 * be sure to check this page out for lesson examples
 * http://touchtype.co/index.php/typing/lessons/1
 */
var write = $('#write');

var keydown = {};
var shift = false;
var capsLock = false;

var Keycode = {
    ALT: 18,
    BACKSPACE : 8,
    CAPSLOCK: 20,
    CONTROL: 17,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ESCAPE: 27,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    FORWARD_SLASH: 191,
    HOME: 36,
    INSERT: 45,
    LEFT: 37,
    NUM_LOCK: 144,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    PAUSE_BREAK: 19,
    RETURN: 13,
    RIGHT: 39,
    SCROLL_LOCK: 145,
    SHIFT: 16,
    SPACE: 32,
    TAB: 9,
    TICK: 222,
    UP: 38,
    WINDOWS: 92 //not sure about this one - could be HOME instead - need to try it on Mac
};


//update the state of the keys pressed in the keyboard UI
var updateKeyboard = function(target, event) {
    
    console.log(event.keyCode);
    
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
        return false;
    }

    //caps lock
    if(target.hasClass('capslock')) {
        target.toggleClass('keydown');
        $('.letter').toggleClass('uppercase');
        capsLock = (capsLock === true) ? false : true;
        return false;
    }

    //delete
    if(target.hasClass('delete')) {
        var txt = write.val();
        write.val(txt.substr(0, txt.length - 1));
        return false;
    }
    
    //tab, forward slash, or tick mark - prevent leave focus
    if(event.keyCode === Keycode.FORWARD_SLASH || 
       event.keyCode === Keycode.TAB || 
       event.keyCode === Keycode.TICK) {
        event.preventDefault();
    }
    
    //tick - prevent leave focus in firefox

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
        character = '<';
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
        if(capsLock === false) {
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
        if (event.keyCode === Keycode.BACKSPACE) {
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
    
    // key is down
    $(document).on('keydown', function (e) {
        //http://stackoverflow.com/questions/9098901/how-to-disable-repetitive-keydown-in-jquery
        var key = e.keyCode || e.which;
        if(keydown[key] == null) {
            var target = $('[data-keycode=' + key + ']');
            updateKeyboard(target, e);
            keydown[key] = true;
        }
    });

    // key is up
    $(document).on('keyup', function (e) {
        var key = e.keyCode || e.which;
        keydown[key] = null;
        var target = $('[data-keycode=' + e.keyCode + ']');

        //undo shift
        if(target.hasClass('left-shift') || target.hasClass('right-shift')) {
            target.toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();
            shift = (shift === true) ? false : true;
            return false;
        }
        
        //uncolor keys
        if(!target.hasClass('capslock')) {
            target.removeClass('keydown');
        }
        
        if(target.hasClass('capslock')) {
            target.removeClass('keydown');
            $('.letter').removeClass('uppercase');
            capsLock = false;
        }
    });
    
    // detect caps lock - in keypress event bc keydown and keypress give different charcodes,
    // http://stackoverflow.com/questions/348792/how-do-you-tell-if-caps-lock-is-on-using-javascript
    $(document).keypress(function(e) {
        var s = String.fromCharCode(e.which);
        var key = e.keyCode || e.which;
        var target = $('[data-keycode=' + e.keyCode + ']');
        $('#string').html(s);
        
        // set correct caps lock state
        if (target.hasClass('letter') && !capsLock && s.toUpperCase() === s && s.toLowerCase() !== s && !e.shiftKey) {
            //alert('caps fix');
            $('.capslock').toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            capsLock = (capsLock === true) ? false : true;
            
            // replace last character with corrected caps version (keypress event happens after keydown event)
            var letter = write.val()[write.val().length - 1];
            write.val(write.val().slice(0,-1) + letter.toUpperCase());
            return false;
        }
    });
    
    // update event UI
    $(document).on('keydown', function(e) {
        $('#keydown').html(e.keyCode);
    });
    
    $(document).on('keyup', function(e) {
        $('#keyup').html(e.keyCode);
    });
    
    $(document).on('keypress', function(e) {
        $('#keypress').html(e.keyCode);
    });
};

$(document).ready(function () {
    registerHandlers();
});
