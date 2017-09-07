var google = require('google');

google.protocol = 'https' // searches using https...
google.resultsPerPage = 25
var nextCounter = 0

exports.search = function(string, callback) {
  google(string, function (err, res){
    if (err) {
      console.error(err)
    }
    for (var i = 0; i < 5; ++i) {
      var link = res.links[i];
      // console.log(link.title +'\n' + link.href)
      callback({
        title: link.title,
        href: link.href
      });
      // console.log(link.description + "\n")
    }
  })
}
