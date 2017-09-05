//Require jquery
var input = document.querySelector('input');
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.txt');
var lastSent;

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
    // event.preventDefault();
    //TODO make it obvious what the user has done. Change the html to refect it.
    //TODO modial popup saying thanks.

  });

  // $.getJSON("http://104.154.104.227:8000/parse?" + "callback=mycallback", {
  // string: inputTxt.value,
  // otherKey: 'otherValue'
  // }, function(data){
  //      // Handles the callback when the data returns
  // });
