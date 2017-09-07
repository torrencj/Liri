var Twitter = require('twitter');


var client = new Twitter({
  consumer_key: 'Ei0552qMLhTt4DhTO55Nz3a5H',
  consumer_secret: 'BmISWXOXhjDAkU7TACZgActRCwnTLVrncmidaknxBi0WANm8zR',
  access_token_key: '903470377958912000-G5EXo26zVXL6iT8XHcdtUntcvoIDM9T',
  access_token_secret: 'uI3RdyE0QtF1p1BhHPwhztscUzJ10wS7Ezd3e8QG7X51S'
});

exports.search = function(string, callback) {
  client.get('search/tweets', {q: 'donald trump'}, function(error, tweets, response) {
    var results = [];
    //  console.log(tweets.statuses[0]); If I want all of them...tweets.statuses.length
     for (var i = 0; i < 10; i++) {
       results.push(
         {
           posted: tweets.statuses[i].created_at,
           user: tweets.statuses[i].user.name,
           text: tweets.statuses[i].text
         }
       )}
       callback(results);
  });
}
