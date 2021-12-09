import modelData from "../db/RecipesDatas.js";
export default class Recipe {
	static initPage() {
		return modelData.findAll();
	}
	static getAllTags() {
		return {
			ingredient: modelData.findAllIngredients(),
			appliance: modelData.findAllAppliances(),
			ustensil: modelData.findAllUstensils(),
		};
	}

	static globalSearching(search) {
		if (!search || search.length < 3) return [];
		search = search.toLowerCase();
		let result = {
			byName: [],
			byIngredients: [],
			byDescription: [],
		};
		let words = search.split(" ");
		let recipes = modelData.findAll();
		let nb = 0;
		recipes.forEach((recipe) => {
			nb++;
			const name = recipe.name.toLowerCase();
			const description = recipe.description.toLowerCase();
			const ingredients = recipe.ingredients;

			// Start searching for each words of research
			let nbWordFindInName = 0;
			let nbWordFindInIngredients = 0;
			let nbWordFindInDescription = 0;

			let inName = true;
			let inIngredients = true;
			let lastWord = words[words.length - 1]
			words.forEach((word) => {
				if (inName && name.indexOf(word) > -1) {
					nbWordFindInName++;
					if (nbWordFindInName === words.length) {
						recipe.pushed = true;
						result.byName.push(recipe);
						return
					}
				} else {
					inName = false;
				}

				if (!recipe.pushed && inIngredients && !!ingredients && ingredients.length > 0) {
					ingredients.forEach(ingredient => {
						const ingredientName = ingredient.ingredient;
						if (ingredientName.indexOf(word) > -1) {
							nbWordFindInIngredients++;
							return
						}
					});
					if (nbWordFindInIngredients === 0) inIngredients = false;
					if (word === lastWord && nbWordFindInIngredients === words.length) {
						result.byIngredients.push(recipe);
						recipe.pushed = true;
					}
				}

			});
			if (!recipe.pushed && description.indexOf(search) > -1) {
				nbWordFindInDescription++;
				let occurences = 0;
				occurences = description.split(search).length - 1;
				recipe.occurences = occurences;
				result.byDescription.push(recipe);
			}
		});
		if (result.byDescription.length > 0) {
			result.byDescription.sort((a, b) => {
				let occA = a.occurences,
					occB = b.occurences;
				if (occA < occB) return 1;
				if (occA > occB) return -1;
				return 0;
			});
		}
		if (result.byName.length === 0 && result.byDescription.length === 0 && result.byIngredients.length === 0) result = null;
		return result;
	}
}
