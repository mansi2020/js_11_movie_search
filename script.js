let searchText = document.getElementById("searchText");
let button = document.querySelector("button");
let moviesDiv = document.querySelector("#movies");
let defaultMovieDiv = document.querySelector("#movies p");
let apiKey = "e80c71d6";
let loader = document.querySelector(".one");
let moviesPara = document.querySelector("#moviesPara");
let pagination = document.querySelector("#pagination");
loader.style.display = "none";
moviesPara.style.display = "block";

// todo  display movies on screen
function displayMovies(data, page) {
  //   console.log(data.Search);
  loader.style.display = "none";
  console.log(data);
  data.Search.forEach((el) => {
    let movieCard = document.createElement("div");
    movieCard.classList.add("movieCard");
    movieCard.innerHTML = `
        <img src="${el.Poster}" alt="${el.Title}" class="cardImg">
        <h1 class="cardHead">${el.Title}</h1>
        <p class="cardType"><span>Type :</span> ${el.Type}</p>
        <p class="cardYear"><span>Year : </span>${el.Year}</p>
        `;
    document.getElementById("movies").appendChild(movieCard);
  });

  //display button
  let totalResult = parseInt(data.totalResults);
  let noOfPage = Math.floor(totalResult / 10 + 1);
  console.log(totalResult);
  console.log(noOfPage);
  pagination.innerHTML = `
      <button id="Previous">Previous</button>
      <span id="page">Page ${page} of ${noOfPage}</span>
      <button id="Next">Next</button>
    `;
  console.log(page);
  let previousBtn = document.querySelector("#Previous");
  let pageBtn = document.querySelector("#page");
  let nextBtn = document.querySelector("#Next");
  paginationWHenClick(previousBtn, pageBtn, nextBtn, noOfPage);
}

//todo for pagination click on button give us more data of movies
function paginationWHenClick(previousBtn, pageBtn, nextBtn, noOfPage) {
  previousBtn.addEventListener("click", () => {
    page = 1 <= page-- <= noOfPage ? page-- : page;
    // nextBtn.disabled = true;
    // if(page==1){
    //     previousBtn.disabled = false;
    // }
    console.log(page);
    pageBtn.innerHTML = "";
    pageBtn.innerHTML = `Page ${page} of ${noOfPage}`;
    moviesDiv.innerHTML = "";
    fetchTheData(page);
  });
  nextBtn.addEventListener("click", () => {
    page = 1 <= page++ <= noOfPage ? page++ : page;
    // previousBtn.disabled = true;
    // if(page == noOfPage){
    //     nextBtn.disabled = false;
    // }
    console.log(page);
    pageBtn.innerHTML = "";
    pageBtn.innerHTML = `Page ${page} of ${noOfPage}`;
    fetchTheData(page);
  });
}

//todo fetch the data from api
async function fetchTheData(page) {
  page = 1;
  let data = null;
  try {
    let searchData = searchText.value;
    console.log(searchData);
    moviesDiv.innerHTML = "";
    data = await fetch(
      `https://www.omdbapi.com/?&apikey=${apiKey}&s=${searchData}&page=${page}`
    );
    data = await data.json();
    // console.log(data.Response);
    if (data.Response == "False") {
      moviesDiv.innerText =
        "Too many results. Please provide a more specific search term.";
      console.log("Mansi");
      return;
    } else {
      displayMovies(data, page);
    }
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

//todo debouncing function
function debounce(fetchTheData, delay) {
  let timeOutId;
  return () => {
    console.log("api called");
    if (timeOutId) {
      loader.style.display = "block";
      moviesPara.style.display = "none";
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      fetchTheData();
    }, delay);
  };
}

//todo calling debouncing function when we search some data on searchbar
let debounceMovies = debounce(fetchTheData, 2000);
searchText.addEventListener("input", debounceMovies);
