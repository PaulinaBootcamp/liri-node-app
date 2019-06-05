require("dotenv").config();

var Spotify = require("node-spotify-api");
var request = require("request");
var moment = require("moment");
var axios = require("axios");
var fs = require("fs");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var divider = "\n----------------------------------\n"


// SPOTIFY-THIS-SONG
// The song's name
// A preview link of the song from Spotify
// The album that the song is from

function getSpotify(song) {
  if (song === undefined) {
    song = "Johnny, Kick A Hole In The Sky"
  };
  spotify.search({
    type: "track",
    query: song
  },
    function (err, data) {
      if (err) {
        console.log("Error " + err)
        return
      }
      var queryData = data.tracks.items;
      for (var i = 0; i < queryData.length; i++) {
        // console.log(queryData[i]);
        console.log("Song tite: " + queryData[i].name);
        console.log("Spotify link: " + queryData[i].external_urls.spotify);
        console.log("Artist: " + queryData[i].artists[0].name);
        console.log("Album: " + queryData[i].album.name);
        console.log("Album released: " + moment(queryData[i].album.release_date).format('MMM DD, YYYY'));
        console.log(divider);
        // console.log(queryData);
      }
    }
  )
};


// CONCERT-THIS 
// Name of the venue
// Venue location
// Date of the Event (use moment to format this as "MM/DD/YYYY")


function getBand(band) {
  var URL = "https://rest.bandsintown.com/artists/" + band + "/events?app_id=codingbootcamp";

  request(URL, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body);

      //this makes the object look B_E_A_utiful!
      var JSONData = JSON.parse(body);
      // console.log("Platt");
      for (var i = 0; i < JSONData.length; i++) {
        console.log("Concert Venue: " + JSONData[i].venue.name);
        console.log("Location: " + JSONData[i].venue.city);
        console.log("Date: " + moment(JSONData[i].datetime).format('MMM DD, YYYY'));
        console.log(divider);
      }
    }
  })


};


// MOVIE-THIS
// * Title of the movie.
// * Year the movie came out.
// * IMDB Rating of the movie.
// * Rotten Tomatoes Rating of the movie.
// * Country where the movie was produced.
// * Language of the movie.
// * Plot of the movie.
// * Actors in the movie.


function getMovie(movie) {

  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

  request(URL, function (error, response, body) {

    if (!movie) {
      return console.log('Movie not found!');
    }

    console.log(queryUrl);


    axios.get(queryUrl).then(
      function (response) {
        console.log("Title : " + response.data.Title);
        console.log("Release Year: " + response.data.Year);
        console.log("IMDB Rating: " + response.data.imdbRating);
        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[0].Value);
        console.log("Country: " + response.data.Country);
        console.log("Plot summary: " + response.data.Plot);
        console.log("Cast: " + response.data.Actors);
        console.log(divider);
      }
    );


  })
};


function doWhatItSays() {
  //read the file random.txt
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(error);
    }
    //catch data and split to separate objects in new array
    var dataArr = data.split(",");

    //take objects from random.txt to pass in as parameters
    txtFile = dataArr[0];
    song = dataArr[1];
    switchCase(txtFile, song);
  });
};


function switchCase(command, functionData) {
  switch (command) {
    case "concert-this":
      getBand(functionData);
      break;

    case "spotify-this-song":
      getSpotify(functionData);
      break;

    case "movie-this":
      getMovie(functionData);
      break;

    case "do-what-it-says":
      doWhatItSays(functionData);
      break;

    default: console.log("Unknown command!");
  }
}

function startIt(ArgOne, ArgTwo) {
  switchCase(ArgOne, ArgTwo)
}

startIt(process.argv[2], process.argv.slice(3).join(" "));

