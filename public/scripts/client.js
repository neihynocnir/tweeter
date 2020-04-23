/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Preventing XSS with Escaping
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

 // rendering tweets 
const renderTweets = tweets => {
  $.each(tweets, (index, tweetObj) => {
    $('#tweet-container').append(createTweetElement(tweetObj));
  });
};

// Construction of the element
const createTweetElement = tweetObj => {
  let tweet = `
  <article class="tweet-article">
    <header>
      <div class="left-side">
        <span><img src=${escape(tweetObj.user.avatars)}></span>
        <span>${escape(tweetObj.user.name)}</span>
      </div>
      <span class="handle">${escape(tweetObj.user.handle)}</span>
    </header>
      <span class="content">${escape(tweetObj.content.text)}</span>
    <footer>
      <span class="date">${escape(tweetObj.created_at)}</span>
      <div class="icon-options">
        <span><img src="./images/flag-icon.png"></span>
        <span><img src="./images/retweet-icon.png"></span>
        <span><img src="./images/like-icon.png"></span>
      </div>
    </footer>
  </article>`;
  return tweet;
}

// Get the list of tweets
const loadTweets = () => {
  $.ajax({
    url: '/tweets',
    type: 'GET',
    dataType: 'JSON',
  })
  .then((response) => { 
    renderTweets(response);
  })
  .catch(() => {
    console.log('Error');
  })
};

// add a new tweet
const submitHandler = (text) => {
  if (!text) {
    $('.alert').slideDown();
    $('.alert strong').text('Message is empty!');
    return;
  } else if (text.length > 140) {
    $('.alert').slideDown();
    $('.alert strong').text('Message is too long!');
    return;
  } else {
    $.ajax({
      url: '/tweets',
      type: 'POST',
      data: {
        text 
      }
    })
    .then(() => {
      console.log('Succesfully sent');
      loadTweets();
    })
    .catch(() => {
      console.log('Error');
    })
  }
};

// control ;)
$(document).ready(function() {
  $('.alert').hide();
  loadTweets('/tweets', 'GET', renderTweets);
  

  $('form').submit(function(event) {
    event.preventDefault();
    submitHandler($('textarea').val());
  });
});
