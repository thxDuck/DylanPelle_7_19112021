export { initSearch };

import { U } from "../utilities/utils.js";
import Recipe from "../classes/Recipe.js";
import Tag from "../classes/Tag.js";
import Recipes from "../model/Recipes.js";

const GLOBAL_INPUT = U.get("#global-search");
const ADVANCED_INPUT = U.get("#global-search");
let ALLTAGS = [];
let TAGS_SELECTED = [];
let RECIPES_DISPLAYED = [];

const initSearch = () => {
	console.time("recipe loop");
	let datas = Recipes.initPage();
	U.empty("#recipe-list");
	U.hide("#noRecipe");
	GLOBAL_INPUT.addEventListener("input", globalSearch);
	for (let i = 0; i < 6; i++) {
		let recipe = new Recipe(datas[i].id, datas[i].name, datas[i].servings, datas[i].ingredients, datas[i].time, datas[i].description, datas[i].appliance, datas[i].ustensils);
		displayRecipe(recipe);
	}
	initTags();
	console.timeEnd("recipe loop");
};

// ******************
// *    Search
// ******************

const globalSearch = () => {
	console.time("Search function !");
	let search = GLOBAL_INPUT.value;
	search = search.toLowerCase().trim();
	if (search.length < 3) return false;
	let recipesFind = Recipes.globalSearching(search);
	U.empty("#recipe-list");
	let nbRecipe = 0;
	if (!!recipesFind) {
		if (recipesFind.byName.length > 0) {
			for (let i = 0; i < recipesFind.byName.length; i++) {
				let recipeData = recipesFind.byName[i];
				let recipe = new Recipe(recipeData.id, recipeData.name, recipeData.servings, recipeData.ingredients, recipeData.time, recipeData.description, recipeData.appliance, recipeData.ustensils);
				displayRecipe(recipe);
				nbRecipe++;
			}
		}
		if (recipesFind.byIngredients.length > 0) {
			for (let i = 0; i < recipesFind.byIngredients.length; i++) {
				let recipeData = recipesFind.byIngredients[i];
				let recipe = new Recipe(recipeData.id, recipeData.name, recipeData.servings, recipeData.ingredients, recipeData.time, recipeData.description, recipeData.appliance, recipeData.ustensils);
				displayRecipe(recipe);
				nbRecipe++;
			}
		}
		if (recipesFind.byDescription.length > 0) {
			for (let i = 0; i < recipesFind.byDescription.length; i++) {
				let recipeData = recipesFind.byDescription[i];
				let recipe = new Recipe(recipeData.id, recipeData.name, recipeData.servings, recipeData.ingredients, recipeData.time, recipeData.description, recipeData.appliance, recipeData.ustensils);
				displayRecipe(recipe);
				nbRecipe++;
			}
		}
	} else {
		displayNoRecipeMessage(true);
	}
	updateTags();

	console.timeEnd("Search function !");
	console.log("nbRecipe => ", nbRecipe);
};

// ******************
// *    Recipes
// ******************

const displayRecipe = (recipe) => {
	if (recipe instanceof Recipe) U.get("#recipe-list").append(recipe.createCard());
	// let domRecipe = U.get('.card[data-id="' + recipe.id + '"]');
	RECIPES_DISPLAYED.push(recipe);
	displayNoRecipeMessage(false);
	// domRecipe.addEventListener("click", (e) => {
	//     logRecipeDesc(recipe.id);
	// });
};

const logRecipeDesc = (id) => {
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
	let allTags = Recipes.getAllTags();
	if (allTags.ingredients.length > 0) {
		for (let i = 0; i < 30; i++) {
			let tag = new Tag(allTags.ingredients[i].name, allTags.ingredients[i].type);
			ALLTAGS.push(tag);
			displayTag(tag);
		}
	}
	if (allTags.appliances.length > 0) {
		for (let i = 0; i < allTags.appliances.length; i++) {
			let tag = new Tag(allTags.appliances[i].name, allTags.appliances[i].type);
			ALLTAGS.push(tag);
			displayTag(tag);
		}
	}
	if (allTags.ustensils.length > 0) {
		let max = allTags.ustensils.length > 30 ? 30 : allTags.ustensils.length - 1;
		for (let i = 0; i < max; i++) {
			let tag = new Tag(allTags.ustensils[i].name, allTags.ustensils[i].type);
			ALLTAGS.push(tag);
			displayTag(tag);
		}
	}
};

const updateTags = () => {};

const displayTag = (tag) => {
	if (tag instanceof Tag) U.get("#" + tag.type + " .tags-selectable").append(tag.createTagList());
	let tagInDom = U.get('[value="' + tag.name + '"][data-type="' + tag.type + '"]');
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
	// TODO : ACTUALIZE RECIPE LIST !
};

const removeFilterTag = (tagName, type) => {
	if (!tagName) return false;
	let tagFilter = U.get('.filter-tag[data-name="' + tagName + '"][data-type="' + type + '"]');
	if (!tagFilter) return false;
	let tag = findTagByName(tagName, type);
	if (!tag) return false;
	tagFilter.parentElement.remove();

	displayTag(tag);
	TAGS_SELECTED.splice(TAGS_SELECTED.indexOf(tag), 1);
	// TODO : ACTUALIZE RECIPE LIST !
};

const findTagByName = (name, type) => {
	if (!name || ALLTAGS.length <= 0) return false;
	for (let i = 0; i < ALLTAGS.length; i++) {
		if (ALLTAGS[i].name === name && ALLTAGS[i].type === type) return ALLTAGS[i];
	}
	return false;
};

// ******************
// *  UTILITIES
// ******************

const displayNoRecipeMessage = (display = true) => {
	if (display) U.show("#noRecipe");
	if (!display) U.hide("#noRecipe");
};
