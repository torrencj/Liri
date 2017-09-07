/*************************************************************************************************
REQUIRES
*************************************************************************************************/

var natural = require('natural');
var path = require('path');
var omdb = require('./liri_omdb.js')
var twitter = require('./liri_twitter.js')
var spotify = require('./liri_spotify.js')
var google = require('./liri_google.js')
var tokenizer = new natural.WordTokenizer();
var TfIdf = natural.TfIdf;
var tfidf = new TfIdf();


/*************************************************************************************************
START Classifiers
*************************************************************************************************/


var loadLiri = new Promise(function(resolve, reject) {
  natural.BayesClassifier.load('liri.json', null, function(err, liri) {
    if (err) {
      // console.log(err);
      if (err.errno == -2) {
        var liri = new natural.BayesClassifier();

        liri.addDocument('spotify', 'spotify');
        liri.addDocument('search', 'google');
        liri.addDocument('twitter', 'twitter');
        liri.addDocument('movies', 'omdb');

        liri.train();
        liri.save('liri.json', function(err, classifier) {
            // the classifier is saved to the liri.json file!
        });
      }
    } else {
      liri.events.on('trainedWithDocument', function (obj) {
         console.log(obj);
      });
      resolve(liri);
    }
  });
});

function liriCat(string, callback) {
  loadLiri.then(function(liri) {
    var result = liri.classify(string);
    callback(result);
  })
}

exports.liriCatTrain = function(input, category){
  console.log("Okay...");
  if (input) {
    loadLiri.then(liri => {
      liri.addDocument(input, category);
      liri.train();
      console.log(input +" saved as "+ category);
      liri.save('liri.json', function(err, liri) {
        if (err) {
          console.log(err);
        }
      });
    })
  }
}


var loadImportance = new Promise(function(resolve, reject) {
  natural.BayesClassifier.load('importance.json', null, function(err, importance) {
    if (err) {
      console.log(err);
      if (err.errno == -2) {
        //New Classifier Setup
        var importance = new natural.BayesClassifier();

        importance.addDocument('liri', 'lv');
        importance.addDocument('search', 'lv');
        importance.addDocument('google', 'lv');
        importance.addDocument('hey liri', 'lv');
        importance.addDocument('terminator 2', 'in');
        importance.addDocument('the matrix', 'in');
        importance.addDocument('the weather', 'in');

        importance.train();
        importance.save('importance.json', function(err, classifier) {
            // the classifier is saved to the classifier.json file!
        });
      }
    } else {
      importance.events.on('trainedWithDocument', function (obj) {
         console.log(obj);
      });
      resolve(importance);
    }
  });
});


function importanceTrain(input, category){
  loadImportance.then(importance => {
    importance.addDocument(input, category);
    importance.train();
    console.log(input +" saved as "+ category);
    importance.save('importance.json', function(err, importance) {
      if (err) {
        console.log(err);
      }
    });
  })
}

/*************************************************************************************************
END Classifiers
*************************************************************************************************/


/*************************************************************************************************
START Textparsing
*************************************************************************************************/


function parse(inputString, callback) {
  natural.PorterStemmer.attach();
    tfidf.addDocument(inputString);

    loadImportance.then(importance => {
      brillTag(inputString, function(result) {
      console.log(JSON.stringify(result));
      chunk(result, function(result) {
        if (result) {
          var thischunk;
          chunkvalues = [];
          //record tfidfs for each chunk
          for (var i = 0; i < result.length; i++) {
            thischunk = result[i].join(' ');
            chunkvalues.push([thischunk, tfidf.tfidfs(thischunk)[0]]);
          }
          handleQuery(importance, chunkvalues, function(result) {
            console.log(result);
            console.log(chunkvalues);
            console.log(inputString);
            // if (result[0].length < 3) {
            //   result[0] = inputString;
            // }
            callback(result)
          });
        }
      });
    });
  });
}

//Returns: the only chunk, or the most important chunk, or attampts to classify importance.
function handleQuery(importance, chunkArray, callback) {
  //return the top tf-idf
  var top = 0;
  var resultIndex = 0;
  for (var i = 0; i < chunkArray.length; i++) {
    if (chunkArray[i][1] > top) {
      top = chunkArray[i][1];
      resultIndex = i;
    }
  }

  // classify each if there are more than one.
  if (chunkArray.length > 1) {
    var classification;
    for (var i = 0; i < chunkArray.length; i++) {
      classification = importance.classify( chunkArray[i][0])
      chunkArray[i].push(classification);
    }
  }
  callback(chunkArray[resultIndex])
}

function brillTag(string, callback) {
  var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
  var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
  var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
  var defaultCategory = 'N';

  var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
  var rules = new natural.RuleSet(rulesFilename);
  var tagger = new natural.BrillPOSTagger(lexicon, rules);

  var sentence = tokenizer.tokenize(string);
  callback(tagger.tag(sentence));
}


function chunk(array, callback) {
  var chunks = [];
  var prev, next;
  var currentChunk = 0;

  for (var i = 0; i < array.length; i++) {
    prev = array[i - 1];
    next = array[i + 1];

    if (isDT(array[i])) { //hit a DT
      if (chunks[currentChunk] && !isDT(next)) { //we have a currentChunk and next is not a DT also
        currentChunk++; //increment our chunk
      }
      if (!isDT(next)) {
        pushIfExists(chunks, array[i][0], currentChunk);
      }
    }
    else if (!isJ(array[i]) && !isNoun(array[i]) || isSplitWord(array[i])) {
      if (chunks[currentChunk]) { //increment our chunk
        currentChunk++;
      }
    } else { //should be a noun or J
      pushIfExists(chunks, array[i][0], currentChunk);
    }

  }
  // console.log("---------------  Chunks  ---------------");
  // console.log(chunks);
  callback(chunks);
}

//Helper functions

function isSplitWord(taggedWord) {
  return (taggedWord && taggedWord[0] == 'search');
}

function isDT(taggedWord) {
  return (taggedWord && taggedWord[1] == 'DT');
}

function isNoun(taggedWord) {
  return (taggedWord && taggedWord[1][0] == 'N');
}

function isV(taggedWord) {
  return (taggedWord && taggedWord[1][0] == 'V');
}

function isJ(taggedWord) {
  return (taggedWord && taggedWord[1][0] == 'J');
}

function pushIfExists(array, item, index) {
  if (array[index]) {
    array[index].push(item);
  } else {
    array[index] = [];
    array[index].push(item);
  }
}

/*************************************************************************************************
END Textparsing
*************************************************************************************************/


/*************************************************************************************************
START Main Logic
*************************************************************************************************/

var runLiri = function (string, callback){
  var results = [];
  loadLiri.then(liri => {
    results.push(liri.classify(string));
    parse(string, result => {
      results.push(result[0]);
      results.push(result[1]);
      // console.log(results[1]);
      // console.log("FINAL: ");
      console.log(results);
      callback(results);
    })
  });
}

// var thisinput = process.argv.slice(2, process.argv.length);
// thisinput = thisinput.join(' ');

exports.main = function(thisinput, callback) {
  var final ={};
  final.input = thisinput;

  if (thisinput) {
    runLiri(thisinput, liriResult => {
      final.category = liriResult[0];
      final.search = liriResult[1];

      switch (liriResult[0]) {
        case "google":
          // console.log("I'll search Google for " + liriResult[1]);
          google.search(liriResult[1], result => {
            console.log(result);
            final.result = result;
            callback(final);
          });
        break;
        case "omdb":
          // console.log("I'll search OMDB for " + liriResult[1]);
          omdb.search(liriResult[1], result => {
            if (result) {
              console.log(result);
              final.result = result;
              callback(final);
            } else {
              console.log("I didn't find anything...");
              callback('err');
            }
          });
        break;
        case "spotify":
          // console.log("I'll search Spotify for " + liriResult[1]);
          spotify.searchArtist(liriResult[1], result => {
            if (result.length > 0) {
              console.log(result);
              final.result = result;
              callback(final);
            }
            else {
              spotify.searchTracksByArtist(liriResult[1], result => {
                if (result.length > 0) {
                  console.log(result);
                  final.result = result;
                  callback(final);
                } else {
                  console.log("sorry, I couldn't find anything.");
                }
              })
            }

          });
        break;
        case "twitter":
          // console.log("I'll search Twitter for " + liriResult[1]);
          twitter.search(liriResult[1], result => {
            console.log(result);
            final.result = result;
            callback(final);
          });
        break;
        default:
        console.log("Sorry, I don't understand you.");
      }


    });
  } else {
    // console.log("psst, try entering something, jackass.");
  }
}

// }


/*************************************************************************************************
END Main Logic
*************************************************************************************************/
