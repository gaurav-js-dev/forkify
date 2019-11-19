import axios from "axios";
import { key } from "../config";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`);
            console.log(res);
            this.title = res.data.title;
            this.author = res.data.sourceName;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.ingredients = res.data.extendedIngredients;
        } catch (error) {
            console.log(error);
            alert("Something went wrong :((");
        }
    }

    // To,e is not provided by the API we are using our own logic for it
    calcTime() {
        // Assuming that we need 15 min for each ingredients 
        const num = this.ingredients.length;
        const periods = Math.ceil(num / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }


    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        // Ingredients
        this.ingredients.forEach(ing => {
            ing.amount *= (newServings / this.servings);
        });

        this.servings = newServings;
        
    }
}