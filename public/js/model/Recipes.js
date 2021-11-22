
import modelData from "../db/ReciepesDatas.js";
export default class Reciepes {

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
    static getAllAppliances () {
        return modelData.findAllAppliances();
    }
    static getAllUstensils() {
        return modelData.findAllUstensils();
    }
    static findGlobal() {

    }
    static searchWithIds(reciepeIds) {

    }
    static getAll() {
        return ReciepesDatas;
    }
    static findByTags(type, search) {
        return ReciepesDatas;
    }

}
