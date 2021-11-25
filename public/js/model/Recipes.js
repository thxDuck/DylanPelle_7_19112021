
import modelData from "../db/RecipesDatas.js";
export default class Recipe {

    static initPage() {
        return modelData.findAll()
    }

    static getAllTags() {
        return {
            ingredients: modelData.findAllIngredients(),
            appliances: modelData.findAllAppliances(),
            ustensils: modelData.findAllUstensils(),
        };
    }

    static getAllIngredients() {
        return modelData.findAllIngredients();
    }
    static getAllAppliances() {
        return modelData.findAllAppliances();
    }
    static getAllUstensils() {
        return modelData.findAllUstensils();
    }
    static getByIds(recipeIds) {

    }

    static globalSearching(search) {
        if (!search || search.length < 3) return [];
        let result = {
            byName: [],
            byIngredients: [],
            byDescription: [],
        };
        let words = search.split(" ");
        let recipes = modelData.findAll();

        for (let i = 0; i < recipes.length; i++) {
            let recipe = recipes[i];
            const name = recipe.name.toLowerCase();
            const description = recipe.description.toLowerCase();
            const ingredients = recipe.ingredients
            // Start searching for each words of searching 
            let nbWordFindInName = 0;
            let nbWordFindInDescription = 0;
            let nbWordFindInIngredients = 0;
            for (let w = 0; w < words.length; w++) {
                const word = words[w];

                if (name.indexOf(word) > -1) {
                    nbWordFindInName++;
                    if (nbWordFindInName === words.length) {
                        result.byName.push(recipe);
                        break;
                    }
                }

                if (description.indexOf(word) > -1) {
                    nbWordFindInDescription++;
                    if (nbWordFindInDescription === words.length) {
                        let occurences = 0
                        for (let occ = 0; occ < words.length; occ++) {
                            occurences += description.split(words[occ]).length - 1
                        }
                        recipe.occurences = occurences;
                        result.byDescription.push(recipe);
                        break;
                    }
                }

                if (!!ingredients && ingredients.length > 0) {
                    for (let ing = 0; ing < ingredients.length; ing++) {
                        const ingredient = ingredients[ing].ingredient;
                        if (ingredient.indexOf(word) > -1) {
                            nbWordFindInIngredients++;
                            if (nbWordFindInIngredients === words.length) {
                                console.log('recipe find by ingredient ! => ', recipe.name);
                                result.byIngredients.push(recipe);
                                break;
                            }
                        }

                    }
                } else {
                    continue;
                }

            }
        }

        if (result.byDescription.length > 0) {
            result.byDescription.sort((a, b) => { // SORT BY CREATED DATE
                let occA = a.occurences, occB = b.occurences;
                if (occA < occB) return 1;
                if (occA > occB) return -1;
                return 0;
            });
        }
        if (result.byName.length > 0 && result.byDescription.length > 0 && result.byIngredients.length > 0) result = null;
        return result
    }

}