var OMDbApiKey = "dfaa8972";
var movieTitle = "Inception";

var OMBdRequestURL = "http://www.omdbapi.com/?apikey="+OMDbApiKey+"&s=&y=1988&type=movie"
var wikiRequestURL = "https://en.wikipedia.org/api/rest_v1/page/summary/"+movieTitle

fetch(OMBdRequestURL)
.then(function (response) {
  return response.json();
})
.then(function (data) {
    console.log(data);
})

 
