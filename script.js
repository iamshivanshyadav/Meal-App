// Get necessary DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const fav = document.getElementById('fav');
const reset = document.getElementById('reset');
const footer = document.getElementById('footer');

// Initialize an empty array to store favorite meals
const favoritesList = [];

// Function to change the position of the footer based on the provided 'position' argument
function changeFooterPosition(position) {
  footer.style.position = position;
}

// Event listener for the search button
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value;

  // Fetch data from the meal database API based on the search query
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals === null) {
        alert('No meals found for this search query.');
      } else {
        // Display search results and change the footer position to static
        displaySearchResults(data.meals);
        changeFooterPosition('static');
      }
    })
    .catch(error => {
      console.error(error);
    });
});

// Function to display meal items on the screen
function displaySearchResults(meals) {
  searchResults.innerHTML = '';

  meals.forEach(meal => {
    // Create HTML elements for each meal and append them to the search results container
    const mealElement = document.createElement('div');
    mealElement.classList.add('meal');

    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    mealImage.alt = meal.strMeal;
    mealElement.appendChild(mealImage);

    const mealName = document.createElement('h2');
    mealName.innerText = meal.strMeal;
    mealElement.appendChild(mealName);

    const mealIngredients = document.createElement('ul');
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        const ingredient = document.createElement('li');
        ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
        mealIngredients.appendChild(ingredient);
      } else {
        // If there are no more ingredients, exit the loop
        break;
      }
    }
    mealElement.appendChild(mealIngredients);

    const mealDescription = document.createElement('p');
    mealDescription.classList.add('description');
    mealDescription.innerText = meal.strInstructions;
    mealElement.appendChild(mealDescription);

    const readMoreButton = document.createElement('button');
    readMoreButton.innerHTML = 'Read More';
    readMoreButton.addEventListener('click', () => {
      // Toggle the 'show' class to show/hide the meal description
      mealDescription.classList.toggle('show');
    });
    mealElement.appendChild(readMoreButton);

    // Create a link to the video of the meal on YouTube
    const videoLink = document.createElement('a');
    videoLink.href = meal.strYoutube;
    videoLink.target = '_blank';
    videoLink.innerText = 'Watch Video';
    videoLink.classList.add('video-link'); // Add the class 'video-link' to the anchor element
    mealElement.appendChild(videoLink);

    // Create a button to add the meal to favorites
    const favoriteButton = document.createElement('button');
    favoriteButton.innerHTML = '<i class="fas fa-heart"></i> Add to Favorites';
    favoriteButton.addEventListener('click', () => {
      addToFavorites(meal);
    });
    mealElement.appendChild(favoriteButton);

    // Append the entire meal element to the search results container
    searchResults.appendChild(mealElement);
  });
}

// Function to add a meal to favorites
function addToFavorites(meal) {
  if (!favoritesList.includes(meal)) {
    favoritesList.push(meal);
    alert(`${meal.strMeal} has been added to your favorites.`);
  } else {
    alert(`${meal.strMeal} is already in your favorites.`);
  }
}

// Event listener for the "Show Favorites" button
fav.addEventListener('click', showFav);

// Function to display all favorite meals in the favorites list
function showFav() {
  searchResults.innerHTML = '';

  if (favoritesList.length === 0) {
    const noFavMessage = document.createElement('p');
    noFavMessage.innerText = 'You have no favorite meals.';
    searchResults.appendChild(noFavMessage);
    changeFooterPosition('fixed');
  } else {
    favoritesList.forEach(meal => {
      // Create HTML elements for each favorite meal and append them to the search results container
      const mealElement = document.createElement('div');
      mealElement.classList.add('meal');

      const mealImage = document.createElement('img');
      mealImage.src = meal.strMealThumb;
      mealImage.alt = meal.strMeal;
      mealElement.appendChild(mealImage);

      const mealName = document.createElement('h2');
      mealName.innerText = meal.strMeal;
      mealElement.appendChild(mealName);

      const mealIngredients = document.createElement('ul');
      for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
          const ingredient = document.createElement('li');
          ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
          mealIngredients.appendChild(ingredient);
        } else {
          // If there are no more ingredients, exit the loop
          break;
        }
      }
      mealElement.appendChild(mealIngredients);

      // Create a button to remove the meal from favorites
      const removeButton = document.createElement('button');
      removeButton.innerHTML = '<i class="fas fa-trash"></i> Remove from Favorites';
      removeButton.addEventListener('click', () => {
        removeFromFavorites(meal);
      });
      mealElement.appendChild(removeButton);

      // Append the entire meal element to the search results container
      searchResults.appendChild(mealElement);
    });
  }
}

// Function to remove a meal from favorites
function removeFromFavorites(meal) {
  const mealIndex = favoritesList.findIndex(fav => fav.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favoritesList.splice(mealIndex, 1);
    showFav();
    alert(`${meal.strMeal} has been removed from your favorites.`);
  }
}

// Event listener for the reset button
reset.addEventListener('click', function() {
  searchResults.innerHTML = '';
  // Change the footer position to fixed when the search results are cleared
  changeFooterPosition('fixed');
});
