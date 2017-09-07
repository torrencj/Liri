var google = require('google');

google.protocol = 'https' // searches using https...
google.resultsPerPage = 25
var nextCounter = 0

exports.search = function(string, callback) {
  google(string, function (err, res){
    if (err) {
      console.error(err)
    }
    var links = [];
    for (var i = 0; i < 5; ++i) {
      // console.log(link.title +'\n' + link.href)
      var link = {
        title: res.links[i].title,
        href: res.links[i].href,
        desc: res.links[i].description
      }
      links.push(link);
    }
    callback(links)
  })
}
