var OMDbApiKey = "dfaa8972";
var TMBDApiKey = "344e887b3fa3f0306933a1df072217b5";
var movieTitle = "Inception";

var OMBdRequestURL = "http://www.omdbapi.com/?apikey="+OMDbApiKey+"&t=inception";
var TMBDRequestURL = "https://api.themoviedb.org/3/person/287/movie_credits?api_key="+TMBDApiKey;
var wikiRequestURL = "https://en.wikipedia.org/api/rest_v1/page/summary/"+movieTitle;

fetch(TMBDRequestURL)
.then(function (response) {
  return response.json();
})
.then(function (data) {
    console.log(data);
})

 
