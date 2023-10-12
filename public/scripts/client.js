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

  $('form').on('submit', (event) => {
    event.preventDefault();
    const formData = $('form').serialize(); 
    if ($('#tweet-text').val().length < 140) {
      $.ajax({
        type: 'POST', 
        url: "/tweets",
        data: formData, 
        success: (response) => {
          console.log('POST request successful:', response);
          console.log(formData);
        },
        error: function(error) {
          console.error('POST request failed:', error);
        }
      }); 
      loadTweets();
    } else {
      alert('Too many characters');
    }
});


  const loadTweets = () => {
    $.ajax('/tweets', { method: 'GET' })
    .then(function (data) {
      console.log('Success: ', data);
      renderTweets(data)
    });
  }

const renderTweets = function(tweets) {
  for (const tweet of tweets) {
    $('.tweet-con').prepend(createTweetElement(tweet));
  }
}

const daysAgo = (timestamp) => {
  const currentTimestamp = Date.now();
  const difference = currentTimestamp - timestamp;
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const daysAgo = Math.floor(difference / millisecondsInDay);
  return daysAgo;
}

const createTweetElement = function(tweet) {
  let $tweet = $(
    `<article>
      <header>
        <div class="con-1">
          <img class='avatar' src="${tweet.user.avatars}">
          <span class="username">${$('<div>').text(tweet.user.name).html()}</span>
        </div>
        <p class="handle">${$('<div>').text(tweet.user.handle).html()}</p>
      </header>
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


loadTweets();
});

