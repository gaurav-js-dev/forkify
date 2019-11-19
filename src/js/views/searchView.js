import { elements } from "./base";
export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = "";
};

export const clearResults = () => {
    elements.searchResList.innerHTML = "";
    elements.searchResPages.innerHTML = "";
}

export const highlightSelected = id => {
    const resultsArr = document.querySelectorAll('.results__link');
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"], .likes__link`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 23) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(" ").reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur); 
            }
            return acc + cur.length;
        }, 0)

        return `${newTitle.join(" ")}...`;
    }

    return title;
}

// Render recipe title on left pane of page in search results

const renderRecipe = recipe => {
    const markUp = `                
    <li>
    <a class="results__link" href="#${recipe.id}">
        <figure class="results__fig">
            <img src="https://spoonacular.com/recipeImages/${recipe.image}" alt="${recipe.title}">
            <p class="results__author">The Pioneer Woman</p>
        </figure> 
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="likes__author">The Pioneer Woman</p>
        </div>
    </a>
   </li>`;
    elements.searchResList.insertAdjacentHTML("beforeend", markUp);
}

// HTML To create button
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page - 1 : page + 1}>
    <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
    </svg>
    
</button>`;


const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;

    if (page === 1 && pages > 1) {
        // Only Button to go the next page
        button = createButton(page, "next")
    } else if (page < pages) {
        button = `
        ${createButton(page, "prev")}
        ${createButton(page, "next")}`;
    }

    else if (page === pages && page > 1) {
        // Only Button to go the previous page
        button = createButton(page, "prev");
    }
    elements.searchResPages.insertAdjacentHTML("afterbegin", button);


};


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page 
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    // why this forEach
    recipes.slice(start, end).forEach(renderRecipe);
    //render pagination button
    renderButtons(page, recipes.length, resPerPage);

};