//Requires jquery
var input = document.querySelector('input');
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var lastSent;

//speech recognition stuff
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


/*
Mic button stuff.
*/
var micBtn = document.querySelector('#micButton');

function testSpeech() {
  micBtn.disabled = true;
  micBtn.textContent = 'Listening...';
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
  }

  recognition.onspeechend = function() {
    recognition.stop();
    micBtn.disabled = false;
    micBtn.textContent = 'Use your voice!';
  }

  recognition.onerror = function(event) {
    micBtn.disabled = false;
    micBtn.textContent = 'Start new test';
    // diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}

micBtn.addEventListener('click', testSpeech);

/*
End mic button stuff
*/



inputForm.onsubmit = function(event) {
  $('.highlight').removeClass('highlight');
  event.preventDefault();
  console.log(inputTxt.value);
  lastSent = inputTxt.value;
  // console.log(event);
  inputTxt.blur();

  $.ajax({
    url:"http://104.154.104.227:8000/parse?s=" + inputTxt.value,
    method:"GET"
  }).done(function(response) {
    console.log(response.classification);
    $('#suggestion').text(response.classification);
    $('#' + response.classification).addClass('highlight');
  });
  $('#speechstring').text(inputTxt.value);
  inputTxt.value = '';
}

  $('.clickable').click(function(event) {
    console.log(event.currentTarget);
    if (lastSent) {
      //send stuff

      console.log(lastSent);
      console.log(event.currentTarget.id);
      // inputTxt.blur();
      $.ajax({
        url:"http://104.154.104.227:8000/parse?s=" + lastSent + "&c=" + event.currentTarget.id,
        method:"POST"
      }).done(function(response) {
        console.log(response);
      });
      lastSent = '';
    } else {
      // do nothing
    }
    //TODO modial popup saying thanks.

  });
