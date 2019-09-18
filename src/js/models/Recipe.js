import axios from "axios";
import { key } from "../config";

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            //console.log(res);
            this.title = res.data.recipe.title;
            this.img = res.data.recipe.image_url;
            this.author = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
            alert("Something went wrong the app");
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

    parseIngredients() {
        const unitsLong = ["tablespoons", "tablespoon", "ounces", "ounce", "teaspoons", "teaspoon", "cups", "pounds"];
        const unitsShort = ["tbsp", "tbsp", "oz", "oz", "tsp", "tsp", "cup", "pounds"];
        const units = [...unitsShort,"kg","g"];

        const newIngredients = this.ingredients.map(el => {
            //1) All the units should be same 
            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            //2) Remove the brackets
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3) Parse ingredients into count, unit and ingredients 

            const arrIng = ingredient.split(" ");
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
           

            let objIng;
            if (unitIndex > -1) {
                // There is a Unit
                // Example 4 1/2 cups , arrCount is [4,1/2]
                // Example if 4 Cups then arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace("-", "+"));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join("+"));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(" ")

                };
            }
            else if (parseInt(arrIng[0], 10)) {
                // There is no unit but first element is a number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: "",
                    // slice(1) is starting the array from position 1 hence removing the digits
                    ingredient: arrIng.slice(1).join(" ")

                }
            }

            else if (unitIndex === -1) {
                // There is no Unit

                objIng = {
                    count: 1,
                    unit: "",
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        // Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}