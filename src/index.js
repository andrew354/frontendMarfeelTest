import "./style.scss";
import star from "./img/star.png";
import fork from "./img/fork.png";

document.getElementById("btn-search").addEventListener("click", e => {
  e.preventDefault();
  submitForm();
});

const submitForm = () => {
  let inputValue = document.getElementById("input-search").value.trim();
  if (inputValue.length === 0) {
    let error = document.getElementById("errorDiv");
    error.style.display = "block";
    error.innerText = "Field cannot be empty";
    document.getElementById("results").style.display = "none";
  } else {
    requestUserData(inputValue);
  }
};

const startLoading = () => {
  let loader = document.getElementById("loading-container");
  loader.style.display = "block";
  document.getElementById("results").style.display = "none";
};

const stopLoadingDisplayError = errorMessage => {
  let loader = document.getElementById("loading-container");
  loader.style.display = "none";
  let error = document.getElementById("errorDiv");
  error.style.display = "block";
  error.innerText = errorMessage;
};

const showResults = () => {
  let loader = document.getElementById("loading-container");
  loader.style.display = "none";
  let error = document.getElementById("errorDiv");
  error.style.display = "none";
  document.getElementById("results").style.display = "block";
};

//function that fetch the user data json
const requestUserData = async userName => {
  startLoading();
  let response = await fetch("https://api.github.com/users/" + userName);
  if (response.status === 404) {
    stopLoadingDisplayError("Username does not exist");
  } else if (response.status === 200) {
    showResults();
    let userData = await response.json();
    displayUserData(userData);
    if (userData.public_repos) {
      document.getElementById("no-repos-list").style.display = "none";
      document.getElementById("repos-results").style.display = "block";
      requestUserRepos(userName);
    } else {
      document.getElementById("no-repos-list").style.display = "block";
      document.getElementById("repos-results").style.display = "none";
    }
  } else {
    stopLoadingDisplayError("Unknown error occured, please refresh the page");
  }
};

// function that fetch userRepos json
const requestUserRepos = async userName => {
  startLoading();
  let response = await fetch(
    "https://api.github.com/users/" + userName + "/repos"
  );
  if (response.status === 404) {
    stopLoadingDisplayError("Unknown error occured, please refresh the page");
    document.getElementById("results").style.display = "none";
  } else if (response.status === 200) {
    let reposData = await response.json();
    displayUserRepos(reposData);
    showResults();
  } else error.innerText = "Unknown error occured, please reload your page";
};

// display user profile information
const displayUserData = userData => {
  let userImg = document.getElementById("user-image");
  userImg.setAttribute("src", userData.avatar_url);
  document.getElementById("user-name").innerText = userData.name;
  document.getElementById("user-login").innerText = "@" + userData.login;
  document.getElementById("repos-count").innerText =
    "Repositories " + "(" + userData.public_repos + ")";
  document.getElementById("user-bio").innerText = userData.bio;
  document.getElementById("results").style.display = "block";
};

// display repository table
const displayUserRepos = reposData => {
  let result = reposData
    .map(
      repo =>
        ` <div>
            <h4><a href=${repo.html_url} target="_blank">${repo.name}</a></h4>
            <div class="flex">
              <div class="icons">
                <img src=${star} />
                ${repo.stargazers_count}
              </div>  
              <div class="icons">
                <img src=${fork} />
                ${repo.forks_count} 
              </div>
            </div> 
         </div> 
        `
    )
    .join("");
  document.getElementById("repos-list").innerHTML = result;
  document.getElementById("results").style.display = "block";
};
