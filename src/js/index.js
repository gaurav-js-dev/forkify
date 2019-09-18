import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import *  as searchView from "./views/searchView";
import *  as recipeView from "./views/recipeView";
import *  as listView from "./views/listView";
import *  as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";

/* Global State of App
  - Search object
  - Current Recipe Object
  - Shopping List Object
  - Liked Recipes
*/
const state = {};

/*SEARCH CONTROLLER

*/
const controlSearch = async () => {
  const query = searchView.getInput();

  if (query) {
    state.search = new Search(query); //2. New Search Object and edit state

    //3. Prepare UI for the results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);
    //4. Search for recipes

    try {
      await state.search.getResults();

      //5. Render results on UI 
      clearLoader();
      searchView.renderResults(state.search.result);
      // 
    } catch (error) {
      alert("Something went wrong with the search. . . . .");
      clearLoader();
    }

  }
}


elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});



elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);

  }
});

/*RECIPE CONTROLLER
*/
// const r = new Recipe (47746);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
  // GET THE ID from the URL

  // we don't want the hash hence using replace
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI FOR changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) {
      searchView.highlightSelected(id);
    }
    // Create new recipe object
    state.recipe = new Recipe(id);
    //testing
    // window.r = state.recipe;

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();
      // calculate servings and time  
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render the recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id));
    } catch (error) {
      console.log(error);
      alert("Error processing Recipe");
    }
  }
}
// window.addEventListener("hashchange",controlRecipe);
// window.addEventListener("load",controlRecipe);
['hashchange', "load"].forEach(event => window.addEventListener(event, controlRecipe));

/*LIST CONTROLLER

*/

const controlList = () => {
  //Create a new list if there is no list yet 
  if (!state.list) state.list = new List();

  //Add Each ingredient to the list and render it to UI
  state.recipe.ingredients.forEach(el => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);

  });
}

// Handle delete and update list item events 

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest(".shopping__item").dataset.itemid

  //Handle the delete button 

  if (e.target.matches(".shopping__delete, .shopping__delete *")) {

    // delete from State
    state.list.deleteItem(id);
    // delete from UI
    listView.deleteItem(id);

    // Handle the count update
  }
  else if (e.target.matches(".shopping__count_value")) {
    const val = parseFloat(e.target.value, 10);

    if (val > 1) {
      state.list.updateCount(id, val);
    }
  }
});

 
/*LIKES CONTROLLER
*/

// testing purpose


const controllerLike = () => {
  if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    // User has not not yet liked current recipe. 
  if (!state.likes.isLiked(currentID)){ 
      // Add like to the state

      const newLike = state.likes.addLike(
        currentID,
        state.recipe.title,
        state.recipe.author,
        state.recipe.img
    );


      // Toggle the like button empty heart when not liked and full heart when liked
      likesView.toggleLikeBtn(true);
      // Add like to the UI list

      likesView.renderLike(newLike);

    // User has not Liked current recipe
  } else{
      // Remove like from the state
      state.likes.deleteLike(currentID);
       
      // Toggle the like button empty heart when not liked and full heart when liked
      likesView.toggleLikeBtn(false);
      // Remove like from the UI list
    
      likesView.deleteLike(currentID);
  }
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore the liked recipes on page load
window.addEventListener("load",()=>{
  state.likes = new Likes(); 

  // restore likes
  state.likes.readStorage();
  
  // toggle the like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());  
  
  // render existing liked recipes

  state.likes.likes.forEach(like =>likesView.renderLike(like));
});

//handling recipe button click
elements.recipe.addEventListener("click", e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    // Decrease button is clicked 
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    // increase button is clicked 
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to the shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like Controller 
    controllerLike();
  }


  //console.log(state.recipe);

});



