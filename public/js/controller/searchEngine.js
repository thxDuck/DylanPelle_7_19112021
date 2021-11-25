export { initSearch }

import { U } from "../utilities/utils.js";
import Reciepe from "../classes/Reciepe.js";
import Tag from "../classes/Tag.js";
import Reciepes from "../model/Recipes.js";


const GLOBAL_INPUT = U.get('#global-search');
const ADVANCED_INPUT = U.get('#global-search');
let ALLTAGS = [];
let TAGS_SELECTED = [];
let RECIEPES_DISPLAYED = [];

const initSearch = () => {
    // console.time("reciep loop");
    let datas = Reciepes.initPage();
    U.empty('#recipe-list');
    U.hide('#noReciepes');
    // GLOBAL_INPUT.addEventListener('click', globalSearch)
    for (let i = 0; i < 6; i++) {
        let reciepe = new Reciepe(datas[i].id, datas[i].name, datas[i].servings, datas[i].ingredients, datas[i].time, datas[i].description, datas[i].appliance, datas[i].ustensils);
        displayReciepe(reciepe);
    }
    initTags();
    // console.timeEnd("reciep loop");
}



// ******************
// *    Reciepes
// ******************

const displayReciepe = (reciep) => {
    if (reciep instanceof Reciepe) U.get('#recipe-list').append(reciep.createCard());
    let reciepInDOM = U.get('.card[data-id="' + reciep.id + '"]');
    RECIEPES_DISPLAYED.push(reciep);
    displayNoReciepeMessage(false)
    reciepInDOM.addEventListener("click", (e) => {
        removeReciepe(reciep.id);
    });
};
const removeReciepe = (id) => {
    id = parseInt(id);
    if (!isNaN(id)) {
        let reciepe = U.get('.card[data-id="' + id + '"]');
        if (!!reciepe) {
            reciepe.remove();
            let reciepObject = findReciepById(id);
            RECIEPES_DISPLAYED.splice(RECIEPES_DISPLAYED.indexOf(reciepObject), 1);
            if (RECIEPES_DISPLAYED.length <= 0) displayNoReciepeMessage(true)
        }
    }
};

const findReciepById = (id) => {
    if (!id || RECIEPES_DISPLAYED.length <= 0) return false;
    for (let i = 0; i < RECIEPES_DISPLAYED.length; i++) {
        if (RECIEPES_DISPLAYED[i].id === id) return RECIEPES_DISPLAYED[i];
    }
    return false;
}





// ******************
// *    TAGS
// ******************

const initTags = () => {
    let allTags = Reciepes.getAllTags();
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
}

const displayTag = (tag) => {
    if (tag instanceof Tag) U.get('#' + tag.type + ' .tags-selectable').append(tag.createTagList());
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
        removeFilterTag(tagName, type)
    });
    TAGS_SELECTED.push(tag)
    // TODO : ACTUALIZE RECIEPE LIST !
}

const removeFilterTag = (tagName, type) => {
    if (!tagName) return false;
    let tagFilter = U.get('.filter-tag[data-name="' + tagName + '"][data-type="' + type + '"]');
    if (!tagFilter) return false;
    let tag = findTagByName(tagName, type);
    if (!tag) return false;
    tagFilter.parentElement.remove();

    displayTag(tag);
    TAGS_SELECTED.splice(TAGS_SELECTED.indexOf(tag), 1)
    // TODO : ACTUALIZE RECIEPE LIST !
}

const findTagByName = (name, type) => {
    if (!name || ALLTAGS.length <= 0) return false;
    for (let i = 0; i < ALLTAGS.length; i++) {
        if (ALLTAGS[i].name === name && ALLTAGS[i].type === type) return ALLTAGS[i];
    }
    return false;
}






// ******************
// *  UTILITIES
// ******************

const displayNoReciepeMessage = (display = true) => {
    if (display) U.show('#noReciepes');
    if (!display) U.hide('#noReciepes');
}