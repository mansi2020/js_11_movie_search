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
let page = 1;

let previousBtn;
let pageBtn;
let nextBtn;
let noOfPage;
// todo  display movies on screen
function displayMovies(data, page) {
  console.log(page);
  loader.style.display = "none";
  // console.log(data);
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

  //pagination html
  let totalResult = parseInt(data.totalResults);
  noOfPage = Math.floor(totalResult / 10 + 1);
  pagination.innerHTML = `
      <button id="Previous">Previous</button>
      <span id="page">Page ${page} of ${noOfPage}</span>
      <button id="Next">Next</button>
    `;
  // console.log(page);
  //btn previous and next
  previousBtn = document.querySelector("#Previous");
  pageBtn = document.querySelector("#page");
  nextBtn = document.querySelector("#Next");
  paginationAfterClick(previousBtn,pageBtn,nextBtn,noOfPage);
}

// console.log(nextBtn);
//todo pagination after click
function paginationAfterClick(previousBtn,pageBtn,nextBtn,noOfPage){
  previousBtn.addEventListener("click", () => {
    // console.log(page);
    page--;
    fetchTheData(page);
  });
  nextBtn.addEventListener("click", () => {
    page++;
    // console.log(page);
    fetchTheData(page);
  });
}

//todo fetch the data from api
async function fetchTheData(page) {
  let data = null;
  try {
    let searchData = searchText.value;
    // console.log(searchData);
    moviesDiv.innerHTML = "";
    data = await fetch(
      `https://www.omdbapi.com/?&apikey=${apiKey}&s=${searchData}&page=${page}`
    );
    data = await data.json();
    displayMovies(data, page);
    if(page == 1){
      previousBtn.disabled = true;
      nextBtn.disabled = false;
    }else if(page == noOfPage){
      nextBtn.disabled = true; 
      previousBtn.disabled = false;
    }
  } catch (err) {
    moviesDiv.innerText = 
      "Too many results. Please provide a more specific search term.";
  }
}

//todo debouncing function
function debounce(fetchTheData, delay) {
  let timeOutId;
  return () => {
    // console.log("api called");
    if (timeOutId) {
      loader.style.display = "block";
      moviesPara.style.display = "none";
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      fetchTheData(page);
    }, delay);
  };
}

//todo calling debouncing function when we search some data on searchbar
let debounceMovies = debounce(fetchTheData, 2000);
searchText.addEventListener("input", debounceMovies);
