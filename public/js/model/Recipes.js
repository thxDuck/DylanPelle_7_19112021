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
		let result = {
			byName: [],
			byIngredients: [],
			byDescription: [],
		};
		let words = search.split(" ");
		let recipes = modelData.findAll();
		let nb = 0;

		for (let i = 0; i < recipes.length; i++) {
			nb++;
			let recipe = recipes[i];
			const name = recipe.name.toLowerCase();
			const description = recipe.description.toLowerCase();
			const ingredients = recipe.ingredients;

			// Start searching for each words of research
			let nbWordFindInName = 0;
			let nbWordFindInIngredients = 0;
			let nbWordFindInDescription = 0;

			let inName = true;
			let inIngredients = true;
			for (let w = 0; w < words.length; w++) {
				const word = words[w];

				if (inName && name.indexOf(word) > -1) {
					nbWordFindInName++;
					if (nbWordFindInName === words.length) {
						result.byName.push(recipe);
						break;
					}
				} else {
					inName = false;
				}

				if (inIngredients && !!ingredients && ingredients.length > 0) {
					for (let ing = 0; ing < ingredients.length; ing++) {
						const ingredient = ingredients[ing].ingredient;
						if (ingredient.indexOf(word) > -1) {
							nbWordFindInIngredients++;
							break;
						}
					}
					if (nbWordFindInIngredients === 0) inIngredients = false;
					if (w === words.length && nbWordFindInIngredients === words.length) {
						result.byIngredients.push(recipe);
					}
				}
			}

			if (!inName && !inIngredients && description.indexOf(search) > -1) {
				nbWordFindInDescription++;
				let occurences = 0;
				occurences = description.split(search).length - 1;
				recipe.occurences = occurences;
				result.byDescription.push(recipe);
			}
		}

		if (result.byDescription.length > 0) {
			result.byDescription.sort((a, b) => {
				let occA = a.occurences,
					occB = b.occurences;
				if (occA < occB) return 1;
				if (occA > occB) return -1;
				return 0;
			});
		}
		if (result.byName.length > 0 && result.byDescription.length > 0 && result.byIngredients.length > 0) result = null;
		return result;
	}
}
