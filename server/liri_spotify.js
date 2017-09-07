var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '1800850255c64778b66d421c5d70bcbb',
  clientSecret : '9083727f709d4abe8b74da02fa7acf03',
});

// spotifyApi.clientCredentialsGrant()
//   .then(function(data) {
//     // console.log('The access token expires in ' + data.body['expires_in']);
//     // console.log('The access token is ' + data.body['access_token']);
//
//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//   }, function(err) {
//         console.log('Something went wrong when retrieving an access token', err);
//   });

  var my_access_token = "BQCs0m8NlT-YTGkOSKA4BCTHWvopPE5IRQUabNzlRMmk51niJufW_kpXZHL8jklOxticAr4xl6SgkJVxcoOJTQ";
spotifyApi.setAccessToken(my_access_token);

exports.searchArtist = function(artist, callback) {
  spotifyApi.searchArtists(artist)
    .then(function(data) {
      // console.log(data);
      // console.log(data.body.artists.items[0]);
      callback(data.body.artists.items);
    }, function(err) {
      console.error(err);
    });
}

exports.searchTracksByArtist = function(artist, callback) {
  spotifyApi.searchTracks(artist)
    .then(function(data) {
      callback(data.body.tracks.items);
      // console.log(data.body);
    }, function(err) {
      console.error(err);
    });
}
