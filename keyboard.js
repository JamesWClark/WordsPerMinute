/*
var onkeydown = (function (ev) {
  console.log('key');
  var key;
  var isShift;
  if (window.event) {
    key = window.event.keyCode;
    isShift = !!window.event.shiftKey; // typecast to boolean
  } else {
    key = ev.which;
    isShift = !!ev.shiftKey;
  }
  if ( isShift ) {
    switch (key) {
      case 16: // ignore shift key
        break;
      default:
        alert(key);
        // do stuff here?
        break;
    }
  }
});
*/

var init = function() {
  //register handlers
  $(document).on('keyup keydown', function(e) {
    console.log(e.shiftKey);
  });
};

$(document).ready(init);