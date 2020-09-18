const welcomeAnimation = document.querySelector('.welcome-animation')
const bodyContent = document.querySelector('.body-content')

window.addEventListener('load', () => {
  bodyContent.style.display = "none"
  setTimeout(()=> {
    bodyContent.style.display = "inherit"
    welcomeAnimation.style.display = "none"
  }, 1500)
})

// Nav Bar
const menuToggle = document.querySelector(".menu-toggle input");
const nav = document.querySelector("nav ul");

menuToggle.addEventListener("click", function() {
  nav.classList.toggle("slide")
})

const APIkey= "b08ada5ae5ef57d24c55bf83a32cf17e";

const topRated = document.querySelector('.top-rated');
topRated.addEventListener('click', async function() {
  try {
    const movies = await getTMDbRated();
    startSearching.style.display = "none";
    interface(movies);
  } catch (error) {
    alert(error);
  }
})

const getTMDbRated = function() {
  return fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=" + APIkey)
  .then(response => response.json()) 
  .then(response => response.results)
}

const popular = document.querySelector('.popular');
popular.addEventListener('click', async function() {
  try {
    const movies = await getTMDbPopular();
    startSearching.style.display = "none";
    interface(movies);
  } catch (error) {
    alert(error);
  }
})

const getTMDbPopular = function () {
  return fetch("https://api.themoviedb.org/3/movie/popular?api_key=" + APIkey)
  .then(response => response.json()) 
  .then(response => response.results)
}

const nowPlaying = document.querySelector('.now-playing');
nowPlaying.addEventListener('click', async function() {
  try {
    const movies = await getTMDbNowPlaying();
    startSearching.style.display = "none";
    interface(movies);
  } catch (error) {
    alert(error);
  }
})

const getTMDbNowPlaying = function () {
  return fetch("https://api.themoviedb.org/3/movie/now_playing?api_key=" + APIkey)
  .then(response => response.json()) 
  .then(response => response.results)
}

const upcoming = document.querySelector('.upcoming');
upcoming.addEventListener('click', async function() {
  try {
    const movies = await getTMDbUpcoming();
    startSearching.style.display = "none";
    interface(movies);
  } catch (error) {
    alert(error);
  }
})

const getTMDbUpcoming = function () {
  return fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=" + APIkey)
  .then(response => response.json()) 
  .then(response => response.results)
}

// searching movies
const startSearching = document.querySelector(".start-searching");
const inputSearch = document.querySelector(".input-search");
inputSearch.addEventListener("keypress", async function (e)  {
  if(e.key === 'Enter') {
    try {
      const movies = await getTMDb(inputSearch.value);
      startSearching.style.display = "none";
      interface(movies);
    } catch (err) {
      alert(err);
    }
}
});

const getTMDb = function (inputSearch) {
  return fetch("https://api.themoviedb.org/3/search/movie?api_key="+ APIkey + "&query=" + inputSearch)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    })
    .then((response) => {
      if (response.total_results == 0) {
        alert("Movie " + inputSearch + " not found");
      }
      return response.results
    });
};

function interface(movies) {
  let poster = "";
  movies.forEach((movie) => (poster += showPoster(movie)));

  const moviesContent = document.querySelector(".movies-content");
  moviesContent.innerHTML = poster;
}

function showPoster(movie) {
  return `<div class="poster">
            <img src="${movie.poster_path != null ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : `img/poster-n'available.jpg`}" />
            <p class="title">${movie.title}</p>
            <p class="year">${movie.release_date}</p>
            <button class="movie-detail" data-id="${movie.id}">Show Details</button>
          </div>`;
}

// Showing detail movies
document.addEventListener("click", async function (x) {
  if (x.target.classList.contains("movie-detail")) {
    try {
      // Event Modal
      const modal = document.getElementById("myModal");

      // When the user clicks on the button, open the modal
      modal.style.display = "block";

      const span = document.getElementsByClassName("close")[0];

      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
      });

      // When the user clicks anywhere outside of the modal, close it
      document.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };

      // Event TMDbAPI
      const id = x.target.dataset.id;
      const movies = await getTMDbDetails(id);
      const credits = await getTMDbCredits(id);
      const videos = await getTMDbVideos(id);
      interfaceDetail(movies, credits, videos);
    } catch (e) {
      alert(e);
    }
  }
});

const getTMDbDetails = function (id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + APIkey)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then(m => m);
};

const getTMDbCredits = function (id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "/credits?api_key=" + APIkey)
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(c => c);
}

const getTMDbVideos = function(id) {
  return fetch("https://api.themoviedb.org/3/movie/"+ id +"/videos?api_key=" + APIkey)
  .then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  })
  .then(y => y);
}

function interfaceDetail(m,c,y) {
  const posterDetail = showPosterDetail(m,c,y);
  const modalContent = document.querySelector(".modal-content");
  modalContent.innerHTML = posterDetail;
}

function showPosterDetail(m,c,y) {
  return `<div class="modal-header">
            <h2>${m.original_title}</h2>
            <h4>${m.vote_average}/${m.vote_count}</h4>
          </div>
          <hr />
          <div class="modal-body">
            <div class="poster-detail">
              <img src="${m.poster_path != null ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : `img/poster-n'available.jpg`}" />
            </div>
            <div class="about">
              <p>Runtime : <span class="text-dgreen">${m.runtime != null ? `${m.runtime} minutes`: '-'}</span></p>
              <p>Released : <span class="text-dgreen">${m.release_date != null ? `${m.release_date}`: '-'}</span></p>
              <p>Genre : ${m.genres.map(v => `<span class="text-dgreen">${v.name}` )}</p> 
              <p>Country : <span class="text-dgreen">${m.production_countries.map(v => v.name)}</span></p>
              <p><img src="${m.backdrop_path != null ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : `img/poster-n'available.jpg`}" width="710" height="254" /></p>
            </div>
            <div class="overview">
              <hr />
              Synopsis <br>
              <p><span class="text-dgreen">${m.overview != null ? `${m.overview}`: '-'}</span></p>
              <hr />
            </div>
            <div class="videos">
              Videos
              <span>
              ${y.results.map(v =>
                `<ul>
                  <li>
                    <p class="text-dgreen">${v.name}</p>
                    <iframe src="https://www.youtube.com/embed/${v.key}" frameborder="1"></iframe>
                  </li>
                </ul>`).join('')}
              </span>
            </div>
            <div class="production">
              <hr />
              <div class="production-credits">
                  <p>Production : ${m.production_companies.map(v =>
                    `<ul class="production-value">
                      <li><img src="${v.logo_path != null ? `https://image.tmdb.org/t/p/w92${v.logo_path}` : ''}" />
                        <li>
                          <span class="text-dgreen">${v.name}</span>
                        </li>
                      </li>  
                    </ul>`).join('')}
                  </p>
                  <p>Budget : <span class="text-dgreen">${m.budget != null ? `$${m.budget}`: '-'}</p>
                  <p>Revenue : <span class="text-dgreen">${m.revenue != null ? `$${m.revenue}`: '-'}</p>
                  <p>Website : <span class="text-dgreen">${m.homepage != null ? `<a href="${m.homepage}">${m.homepage}</a>`: '-'}</p>
              </div>
              <div class="movie-credits">
                <span class="cast">Cast (${c.cast.length}) :${c.cast.map(cc =>
                  `<ul class="credits-value">
                    <li>
                      <img src="${cc.profile_path != null ? `https://image.tmdb.org/t/p/original${cc.profile_path}` : `img/poster-n'available.jpg`}" width="45" />
                      <p class="text-dgreen"><em>${cc.character}</em><br>${cc.name}</p>
                    </li>
                  </ul>`).join('')}
                </span>
                <span class="crew">Crew (${c.crew.length}) : ${c.crew.map(cc =>
                  `<ul class="credits-value">
                    <li>
                      <img src="${cc.profile_path != null ? `https://image.tmdb.org/t/p/original${cc.profile_path}` : `img/poster-n'available.jpg`}" width="45" />
                      <p class="text-dgreen"><em>${cc.department}</em><br>${cc.name}</p>
                    </li>
                  </ul>`).join('')}
                </span>
              </div>
            </div>
          </div>`
}