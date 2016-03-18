/* global document, $ */

/*
 * be sure to check this page out for lesson examples
 * http://touchtype.co/index.php/typing/lessons/1
 *
 * and speed typing formulas
 * http://www.speedtypingonline.com/typing-equations
 */

var write = $('#write');
var test = $('#test-container');

var keydown = {}; // used as a dictionary for marking keydowns, preventing key repeat
var shift = false;
var capsLock = false;

var numCorrect = 0;
var testCount = 0;
var globalCharacter = '';

var startTime; // initialized by first key press in `updateKeyboard` method

var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()`~-_=+[{]}\|;:'\",<.>/?";
var Keycode = {
    ALT: 18,
    BACKSPACE : 8,
    CAPSLOCK: 20,
    COMMAND: 91, // osx apple key
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
    WINDOWS: 92
};

var possible = $('#possible');
var correct  = $('#correct');
var grosswpm = $('#gross-wpm');
var netwpm   = $('#netwpm');
var accuracy = $('#accuracy');

var updateStats = function() {
    var elapsedMinutes = moment();
    elapsedMinutes = elapsedMinutes.diff(startTime) / 1000 / 60;
    console.log(elapsedMinutes);
    possible.html(testCount);
    correct.html(numCorrect);
    grosswpm.html((testCount / 5) / elapsedMinutes);
    netwpm.html();
    accuracy.html(numCorrect / testCount);
    setTimeout(updateStats, 1000);
};

// inclusive random integer
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomIntInclusive = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// returns a random character from `charset` variable
var getRandomPrint = function() {
    return charset[getRandomIntInclusive(0,charset.length-1)];
};

// generates a random sequence of characters for a typing test
var genSequence = function() {
    var w = $('#keyboard-container').innerWidth();
    var ems = parseFloat($('html').css('font-size'));
    var wxems = w/(16 + ems) - 1;
    var test = $('#test-container .test');
    var count = testCount;
    for(var i = count; i < testCount + wxems - 1; i++) {
        test.append('<div class="inline char" id="char' + i + '"></div>');
    }
    test.append('<div class="inline char last" id="char' + (testCount + parseInt(wxems)) + '"></div>'); // the last one
    
    count = testCount;
    while(count < wxems + testCount) {
        var rand = getRandomIntInclusive(1,6);
        for(var i = 0; i < rand; i++) {
            var c = getRandomPrint();
            $('#char' + count++).html(c);
        }
        $('#char' + count++).html(' ');
    }
};

//update the state of the keys pressed in the keyboard UI
var updateKeyboard = function(target, event) {
    
    var character = target.html();
    
    if(startTime == null) {
        startTime = moment();
        updateStats();
    }
    
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

    // check correctness
    var target = $('#char' + testCount++);
    if(character === target.text()) {
        target.addClass('green');
        numCorrect++;
    } else {
        target.addClass('red');
    }
    
    if(target.hasClass('last')) {
        genSequence();
    }
};

var registerHandlers = function () {
    
    // prevent backspace navigation
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
        
        // disable key repeat
        // http://stackoverflow.com/questions/9098901/how-to-disable-repetitive-keydown-in-jquery
        var key = e.keyCode || e.which;
        if(keydown[key] == null) {
            var target = $('[data-keycode=' + key + ']');
            globalCharacter = updateKeyboard(target, e);
            keydown[key] = true;
        }
    });

    // key is up
    $(document).on('keyup', function (e) {
        var key = e.keyCode || e.which;
        keydown[key] = null;
        var target = $('[data-keycode=' + e.keyCode + ']');

        // undo shift
        if(target.hasClass('left-shift') || target.hasClass('right-shift')) {
            target.toggleClass('keydown');
            $('.letter').toggleClass('uppercase');
            $('.symbol span').toggle();
            shift = (shift === true) ? false : true;
            return false;
        }
        
        // uncolor keys
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
        var s = String.fromCharCode(e.which);
        $('#string').html(s);
        $('#keypress').html(e.keyCode);
    });
};

$(document).ready(function () {
    registerHandlers();
    genSequence();
});
