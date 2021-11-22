
import { U } from "../utilities/utils.js";
import Reciepe from "../classes/Reciepe.js";
import Tag from "../classes/Tag.js";
import Reciepes from "../model/Recipes.js";


const GLOBAL_INPUT = U.get('#global-search');
const ADVANCED_INPUT = U.get('#global-search');

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


const initTags = () => {
    let allTags = Reciepes.getAllTags();
    console.log('allTags => ', allTags);

    if (allTags.ingredients.length > 0) {
        for (let i = 0; i < 30; i++) {
            let tag = new Tag(allTags.ingredients[i].name, allTags.ingredients[i].type);
            displayTag(tag);
        }
    }
    if (allTags.appliances.length > 0) {
        for (let i = 0; i < allTags.appliances.length; i++) {
            let tag = new Tag(allTags.appliances[i].name, allTags.appliances[i].type);
            displayTag(tag);
        }
    }

    if (allTags.ustensils.length > 0) {
        for (let i = 0; i < 30; i++) {
            let tag = new Tag(allTags.ustensils[i].name, allTags.ustensils[i].type);
            displayTag(tag);
        }
    }


}


const filterWithTag = (tagName) => {
    console.log('tagName => ', tagName);
    // TODO : Add filter with tags !
}





const displayReciepe = (reciep) => {
    if (reciep instanceof Reciepe) U.get('#recipe-list').append(reciep.createCard());
    let reciepInDOM = U.get('.card[data-id="' + reciep.id + '"]');
    reciepInDOM.addEventListener("click", (e) => {
        removeReciepe(reciep.id);
    });
};
const removeReciepe = (id) => {
    id = parseInt(id);
    if (!isNaN(id)) {
        let reciepe = U.get('.card[data-id="' + id + '"]');
        if (!!reciepe) reciepe.remove();
    }
};


const displayTag = (tag) => {
    console.log('tag.type => ', tag.type);
    if (tag instanceof Tag) U.get('#' + tag.type + ' .tags-selectable').append(tag.createTagList());
    let tagInDom = U.get('[value="' + tag.name + '"]');
    console.log('tagIndem => ', tag.name);
    tagInDom.addEventListener("click", (e) => {
        filterWithTag(tag.name);
    });
};
const removeTag = (tag) => {
    id = parseInt(id);
    if (!isNaN(id)) {
        let reciepe = U.get('.card[data-id="' + id + '"]');
        if (!!reciepe) reciepe.remove();
    }
};

export { initSearch }