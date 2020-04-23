// This file will be solely responsible for this character counter.

$(document).ready(function() {
  $('#tweet-text').on('keyup', function() {
    const maxCharacter = 140;
    const txtAreaLength = this.value.length;
    const totalCharacter = maxCharacter - txtAreaLength;
    const counter = $(this).closest('form').find('.counter');
    if (totalCharacter < 0){
      counter.text(totalCharacter).css('color', '#FF0000');
    } else {
      counter.text(totalCharacter).css('color', '#545149');;
    }
  });
}); 