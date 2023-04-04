// var OMDbApiKey = "dfaa8972";
var searchBtn = document.getElementById("movie-title-search-btn");
var searchResultsDiv = document.getElementById("search-results");
var searchEl = document.getElementById("textarea1");
var searchResultsList = document.getElementById("search-results-list");
var savedMovieList = document.getElementById("sortable");

var TMBDApiKey = "344e887b3fa3f0306933a1df072217b5";
var releaseYear = "2005";
// var actorId = "500";
var genreId = 28;
// var actorName = "Tom Cruise";
var storedMovies = [];
var posterPath = "/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg"

// var OMBdRequestURL = "http://www.omdbapi.com/?apikey="+OMDbApiKey+"&t=inception";
var TMBDReqGenreId = "https://api.themoviedb.org/3/genre/movie/list?api_key="+TMBDApiKey+"&language=en-US"
var TMBDReqMovieByGenre = "https://api.themoviedb.org/3/discover/movie?api_key="+TMBDApiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres="+genreId
var TMBDReqYear = "https://api.themoviedb.org/3/discover/movie?api_key="+TMBDApiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year="+releaseYear;

// var TMBDReqActorId = "https://api.themoviedb.org/3/search/person?api_key="+TMBDApiKey+"&query="+actorName;
// var TMBDReqMovieByActor = "https://api.themoviedb.org/3/discover/movie?api_key="+TMBDApiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=" + actorId;

var TMBDReqActorId = "https://api.themoviedb.org/3/search/person?api_key="+TMBDApiKey+"&query="+actorName;
var TMBDReqMovieByActor = "https://api.themoviedb.org/3/discover/movie?api_key="+TMBDApiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=" + actorId;
var imgSrcUrl = "https://image.tmdb.org/t/p/w500";


// request genre/ID object pairs (TMBD)
fetch(TMBDReqGenreId)
.then(function (response) {
  return response.json();
})
.then(function (data) {
    // console.log("Genre/ID Pairs: ");
    // console.log(data);
    for (var i=0; i<data.genres.length; i++) {
      var indexGenreId = data.genres[i];
      // console.log("Index Genre Id: ");
      // console.log(indexGenreId);
    }
})

// request popular movies by year released (TMBD)
fetch(TMBDReqYear)
.then(function (response) {
  return response.json();
})
.then (function (data) {
  // console.log("Movies by Year: ");
  // console.log(data);
})
 
// request popular movies by genre (TMBD)
fetch(TMBDReqMovieByGenre)
.then(function (response) {
  return response.json();
})
.then (function (data) {
  // console.log("Movies by Genre: ");
  // console.log(data);
})


function searchMovieByActor () {
var actorName = document.getElementById("textarea1").value;

//use the actor name to fetch the actor ID from TMBD
var TMBDReqActorId = "https://api.themoviedb.org/3/search/person?api_key="+TMBDApiKey+"&query="+actorName;

// request Actor Id (TMBD)
fetch(TMBDReqActorId)
.then(function (response) {
  return response.json();
})
.then (function (data) {
  var actorId = data.results[0].id;
  console.log("Actor ID: ");
  console.log(data.results[0].name + " ID: " + data.results[0].id);
})


  console.log(actorId);

  if (typeof myVariable !== 'undefined') {
    // myVariable is defined, you can access its properties
    console.log(myVariable.id);
  }

  console.log("Actor ID: ");
  console.log(data.results[0].name + " ID: " + data.results[0].id);

  // use the actor id to fetch the top 20 movies by the actor from TMBD API
  // var TMBDReqMovieByActor = "https://api.themoviedb.org/3/discover/movie?api_key="+TMBDApiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=" + actorId + "&vote_count.gte=5000";
  var TMBDReqMovieByActor = "https://api.themoviedb.org/3/discover/movie?api_key="+TMBDApiKey+"&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=" + actorId;
  fetch(TMBDReqMovieByActor)
  .then(function (response) {
    return response.json();
  })
  .then (function (data) {
    // console.log("Movies by Actor: ");
    console.log(data);

    // loop through the top 20 movies and create list items for each
    for (var i = 0; i < data.results.length; i++) {
      var movieSearch = document.createElement("li");
      var saveBtn = document.createElement("button");
      var movieTitle = data.results[i].title;
      var movieId = data.results[i].id;
      movieSearch.setAttribute("class", "search-results-li");
      saveBtn.setAttribute("class", "save-btn");
      movieSearch.textContent = movieTitle.toUpperCase();
      saveBtn.innerHTML = "Save to Watchlist";
      movieSearch.appendChild(saveBtn);
      searchResultsList.appendChild(movieSearch);

      //add a click event listener to the save button to store the movie title
      saveBtn.addEventListener("click", function(){
        var storedMoviesUC = movieTitle.toUpperCase();
        storedMovies.push(storedMoviesUC);
        localStorage.setItem("Movies-Saved", JSON.stringify(storedMovies));
        renderSavedMovies();
      });

      var moreInfoBtn = document.createElement("button");
      moreInfoBtn.setAttribute("class", "more-info-btn");
      moreInfoBtn.innerHTML = "More Info";
      movieSearch.appendChild(moreInfoBtn);
      
      moreInfoBtn.addEventListener("click", function() {
        var movieTitle = movieSearch.textContent.toLowerCase();
        searchEl.value = movieTitle;
        searchMovieByTitle(movieTitle);
        console.log(movieTitle);
        console.log(movieId);
        
      });

    }
  })
})
};

function searchMovieByTitle () {
  searchResultsList.innerHTML = "";
  var movieTitle = searchEl.value;
  var TMBDReqMovieId = "https://api.themoviedb.org/3/search/movie?api_key="+TMBDApiKey+"&query="+movieTitle;
  var wikiRequest = "https://en.wikipedia.org/api/rest_v1/page/summary/"+movieTitle;

  fetch(wikiRequest)
  .then(function(response){
    return response.json();
  })

  .then (function (data) {
    var movieImageSrc = data.originalimage.source;
    var movieImage = document.createElement("img");
    movieImage.setAttribute("src", movieImageSrc);
    movieImage.setAttribute("id", "movie-poster");
    searchResultsList.appendChild(movieImage);
    //console.log(data)
    //console.log(data.content_urls.desktop.page)
    var wikipedia = data.content_urls.desktop.page
    var wikipediaLi = document.createElement("li");
    var wikipediaLink = document.createElement("a");
    wikipediaLink.setAttribute("href", wikipedia);
    wikipediaLink.setAttribute("target", "_blank");
    wikipediaLink.textContent=wikipedia;
    wikipediaLi.textContent = "Click below for more information ";
    wikipediaLi.appendChild(wikipediaLink);
    searchResultsList.appendChild(wikipediaLi); 
  }) 

  // request movie ID (TMBD)
  fetch(TMBDReqMovieId)
  .then(function (response) {
    return response.json();
  })
  .then (function (data) {
    // console.log(data);
    // console.log(movieTitle + " ID: ");
    // console.log(data.results[0].id);
    var movieId = data.results[0].id

    console.log(movieId);

    var TMBDReqMovieByTitle = "https://api.themoviedb.org/3/movie/"+movieId+"?api_key="+TMBDApiKey;
    // request movie details by title (TMBD)
    fetch(TMBDReqMovieByTitle)
      .then(function (response) {
        return response.json();
      })
      .then (function (data) {
        console.log(data);
        var posterPath = data.poster_path
        var movieImageSrc = imgSrcUrl + posterPath
        var movieImage = document.createElement("img");
        var movieSearch = document.createElement("li");
        var overView = document.createElement("p");
        var saveBtn = document.createElement("button");
        var factsList = document.createElement("ul");
        var genreLi = document.createElement("li");
        var releaseDateLi = document.createElement("li");
        var tagLineLi = document.createElement("li");
        movieImage.setAttribute("src", movieImageSrc);
        movieImage.setAttribute("id", "movie-poster");
        factsList.setAttribute("id", "facts-list");
        genreLi.setAttribute("class", "facts-list-item");
        releaseDateLi.setAttribute("class", "facts-list-item");
        tagLineLi.setAttribute("class", "facts-list-item");
        overView.setAttribute("class", "search-result-p");
        movieSearch.setAttribute("class", "search-result-li");
        saveBtn.setAttribute("class", "save-btn");
        movieSearch.textContent = movieTitle.toUpperCase();
        overView.textContent = data.overview;
        saveBtn.innerHTML = "Save to Watchlist";
        genreLi.textContent = "Genre: " + data.genres[0].name;
        releaseDateLi.textContent = "Release Date: " + data.release_date;
        tagLineLi.textContent = "Tagline: " + data.tagline;
        movieSearch.appendChild(saveBtn);
        searchResultsList.append(movieSearch);
        searchResultsList.insertBefore(overView, movieSearch.nextSibling);
        factsList.appendChild(genreLi);
        factsList.appendChild(releaseDateLi);
        factsList.appendChild(tagLineLi);
        searchResultsList.appendChild(movieImage);
        searchResultsList.insertBefore(factsList, overView.nextSibling);
        
        saveBtn.addEventListener("click", storeMovies);
      })
  })
}

function storeMovies() {
  var movieTitle = searchEl.value;
  if(movieTitle === "") {
    return;
  }  
  // var savedMovies = storedMovies.map(x => x.toUpperCase())
  //   if (!savedMovies.includes(movieTitle.toUpperCase())) {
      var storedMoviesUC = movieTitle.toUpperCase();
      storedMovies.push(storedMoviesUC);
      localStorage.setItem("Movies-Saved", JSON.stringify(storedMovies));
      renderSavedMovies();
    // }
    movieTitle.innerHTML = "";
}

function renderSavedMovies() {
  savedMovieList.innerHTML = "";
  var savedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
  if (savedMovies !== null) {
    storedMovies = savedMovies;
  }

  for (var i=0; i<storedMovies.length; i++) {
    var storedMovie = storedMovies[i];
    var li = document.createElement("li");
    li.setAttribute("class", "ui-state-default");
    li.textContent = storedMovie;
    savedMovieList.appendChild(li);
  }
}

function init () {
  var savedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
  if (savedMovies !== null) {
    storedMovies = savedMovies;
  }

  renderSavedMovies();
}

init ();

// searchBtn.addEventListener("click", searchMovieByTitle);
searchBtn.addEventListener("click", searchMovieByActor);




