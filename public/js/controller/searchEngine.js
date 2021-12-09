export { initSearch };

import { U } from "../utilities/utils.js";
import Recipe from "../classes/Recipe.js";
import Tag from "../classes/Tag.js";
import Recipes from "../model/Recipes.js";

let FIRST_INIT = true;
let ALLTAGS = [];
let TAGS_SELECTED = [];
let RECIPES_HISTORY = [];
let RECIPES_DISPLAYED = [];

const initSearch = () => {
	let datas = Recipes.initPage();
	U.empty("#recipe-list");
	RECIPES_DISPLAYED = [];
	U.hide("#noRecipe");
	U.get("#global-search").addEventListener("input", globalSearch);
	RECIPES_HISTORY = [];
	for (let i = 0; i < 50; i++) {
		let recipe = new Recipe(datas[i].id, datas[i].name, datas[i].servings, datas[i].ingredients, datas[i].time, datas[i].description, datas[i].appliance, datas[i].ustensils);
		displayRecipe(recipe);
		RECIPES_HISTORY.push(recipe);
	}
	if (FIRST_INIT) {
		FIRST_INIT = false;
		initTags();
	} else if (TAGS_SELECTED.length > 0) {
		updateRecipeListWithTag();
		updateTags();
	} else {
		updateRecipeListWithTag();
	}
};

// ******************
// *    Search
// ******************

const globalSearch = () => {
	let search = U.get("#global-search").value;
	search = search.toLowerCase().trim();
	console.log('\nStart research recipes contains "' + search + '"');
	console.time("Search duration");
	if (search.length < 3) {
		if (!search) {
			initSearch();
			return false;
		}
		return false;
	}
	let recipesFind = Recipes.globalSearching(search);
	RECIPES_DISPLAYED = [];
	U.empty("#recipe-list");
	let nbRecipe = 0;
	RECIPES_HISTORY = [];
	if (!!recipesFind) {
		if (recipesFind.byName.length > 0) {
			for (let i = 0; i < recipesFind.byName.length; i++) {
				let recipeData = recipesFind.byName[i];
				let recipe = new Recipe(recipeData.id, recipeData.name, recipeData.servings, recipeData.ingredients, recipeData.time, recipeData.description, recipeData.appliance, recipeData.ustensils);
				displayRecipe(recipe);
				nbRecipe++;
				RECIPES_HISTORY.push(recipe);
			}
		}
		if (recipesFind.byIngredients.length > 0) {
			for (let i = 0; i < recipesFind.byIngredients.length; i++) {
				let recipeData = recipesFind.byIngredients[i];
				let recipe = new Recipe(recipeData.id, recipeData.name, recipeData.servings, recipeData.ingredients, recipeData.time, recipeData.description, recipeData.appliance, recipeData.ustensils);
				displayRecipe(recipe);
				nbRecipe++;
				RECIPES_HISTORY.push(recipe);
			}
		}
		if (recipesFind.byDescription.length > 0) {
			for (let i = 0; i < recipesFind.byDescription.length; i++) {
				let recipeData = recipesFind.byDescription[i];
				let recipe = new Recipe(recipeData.id, recipeData.name, recipeData.servings, recipeData.ingredients, recipeData.time, recipeData.description, recipeData.appliance, recipeData.ustensils);
				displayRecipe(recipe);
				nbRecipe++;
				RECIPES_HISTORY.push(recipe);
			}
		}
		if (nbRecipe === 0) {
			displayNoRecipeMessage(true);
			updateTags();
		} else {
			updateRecipeListWithTag();
		}
	} else {
		displayNoRecipeMessage(true);
	}

	console.timeEnd("Search duration");
	console.log(RECIPES_HISTORY.length, " recipes found");
};

const searchInTags = (valueSearch, tagType) => {
	if (!valueSearch || valueSearch.length <= 0) {
		updateTags();
		return false;
	}
	U.empty("#" + tagType + " .dropdownList");
	if (!!ALLTAGS[tagType] && ALLTAGS[tagType].length > 0) {
		for (let i = 0; i < ALLTAGS[tagType].length; i++) {
			let tag = ALLTAGS[tagType][i];
			if (tag.type != tagType) continue;

			let nbOccurences = 0;
			for (let s = 0; s < valueSearch.split(" ").length; s++) {
				const wordSearch = valueSearch.split(" ")[s];
				let splitedTagName = tag.name.split(" ");
				for (let j = 0; j < splitedTagName.length; j++) {
					const wordName = splitedTagName[j];
					if (wordSearch.length >= 1 && wordSearch.length < 3) {
						if (wordName.slice(0, wordSearch.length) === wordSearch) {
							nbOccurences++;
							continue;
						} else {
							continue;
						}
					} else if (wordSearch.length >= 3) {
						if (wordName.indexOf(wordSearch) > -1) {
							nbOccurences++;
							continue;
						} else {
							continue;
						}
					}
				}
				if (nbOccurences === valueSearch.split(" ").length) displayTag(tag);
			}
		}
	}
};

// ******************
// *    Recipes
// ******************

const displayRecipe = (recipe) => {
	if (recipe instanceof Recipe) {
		if (U.get('.card[data-id="' + recipe.id + '"]')) {
			return false;
		}

		U.get("#recipe-list").append(recipe.createCard());
		RECIPES_DISPLAYED.push(recipe);
		displayNoRecipeMessage(false);

		let domRecipe = U.get('.card[data-id="' + recipe.id + '"]');
		if (!!domRecipe) {
			domRecipe.addEventListener("click", (e) => {
				logRecipeDescription(recipe.id);
			});
		}
	}
};

const updateRecipeListWithTag = () => {
	if (!!RECIPES_HISTORY && RECIPES_HISTORY.length > 0) {
		U.empty("#recipe-list");
		let recipesFind = [];
		if (!!TAGS_SELECTED && TAGS_SELECTED.length > 0) {
			for (let i = 0; i < RECIPES_HISTORY.length; i++) {
				const recipe = RECIPES_HISTORY[i];
				if (!recipe) break;
				let nbTagFound = 0;

				for (let t = 0; t < TAGS_SELECTED.length; t++) {
					const tag = TAGS_SELECTED[t];

					if (tag.type == "ingredient") {
						if (!!recipe.ingredients && recipe.ingredients.length > 0) {
							for (let j = 0; j < recipe.ingredients.length; j++) {
								const ingredient = recipe.ingredients[j].ingredient.toLowerCase();
								if (ingredient.indexOf(tag.name) > -1) {
									nbTagFound++;
									break;
								}
							}
						}
						continue;
					} else if (tag.type == "ustensil") {
						if (!!recipe.ustensils && recipe.ustensils.length > 0) {
							for (let j = 0; j < recipe.ustensils.length; j++) {
								const ustensil = recipe.ustensils[j].toLowerCase();
								if (ustensil === tag.name) {
									nbTagFound++;
									break;
								}
							}
						}
						continue;
					} else if (tag.type == "appliance") {
						if (recipe.appliance.toLowerCase() === tag.name) {
							nbTagFound++;
						}
						continue;
					} else {
						break;
					}
				}
				if (nbTagFound === TAGS_SELECTED.length) {
					recipesFind.push(recipe);
				}
			}
		} else {
			if (!U.get("#global-search").value) {
				initTags();
			}
			if (!!RECIPES_HISTORY && RECIPES_HISTORY.length > 0) {
				recipesFind = RECIPES_HISTORY;
			}
		}

		if (recipesFind.length > 0) {
			RECIPES_DISPLAYED = [];
			for (let i = 0; i < recipesFind.length; i++) {
				displayRecipe(recipesFind[i]);
			}
			updateTags();
		} else {
			displayNoRecipeMessage(true);
		}
	} else {
		displayNoRecipeMessage(true);
	}
};

const logRecipeDescription = (id) => {
	id = parseInt(id);
	if (!isNaN(id)) {
		let recipe = findRecipeById(id);
		if (!!recipe) {
			console.log(recipe);
		}
	}
};

const findRecipeById = (id) => {
	if (!id || RECIPES_DISPLAYED.length <= 0) return false;
	for (let i = 0; i < RECIPES_DISPLAYED.length; i++) {
		if (RECIPES_DISPLAYED[i].id === id) return RECIPES_DISPLAYED[i];
	}
	return false;
};

// ******************
// *    TAGS
// ******************

const initTags = () => {
	ALLTAGS = Recipes.getAllTags();
	updateTags();
	initTagInputEvent();
};

const resetTags = () => {
	let tagListes = U.get(".tags-selectable");
	for (let i = 0; i < tagListes.length; i++) {
		let list = tagListes[i];
		list.innerHTML = "";
	}
};

const updateTags = () => {
	resetTags();
	if (!!RECIPES_DISPLAYED && RECIPES_DISPLAYED.length > 0) {
		let presentIngredients = [];
		let presentAppliances = [];
		let presentUstensils = [];
		for (let i = 0; i < RECIPES_DISPLAYED.length; i++) {
			const recipe = RECIPES_DISPLAYED[i];
			if (!!recipe.appliance && presentAppliances.indexOf(recipe.appliance.toLowerCase()) === -1) {
				if (!isTagSelected(recipe.appliance, "appliance")) {
					presentAppliances.push(recipe.appliance.toLowerCase());
					displayTag(findTagByName(recipe.appliance.toLowerCase(), "appliance"));
				}
			}

			if (!!recipe.ingredients && recipe.ingredients.length > 0) {
				for (let j = 0; j < recipe.ingredients.length; j++) {
					const ingredientName = recipe.ingredients[j].ingredient.toLowerCase();
					if (presentIngredients.indexOf(ingredientName) === -1) {
						if (!isTagSelected(ingredientName, "ingredient")) {
							presentIngredients.push(ingredientName);
							displayTag(findTagByName(ingredientName, "ingredient"));
						}
					}
				}
			}
			if (!!recipe.ustensils && recipe.ustensils.length > 0) {
				for (let j = 0; j < recipe.ustensils.length; j++) {
					const ustensilName = recipe.ustensils[j].toLowerCase();
					if (presentUstensils.indexOf(ustensilName) === -1) {
						if (!isTagSelected(ustensilName, "ustensil")) {
							presentUstensils.push(ustensilName);
							displayTag(findTagByName(ustensilName, "ustensil"));
						}
					}
				}
			}
		}
		let tagListes = U.get(".tags-selectable");
		for (let i = 0; i < tagListes.length; i++) {
			if (!tagListes[i].innerHTML) {
				tagListes[i].innerHTML = `<li><a class="text-danger text-bold">Aucun element a aficher !</a></li>`;
			}
		}
	}
};

const isTagSelected = (tagName, tagType) => {
	tagName = tagName.toLowerCase();
	return !!U.get('.tagSelected[data-name="' + tagName + '"][data-type="' + tagType + '"]');
};

const displayTag = (tag) => {
	tag = new Tag(tag.name, tag.type);
	U.get("#" + tag.type + " .tags-selectable").append(tag.createTagList());
	let tagInDom = U.get('[value="' + tag.name + '"][data-type="' + tag.type + '"]');
	if (!tagInDom) {
	}
	tagInDom.addEventListener("click", () => {
		filterWithTag(tag.name, tag.type);
	});
};

const filterWithTag = (tagName, type) => {
	let tagSelected = U.get('.dropdownList li > a[value="' + tagName + '"][data-type="' + type + '"]');
	if (!tagSelected) return false;
	let tag = findTagByName(tagName, type);
	if (!tag) return false;
	tagSelected.parentElement.remove();
	U.get(".searchByElements .tags").append(tag.createTagSelected());
	let tagFilter = U.get('.filter-tag[data-name="' + tag.name + '"][data-type="' + tag.type + '"]');
	tagFilter.addEventListener("click", () => {
		removeFilterTag(tagName, type);
	});
	TAGS_SELECTED.push(tag);
	updateRecipeListWithTag();
};

const removeFilterTag = (tagName, type) => {
	if (!tagName) return false;
	let tagFilter = U.get('.filter-tag[data-name="' + tagName + '"][data-type="' + type + '"]');
	if (!tagFilter) return false;
	let tag = findTagByName(tagName, type);
	if (!tag) return false;
	tagFilter.parentElement.remove();
	TAGS_SELECTED.splice(TAGS_SELECTED.indexOf(tag), 1);
	updateRecipeListWithTag();
};

const findTagByName = (name, type) => {
	if (!name || ALLTAGS[type].length <= 0) return false;
	for (let i = 0; i < ALLTAGS[type].length; i++) {
		if (ALLTAGS[type][i].name === name && ALLTAGS[type][i].type === type) return new Tag(name, type);
	}
	return false;
};

const initTagInputEvent = () => {
	let inputs = U.get(".input-tag");
	for (let i = 0; i < inputs.length; i++) {
		let tagInput = inputs[i];
		tagInput.addEventListener("input", (e) => {
			let tagType = e.target.dataset.type;
			let valueSearch = e.target.value.toLowerCase().trim();
			searchInTags(valueSearch, tagType);
		});
	}
};

// ******************
// *  UTILITIES
// ******************

const displayNoRecipeMessage = (display = true) => {
	if (display) {
		U.show("#noRecipe");
	} else {
		U.hide("#noRecipe");
	}
};
