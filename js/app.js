//This file requires jquery!
var input = document.querySelector('input');
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var lastSent;

//speech recognition vars.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


/*********************************************************************************************
START speech recognition
*********************************************************************************************/

var micBtn = document.querySelector('#micButton');
var micIcon = document.querySelector('#micIcon');

function startSpeech() {
  micBtn.disabled = true;
  micIcon.textContent = 'hearing';
  $('#micButton').toggleClass('pulse');
  $('#micButton').addClass('red');
  var recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    console.log(event.results);
    var speechResult = event.results[0][0].transcript;
    inputTxt.value = speechResult;
    console.log(speechResult);
    console.log('Confidence: ' + event.results[0][0].confidence);
    $('.txt').submit();
  }

  recognition.onspeechend = function() {
    recognition.stop();
    micBtn.disabled = false;
    micIcon.textContent = 'keyboard_voice';
    $('#micButton').toggleClass('pulse');
    $('#micButton').toggleClass('red');
  }

  recognition.onerror = function(event) {
    micBtn.disabled = false;
    micIcon.textContent = 'keyboard_voice';
    $('#micButton').toggleClass('pulse');
    // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
  }
}

micBtn.addEventListener('click', startSpeech);

/*********************************************************************************************
END speech recognition
*********************************************************************************************/

inputForm.onsubmit = function(event) {

  $('#loading-results').toggleClass('hidden');
  $('.highlight').removeClass('highlight');
  event.preventDefault();
  console.log(inputTxt.value);
  lastSent = inputTxt.value;
  inputTxt.blur();
  $.ajax({
    url:"https://us-central1-trans-grid-168913.cloudfunctions.net/liribot?s=" + inputTxt.value,
    // url:"https://104.154.104.227:8000/parse?s=" + inputTxt.value,
    method:"GET"
  }).done(function(response) {
    $('#loading-results').toggleClass('hidden')
    console.log(response);
    handle(response);
    $('#category').text(response.category);
    $('#search-string').text(response.search);
    $('#' + response.classification).addClass('highlight');
  });
  $('#speechstring').text(inputTxt.value);
  inputTxt.value = '';
}

  $('.clickable').click(function(event) {
    console.log(event.currentTarget);
    if (lastSent) {
      console.log(lastSent);
      console.log(event.currentTarget.id);
      //Not used for now.
      //TODO
      // $.ajax({
      //   url:"https://us-central1-trans-grid-168913.cloudfunctions.net/liribot?s=" + lastSent + "&c=" + event.currentTarget.id,
      //   method:"POST"
      // }).done(function(response) {
      //   console.log(response);
      // });
      lastSent = '';
      Materialize.toast("Thanks! I'll get it right next time.", 4000)
    } else {
      // do nothing
    }
  });

function handle(response) {
  if (response.category) { //if it exists at all.
    $("#interaction-panel").toggleClass('hidden');
    if (response.category == 'google') {
      $('#target').fadeOut();
      $('#target').empty();

      for (var i = 0; i < response.result.length; i++) {
        if (response.result[i].title && response.result[i].href && response.result[i].desc) {
          googleGen(response.result[i].title, response.result[i].href, response.result[i].desc);
        }
      }
      $('#target').fadeIn();
    } else if (response.category == 'twitter') {
      $('#target').fadeOut();
      $('#target').empty();
      for (var i = 0; i < response.result.length; i++) {
        twitterGen(response.result[i].userName, response.result[i].userImg, response.result[i].text);
      }
      $('#target').fadeIn();

    }else if (response.category == 'omdb') {
      for (var i = 0; i < response.result.length; i++) {
        omdbGen(response.result[i].Poster, response.result[i].Title, response.result[i].imdbID)
      }
    }else { //spotify
      spotifyGen(response.result["0"].uri);
    }
  } else {
    console.log("Something went wrong.");
  }
}



function googleGen(title, href, desc){
  $("#target").append(
    '<ul class="collection">'
    +'<li class="collection-item">'
    +'<span class="title"><h5><a href='+href+'>'+title+'</a></h5></span>'
    +'<p>'+href+'</p>'
    +'<p>'+desc+'</p>'
    +'</li>'
    +'</ul>'
  )
}

function twitterGen(userName, userImage, text) {
  $('#target').append('<ul class="collection">'
    + '<li class="collection-item avatar">'
    + '<img src='+userImage+' alt="" class="circle">'
    + '<span class="title">'+userName+'</span>'
    + '<p>'+text+'</p></li></ul>')
}

function omdbGen(posterURI, title, imdb) {
  if (posterURI == "N/A") {
    posterURI = 'http://via.placeholder.com/200x300?text=N/A';
  }
  $('#target').append('<div class="card col s4"><div class="card-image"><img src='+posterURI
  +'></div><div class="card-content"><p>'+title+'</p></div><div class="card-action">'
  + '<a href="http://www.imdb.com/title/'+imdb+'/">View on IMDB</a></div></div>')
}

function spotifyGen(uri) {
  $('#target').html('<iframe src="https://open.spotify.com/embed?uri=' + uri + '" frameborder="0" allowtransparency="true"></iframe>');
}
