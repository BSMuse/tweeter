/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */ 

$(document).ready(function() {
  $("#tweet-text").on('input', function() {
    const textLength = $(this).val().length;
    const remainingCharacters = 140 - textLength;
    $('.counter').text(remainingCharacters);

    if (remainingCharacters < 0) {
      $('.counter').addClass('red');
    } else  if (remainingCharacters > 0) {
      $('.counter').removeClass('red');
    }
  });
});
 
