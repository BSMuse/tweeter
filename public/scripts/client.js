$(document).ready(function() {
  // Update character counter and apply red class for negative character count
  $("#tweet-text").on('input', function() {
    const textLength = $(this).val().length;
    const remainingCharacters = 140 - textLength;
    $('.counter').text(remainingCharacters);

    if (remainingCharacters <= -1) {
      $('.counter').addClass('red');
    } else if (remainingCharacters >= -1) {
      $('.counter').removeClass('red');
    }
  });

  // Handle form submission
  $('form').on('submit', (event) => {
    event.preventDefault();
    const formData = $('form').serialize();

    // Remove any existing warnings
    $(".warning").remove();

    if ($('#tweet-text').val().trim() === '') {
      // Display an empty input warning
      $("section").prepend(emptyWarning());
    } else if ($('#tweet-text').val().length > 140) {
      // Display a length warning for tweets that are too long
      $("section").prepend(inputLengthWarning());
    } else {
      // Make a POST request to the server and handle success or error
      $.ajax({
        type: 'POST',
        url: "/tweets",
        data: formData,
        success: () => {
          // Clear the input field
          $('#tweet-text').val('');

          // Clear the .tweet-con div before rendering new tweets
          $('.tweet-con').empty();

          // Fetch and render tweets
          loadTweets();

          // Reset the character counter
          $('.counter').text(140);
        },
        error: function(error) {
          console.error('POST request failed:', error);
        }
      });
    }
  });

  // Function to load tweets from the server
  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
      .then(function(data) {
        renderTweets(data);
      });
  }

  // Function to render tweets on the page
  const renderTweets = function(tweets) {
    $('.tweet-con').empty(); // Clear existing tweets
    for (const tweet of tweets) {
      $('.tweet-con').prepend(createTweetElement(tweet));
    }
  }

  // Function to calculate days ago from a timestamp
  const daysAgo = (timestamp) => {
    const currentTimestamp = Date.now();
    const difference = currentTimestamp - timestamp;
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const daysAgo = Math.floor(difference / millisecondsInDay);
    return daysAgo;
  }

  // Function to create a tweet element based on tweet data
  const createTweetElement = function(tweet) {
    let $tweet = $(
      `<article>
        <div class="tweet-top">
          <div class="con-1">
            <img class='avatar' src="${tweet.user.avatars}">
            <span class="username">${$('<div>').text(tweet.user.name).html()}</span>
          </div>
          <p class="handle">${$('<div>').text(tweet.user.handle).html()}</p>
        </div>
        <p>${$('<div>').text(tweet.content.text).html()}</p>
        <footer>
          <date>${daysAgo(tweet.created_at)} Days ago</date>
          <div class="icons-con">
            <i class="fa-solid fa-flag"><a></a></i>
            <i class="fa-solid fa-retweet"><a></a></i>
            <i class="fa-solid fa-heart"><a></a></i>
          </div>
        </footer>
      </article>`
    );

    return $tweet;
  };

  // Function to create a warning for character limit exceeding
  const inputLengthWarning = () => {
    let $warning = $(
      `<div class="warning">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>${$('<div>').text("WARNING! You are trying to submit too many characters!").html()}</p>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>`
    );
    return $warning;
  };

  // Function to create a warning for an empty tweet
  const emptyWarning = () => {
    let $warning = $(
      `<div class="warning">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>${$('<div>').text("WARNING! Your tweet cannot be empty!").html()}</p>
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>`
    );
    return $warning;
  };

  // Initial loading of tweets
  loadTweets();
});
