
import { U } from "../utilities/utils.js";
import Reciepe from "../classes/Reciepe.js";
import ReciepesDatas from "../model/Recipes.js";


const GLOBAL_INPUT = U.get('#global-search');
const ADVANCED_INPUT = U.get('#global-search');

const initSearch = () => {
    console.time("reciep loop");
    let datas = ReciepesDatas.getAll();
    U.empty('#recipe-list');
    U.hide('#noReciepes');

    for (let i = 0; i < datas.length; i++) {
        let reciepe = new Reciepe(datas[i].id, datas[i].name, datas[i].servings, datas[i].ingredients, datas[i].time, datas[i].description, datas[i].appliance, datas[i].ustensils);
        displayReciepe(reciepe);
    }
    console.timeEnd("reciep loop");
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

export { initSearch }