var searchBtn = document.getElementById("movie-title-search-btn");
var searchResultsDiv = document.getElementById("search-results");
var searchEl = document.getElementById("textarea1");
var searchResultsList = document.getElementById("search-results-list");
var savedMovieList = document.getElementById("sortable");
var searchResultsH3 = document.getElementById("search-results-h3");
var imageDiv = document.getElementById("image-div");
var wikiDiv = document.getElementById("wikipedia");
var textAreaLabel = document.getElementById("textLabel");
var initialImage = document.getElementById("initial-image");
var titleSearchBtn = document.getElementById("title-search-btn-small");
var actorSearchBtn = document.getElementById("actor-search-btn-small");
var genreSearchBtn = document.getElementById("genre-search-btn-small");
var yearSearchBtn = document.getElementById("year-search-btn-small");
var textareaContainer = document.getElementById("textarea-container");
var searchParameterBtns = document.querySelectorAll(".search-parameter-btn");
var modal = document.getElementById("modal1");
var searchFunction;
var searchPerformed = false;

var modalInstance = M.Modal.init(modal);

var TMBDApiKey = "344e887b3fa3f0306933a1df072217b5";
var storedMovies = [];
var imgSrcUrl = "https://image.tmdb.org/t/p/w500";

function searchMovieByGenre() {
  searchPerformed = true;
  initialImage.style.display = "none";
  searchResultsH3.style.display = "block";
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  wikiDiv.innerHTML = "";
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
          info.setAttribute("class", "parameter-info");
          titleInfo.setAttribute("id", "title-info");
          titleInfo.textContent =
            "Top 20 Most Popular " + selectedGenre.name + " Movies";
          info.textContent = "Click the Movie Title to Learn More";
          searchResultsH3.appendChild(titleInfo);
          searchResultsList.appendChild(info);
          // loop through the top 20 movies and create list items for each
          for (var i = 0; i < data.results.length; i++) {
            var movieSearch = document.createElement("li");
            var movieTitle = data.results[i].title;
            movieSearch.setAttribute("class", "search-results-li");
            movieSearch.textContent = movieTitle.toUpperCase();
            searchResultsList.appendChild(movieSearch);
            movieSearch.addEventListener("click", function (event) {
              var movieName = event.target.textContent;
              searchMovieByTitle(movieName);
            });
          }
          searchEl.textContent = "";
        });
    });
}
function searchMovieByYear() {
  searchPerformed = true;
  initialImage.style.display = "none";
  searchResultsH3.style.display = "block";
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  wikiDiv.innerHTML = "";
  var releaseYear = searchEl.value;
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
      var titleInfo = document.createElement("h4");
      var info = document.createElement("h5");
      info.setAttribute("class", "parameter-info");
      titleInfo.setAttribute("id", "title-info");
      titleInfo.textContent =
        "Top 20 Most Popular Movies Released In " + releaseYear;
      info.textContent = "Click the Movie Title to Learn More";
      searchResultsH3.appendChild(titleInfo);
      searchResultsList.appendChild(info);
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
          searchMovieByTitle(movieName);
        });
      }
      searchEl.textContent = "";
    });
}
function searchMovieByActor() {
  searchPerformed = true;
  initialImage.style.display = "none";
  searchResultsH3.style.display = "block";
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  wikiDiv.innerHTML = "";
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
      var actorId = data.results[0].id;
      var profilePath = data.results[0].profile_path;
      if (profilePath) {
        var profileUrl = imgSrcUrl + profilePath;
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
          var info = document.createElement("h5");
          var titleInfo = document.createElement("h4");
          info.setAttribute("class", "parameter-info");
          titleInfo.setAttribute("id", "title-info");
          titleInfo.textContent =
            "Top 20 Most Popular Movies Featuring " + actorName;
          info.textContent = "Click the Movie Title to Learn More";
          searchResultsList.appendChild(info);
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
              searchMovieByTitle(movieName);
            });
          }
        });
    });
}

function searchMovieByTitle(prevMovieName) {
  searchPerformed = true;
  initialImage.style.display = "none";
  searchResultsH3.style.display = "block";
  searchResultsH3.innerHTML = "";
  searchResultsList.innerHTML = "";
  imageDiv.innerHTML = "";
  wikiDiv.innerHTML = "";
  if (prevMovieName instanceof PointerEvent) {
    var movieTitle = searchEl.value;
  } else {
    var movieTitle = prevMovieName;
  }
  // request movie ID (TMBD)
  var TMBDReqMovieId =
    "https://api.themoviedb.org/3/search/movie?api_key=" +
    TMBDApiKey +
    "&query=" +
    movieTitle;

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
          var genreNames = data.genres.map(genre => genre.name).join(', ');
          movieImage.setAttribute("src", movieImageSrc);
          movieImage.setAttribute("id", "movie-poster");
          factsList.setAttribute("id", "facts-list");
          genreLi.setAttribute("id", "genre-list-item");
          genreLi.setAttribute("class", "facts-list-item");
          releaseDateLi.setAttribute("class", "facts-list-item");
          tagLineLi.setAttribute("class", "facts-list-item");
          overView.setAttribute("class", "search-result-p");
          movieSearch.setAttribute("class", "search-result-li");
          movieSearch.setAttribute("id", "movie-title");
          saveBtn.setAttribute("class", "save-btn");
          movieSearch.textContent = movieTitle.toUpperCase();
          searchResultsH3.textContent = "Movie Information: "
          overView.textContent = data.overview;
          saveBtn.innerHTML = "Save to Watchlist";
          genreLi.textContent = "Genre: " + genreNames;
          releaseDateLi.textContent = "Release Date: " + data.release_date;
          if (data.tagline === "") {
            tagLineLi.textContent = "Tagline: NONE";
          } else if (data.tagline) {
            tagLineLi.textContent = "Tagline: " + data.tagline;
          }
          movieSearch.appendChild(saveBtn);
          searchResultsList.append(movieSearch);
          searchResultsList.insertBefore(movieImage, movieSearch.nextSibling);
          searchResultsList.insertBefore(overView, movieImage.nextSibling);
          factsList.appendChild(genreLi);
          factsList.appendChild(releaseDateLi);
          factsList.appendChild(tagLineLi);
          searchResultsList.insertBefore(factsList, overView.nextSibling);

          saveBtn.addEventListener("click", storeMovies);
          searchEl.textContent = "";
        });
    });
  var wikiRequest =
    "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" +
    movieTitle +
    "&utf8=&format=json&origin=*";
  // get wikipedia URL for more info & append to page
  fetch(wikiRequest)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var pageId = data.query.search[0].pageid;
      var wikiURLRequest =
        "https://en.wikipedia.org/w/api.php?action=query&prop=info&inprop=url&pageids=" +
        pageId +
        "&format=json&origin=*";
      fetch(wikiURLRequest)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var page = Object.values(data.query.pages)[0];
          var wikiPageUrl = page.fullurl;
          var wikipediaLi = document.createElement("li");
          var wikipediaLink = document.createElement("a");
          wikipediaLi.setAttribute("id", "wiki-line");
          wikipediaLink.setAttribute("href", wikiPageUrl);
          wikipediaLink.setAttribute("target", "_blank");
          wikipediaLink.setAttribute("id", "wiki-link");
          wikipediaLink.textContent = wikiPageUrl;
          wikipediaLi.textContent = "Click the link for more information: ";
          wikipediaLi.appendChild(wikipediaLink);
          wikiDiv.appendChild(wikipediaLi);
        });
    });
}
function storeMovies() {
  var movieTitleEl = document.getElementById("movie-title");
  var movieTitle = movieTitleEl.textContent.replace("Save to Watchlist", "");
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
    li.setAttribute("data-index", "i");
    Btn.setAttribute("class", "waves-effect waves-light btn delete-btn");
    li.textContent = storedMovie;
    Btn.textContent = "Delete";
    li.appendChild(Btn);
    savedMovieList.appendChild(li);

    li.addEventListener("click", function (event) {
      if (
        event.target.classList.contains("ui-state-default") &&
        !event.target.classList.contains("delete-btn")
      ) {
        var movieName = event.target.textContent;
        movieName = movieName.replace("Delete", "");
        searchMovieByTitle(movieName.trim());
      }
    });
    var deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", function (event) {
      event.stopPropagation();
      var target = event.target;
      var movieName = target.parentNode.textContent;
      movieName = movieName.replace("Delete", "");
      storedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
      var itemIndex = storedMovies.indexOf(movieName);
      if (itemIndex > -1) {
        storedMovies.splice(itemIndex, 1);
        localStorage.setItem("Movies-Saved", JSON.stringify(storedMovies));
      }
      target.parentNode.remove();
    });
  }
}

$( function() {
  $( "#sortable" ).sortable();
} );
// Resets order of saved movies array to match sorted items so the list order is persistent
Sortable.create(savedMovieList, {
  onSort: function(evt) {
    // Get the indexes of the dragged and dropped elements
    var oldIndex = evt.oldIndex;
    var newIndex = evt.newIndex;

    // Update the storedMovies array to reflect the new order of the items
    var movie = storedMovies[oldIndex];
    storedMovies.splice(oldIndex, 1);
    storedMovies.splice(newIndex, 0, movie);

    // Update localStorage with the new order of the items
    localStorage.setItem("Movies-Saved", JSON.stringify(storedMovies));
  }
});

function init() {
  var savedMovies = JSON.parse(localStorage.getItem("Movies-Saved"));
  if (savedMovies !== null) {
    storedMovies = savedMovies;
  }
  renderSavedMovies();
}

function performSearch() {
  searchPerformed = true;
  if (searchEl.value === "") {
    modalInstance.open();
    searchPerformed = false;
    return;
  }
  searchFunction(searchEl.value);
  searchPerformed = false;
}

  for (var i = 0; i < searchParameterBtns.length; i++) {
    var currentBtn = searchParameterBtns[i];
    currentBtn.addEventListener("click", function (event) {
      event.preventDefault();
      textareaContainer.style.display = "block";
      currentBtn.style.backgroundColor = "";
        if (event.target === document.getElementById("title-search-btn-small")) {
          textAreaLabel.textContent = "Searching by Movie Title!";
          searchFunction = searchMovieByTitle;
          searchBtn.removeEventListener("click", performSearch);
          searchBtn.addEventListener("click", performSearch);
        } else if (
          event.target === document.getElementById("actor-search-btn-small")
        ) {
          textAreaLabel.textContent = "Searching by Featured Actor!";
          searchFunction = searchMovieByActor;
          searchBtn.removeEventListener("click", performSearch);
          searchBtn.addEventListener("click", performSearch);
        } else if (
          event.target === document.getElementById("genre-search-btn-small")
        ) {
          textAreaLabel.textContent = "Searching by Genre!";
          searchFunction = searchMovieByGenre;
          searchBtn.removeEventListener("click", performSearch);
          searchBtn.addEventListener("click", performSearch);
        } else if (
          event.target === document.getElementById("year-search-btn-small")
        ) {
          textAreaLabel.textContent = "Searching by Release Year!";
          searchFunction = searchMovieByYear;
          searchBtn.removeEventListener("click", performSearch);
          searchBtn.addEventListener("click", performSearch);
        }
    });
  }

init();
