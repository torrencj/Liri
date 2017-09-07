const OmdbApi = require('omdb-api-pt')

 var apiKey = '40e9cece';
 var baseUrl = 'https://omdbapi.com/';

const omdb = new OmdbApi({
  apiKey, baseUrl
})

exports.search = function(string, callback){
  omdb.bySearch({
    search: string,
    page: 1
  }).then(res => {
    // console.log(res);
    // console.log(res.Response);
    if (res.Response != 'False') {
      callback(res.Search[0]);
    } else {
      callback(false)
    }

  })
    .catch(err => {
    console.error(err)
  });
}
