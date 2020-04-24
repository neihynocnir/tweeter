// Parsing timestamp to relative time
const timeAgo = (createdAt) => {
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;
  let elapsed = Date.now() - createdAt;
  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' seconds ago';
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' minutes ago';
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' hours ago';
  } else if (elapsed < msPerMonth) {
    return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
  } else if (elapsed < msPerYear) {
    return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
  } else {
    return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
  }
};

// Preventing XSS with Escaping
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// Rendering tweets
const renderTweets = tweets => {
  $('#tweet-container').empty();
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
      <span class="date">${escape(timeAgo(tweetObj.created_at))}</span>
      <div class="icon-options">
        <span><img src="./images/flag-icon.png"></span>
        <span><img src="./images/retweet-icon.png"></span>
        <span><img src="./images/like-icon.png"></span>
      </div>
    </footer>
  </article>`;
  return tweet;
};

// Get the list of tweets
const loadTweets = () => {
  $.ajax({
    url: '/tweets',
    type: 'GET',
    dataType: 'JSON',
  }).then((response) => {
    renderTweets(response);
  }).catch(() => {
    console.log('Error');
  });
};

// Add a new tweet
const submitHandler = (text) => {
  if (!text) {
    $('.alert').slideDown('slow');
    $('.alert strong').text('Message is empty!');
    return;
  } else if (text.length > 140) {
    $('.alert').slideDown('slow');
    $('.alert strong').text('Message is too long!');
    return;
  } else {
    $.ajax({
      url: '/tweets',
      type: 'POST',
      data: {text}
    }).then(() => {
      console.log('Succesfully sent');
      $('textarea').val('');
      $('.counter').text(140);
      loadTweets();
    }).catch(() => {
      console.log('Error when trying to submit the tweet');
    });
  }
};

// control ;)
$(document).ready(function() {
  $('.alert').hide();
  $('.new-tweet').hide();
  loadTweets('/tweets', 'GET', renderTweets);
  
  //submit the form
  $('form').submit(function(event) {
    event.preventDefault();
    submitHandler($('textarea').val());
  });
  
  // hiding the alert when showing up
  $('.closebtn').on('click', function() {
    $(this).parent().slideUp('slow');
  });
  
  //showing compose tweeter
  $('.left-side-container img').on('click', function() {
    ($('.new-tweet').is(':hidden')) ? $('.new-tweet').slideDown('slow') : $('.new-tweet').slideUp('slow');
  });
});
