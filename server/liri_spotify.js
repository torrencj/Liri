var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '1800850255c64778b66d421c5d70bcbb',
  clientSecret : '9083727f709d4abe8b74da02fa7acf03',
});

 spotifyApi.clientCredentialsGrant()
   .then(function(data) {
     spotifyApi.setAccessToken(data.body['access_token']);
   }, function(err) {
         console.log('Something went wrong when retrieving an access token', err);
   });

//  var my_access_token = "BQCs0m8NlT-YTGkOSKA4BCTHWvopPE5IRQUabNzlRMmk51niJufW_kpXZHL8jklOxticAr4xl6SgkJVxcoOJTQ";
//  spotifyApi.setAccessToken(my_access_token);

exports.searchArtist = function(artist, callback) {
  spotifyApi.searchArtists(artist)
    .then(function(data) {
      callback(data.body.artists.items);
    }, function(err) {
      console.error(err);
    });
}

exports.searchTracksByArtist = function(artist, callback) {
  spotifyApi.searchTracks(artist)
    .then(function(data) {
      callback(data.body.tracks.items);
    }, function(err) {
      console.error(err);
    });
}
