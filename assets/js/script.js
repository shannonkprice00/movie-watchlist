// var OMDbApiKey = "dfaa8972";
var searchBtn = document.getElementById("movie-title-search-btn");
var searchResultsDiv = document.getElementById("search-results");
var searchEl = document.getElementById("textarea1");
var searchResultsList = document.getElementById("search-results-list");
var savedMovieList = document.getElementById("sortable");
var searchResultsH3 = document.getElementById("search-results-h3");
var imageDiv = document.getElementById("image-div");
var wikiDiv = document.getElementById("wikipedia");
var searchLabel = document.getElementById("textarea-label");

var titleSearchBtn = document.getElementById("title-search-btn-small");
var actorSearchBtn = document.getElementById("actor-search-btn-small");
var genreSearchBtn = document.getElementById("genre-search-btn-small");
var yearSearchBtn = document.getElementById("year-search-btn-small");

var textareaContainer = document.getElementById("textarea-container");

var TMBDApiKey = "344e887b3fa3f0306933a1df072217b5";
var storedMovies = [];

// var OMBdRequestURL = "http://www.omdbapi.com/?apikey="+OMDbApiKey+"&t=inception";
var imgSrcUrl = "https://image.tmdb.org/t/p/w500";

function searchMovieByGenre() {
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  var genreSearched = searchEl.value;
  var TMBDReqGenreId =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=" +
    TMBDApiKey +
    "&language=en-US";
  // request genre/ID object pairs (TMBD)
  fetch(TMBDReqGenreId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var genres = data.genres;
      var selectedGenre = null;
      // search for the iteration that matches the searched genre
      genres.forEach(function (genre) {
        if (genre.name.toLowerCase() === genreSearched.toLowerCase()) {
          selectedGenre = genre;
          return;
        }
      });
      var TMBDReqMovieByGenre =
        "https://api.themoviedb.org/3/discover/movie?api_key=" +
        TMBDApiKey +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=" +
        selectedGenre.id;
      // request top 20 popular movies by genre (TMBD)
      fetch(TMBDReqMovieByGenre)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var titleInfo = document.createElement("h4");
          var info = document.createElement("h5");
          info.setAttribute("id", "genre-info");
          titleInfo.setAttribute("id", "title-info");
          titleInfo.textContent =
            "Top 20 Most Popular " + selectedGenre.name + " Movies";
          info.textContent = "Click the Movie Title to Learn More";
          searchResultsH3.appendChild(titleInfo);
          searchResultsH3.appendChild(info);
          // loop through the top 20 movies and create list items for each
          for (var i = 0; i < data.results.length; i++) {
            var movieSearch = document.createElement("li");
            var movieTitle = data.results[i].title;
            movieSearch.setAttribute("class", "search-results-li");
            movieSearch.textContent = movieTitle.toUpperCase();
            searchResultsList.appendChild(movieSearch);
            movieSearch.addEventListener("click", function (event) {
              var movieName = event.target.textContent;
              console.log(movieName);
              searchMovieByTitle(movieName);
            });
          }
          searchEl.textContent = "";
        });
    });
}
function searchMovieByYear() {
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  var releaseYear = searchEl.value;
  console.log(releaseYear);
  var TMBDReqYear =
    "https://api.themoviedb.org/3/discover/movie?api_key=" +
    TMBDApiKey +
    "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=" +
    releaseYear;
  fetch(TMBDReqYear)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log("Movies by Year: ");
      console.log(data);
      var titleInfo = document.createElement("h4");
      var info = document.createElement("h5");
      info.setAttribute("id", "genre-info");
      titleInfo.setAttribute("id", "title-info");
      titleInfo.textContent =
        "Top 20 Most Popular Movies Released In " + releaseYear;
      info.textContent = "Click the Movie Title to Learn More";
      searchResultsH3.appendChild(titleInfo);
      searchResultsH3.appendChild(info);
      // loop through the top 20 movies and create list items for each
      for (var i = 0; i < data.results.length; i++) {
        var movieSearch = document.createElement("li");
        var movieTitle = data.results[i].title;
        // var movieId = data.results[i].id;
        movieSearch.setAttribute("class", "search-results-li");
        movieSearch.textContent = movieTitle.toUpperCase();
        searchResultsList.appendChild(movieSearch);
        movieSearch.addEventListener("click", function (event) {
          var movieName = event.target.textContent;
          console.log(movieName);
          searchMovieByTitle(movieName);
        });
      }
      searchEl.textContent = "";
    });
}
function searchMovieByActor() {
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  var actorName = document.getElementById("textarea1").value;
  searchEl.textContent = "";
  //use the actor name to fetch the actor ID from TMBD
  var TMBDReqActorId =
    "https://api.themoviedb.org/3/search/person?api_key=" +
    TMBDApiKey +
    "&query=" +
    actorName;
  // request Actor Id (TMBD)
  fetch(TMBDReqActorId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var actorId = data.results[0].id;
      var profilePath = data.results[0].profile_path;
      if (profilePath) {
        var profileUrl = "https://image.tmdb.org/t/p/w500" + profilePath;
      }
      var profileImg = document.createElement("img");
      profileImg.setAttribute("src", profileUrl);
      profileImg.setAttribute("width", "150");
      imageDiv.appendChild(profileImg);

      // use the actor id to fetch the top 20 movies by the actor from TMBD API
      var TMBDReqMovieByActor =
        "https://api.themoviedb.org/3/discover/movie?api_key=" +
        TMBDApiKey +
        "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_cast=" +
        actorId;
      fetch(TMBDReqMovieByActor)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          var info = document.createElement("h5");
          var titleInfo = document.createElement("h4");
          info.setAttribute("id", "actor-info");
          titleInfo.setAttribute("id", "title-info");
          titleInfo.textContent =
            "Top 20 Most Popular Movies Featuring " + actorName;
          info.textContent = "Click the Movie Title to Learn More";
          titleInfo.appendChild(info);
          searchResultsH3.appendChild(titleInfo);
          // loop through the top 20 movies and create list items for each
          for (var i = 0; i < data.results.length; i++) {
            var movieSearch = document.createElement("li");
            var movieTitle = data.results[i].title;
            movieSearch.setAttribute("class", "search-results-li");
            movieSearch.textContent = movieTitle.toUpperCase();
            searchResultsList.appendChild(movieSearch);
            movieSearch.addEventListener("click", function (event) {
              var movieName = event.target.textContent;
              console.log(movieName);
              searchMovieByTitle(movieName);
            });
          }
        });
    });
}


function searchMovieByTitle(prevMovieName) {
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  wikiDiv.innerHTML = "";
  if (prevMovieName instanceof PointerEvent) {
    var movieTitle = searchEl.value
  } else {
    var movieTitle = prevMovieName;
  }
  console.log(prevMovieName);
  console.log(movieTitle);

  
  var wikiRequest =
    "https://en.wikipedia.org/api/rest_v1/page/summary/" + movieTitle.toLowerCase();
  // get wikipedia URL for more info & append to page
  fetch(wikiRequest)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data);
      var wikipedia = data.content_urls.desktop.page;
      var wikipediaLi = document.createElement("li");
      var wikipediaLink = document.createElement("a");
      wikipediaLink.setAttribute("href", wikipedia);
      wikipediaLink.setAttribute("target", "_blank");
      wikipediaLink.textContent = wikipedia;
      wikipediaLi.textContent = "Click the link for more information ";
      wikipediaLi.appendChild(wikipediaLink);
      wikiDiv.appendChild(wikipediaLi);
    });
  // request movie ID (TMBD)
  var TMBDReqMovieId =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    TMBDApiKey +
    "&query=" +
    movieTitle;
  console.log(movieTitle);
  fetch(TMBDReqMovieId)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var movieId = data.results[0].id;
      var TMBDReqMovieByTitle =
        "https://api.themoviedb.org/3/movie/" +
        movieId +
        "?api_key=" +
        TMBDApiKey;
      // request movie details by title (TMBD)
      fetch(TMBDReqMovieByTitle)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var posterPath = data.poster_path;
          var movieImageSrc = imgSrcUrl + posterPath;
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
          movieSearch.setAttribute("id", "movie-title");
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
          imageDiv.appendChild(movieImage);
          searchResultsList.insertBefore(factsList, overView.nextSibling);

          saveBtn.addEventListener("click", storeMovies);
          searchEl.textContent = "";
        });
    });
}
function storeMovies() {
  var movieTitleEl = document.getElementById("movie-title");
  var movieTitle = movieTitleEl.textContent.replace("Save to Watchlist", "");
  console.log(movieTitle);
  if (movieTitle === "") {
    return;
  }
  var savedMovies = storedMovies.map((x) => x.toUpperCase());
  if (!savedMovies.includes(movieTitle.toUpperCase())) {
    var storedMoviesUC = movieTitle.toUpperCase();
    storedMovies.push(storedMoviesUC);
    localStorage.setItem("Movies-Saved", JSON.stringify(storedMovies));
    renderSavedMovies();
  }
  movieTitle.innerHTML = "";
}
function renderSavedMovies() {
  savedMovieList.innerHTML = "";
  var savedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
  if (savedMovies !== null) {
    storedMovies = savedMovies;
  }

  for (var i = 0; i < storedMovies.length; i++) {
    var storedMovie = storedMovies[i];
    var li = document.createElement("li");
    var Btn = document.createElement("a");
    li.setAttribute("class", "ui-state-default");
    Btn.setAttribute("class", "waves-effect waves-light btn");
    Btn.setAttribute("id", "delete-btn");
    li.textContent = storedMovie;
    Btn.textContent = "Delete";
    li.appendChild(Btn);
    savedMovieList.appendChild(li);

    li.addEventListener("click", function (event) {
      if (event.target !== document.querySelector("#delete-btn")) {
        console.log(event.target);
        var movieName = event.target.textContent;
        console.log(movieName);
        movieName = movieName.replace("Delete", "");
        console.log(movieName);
        searchMovieByTitle(movieName);
      } else if (event.target === document.querySelector("#delete-btn")) {
        var target = event.target;
        var movieName = target.parentNode.textContent;
        console.log(movieName);
        movieName = movieName.replace("Delete", "");
        console.log(movieName);
        var storedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
        var itemIndex = storedMovies.indexOf(movieName);
        console.log(movieName);
        if (itemIndex > -1) {
          storedMovies.splice(itemIndex, 1);
          localStorage.setItem("Movies-Saved", JSON.stringify(storedMovies));
        }
        target.parentNode.remove();
      }
    });
  }
}

function init() {
  var savedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
  if (savedMovies !== null) {
    storedMovies = savedMovies;
  }
  renderSavedMovies();
}

// need to debug this code to only add event listener to searchBtn IF something is searched for...
// var searchParameterBtns = document.querySelectorAll(".search-parameter-btn")
// for (var i = 0; i < searchParameterBtns.length; i++) {
//   searchParameterBtns[i].addEventListener("click", function(event) {
//     event.preventDefault();
//     textareaContainer.style.display = "block";
//     if (event.target === document.getElementById("title-search-btn-small")) {
//       searchLabel.textContent = "Search by movie title...";
//       searchBtn.addEventListener("click", searchMovieByTitle);
//     } else if (event.target === document.getElementById("actor-search-btn-small")) {
//       searchLabel.textContent = "Search by featured actor...";
//       searchBtn.addEventListener("click", searchMovieByActor);
//     } else if (event.target === document.getElementById("genre-search-btn-small")) {
//       searchLabel.textContent = "Search by genre...";
//       searchBtn.addEventListener("click", searchMovieByGenre);
//     } else if (event.target === document.getElementById("year-search-btn-small")) {
//       searchLabel.textContent = "Search by release year...";
//       searchBtn.addEventListener("click", searchMovieByYear);
//     }
//   });
// }


init();
