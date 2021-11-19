
import Reciepe from "../classes/Reciepe.js"
import ReciepesDatas from "../model/Recipes.js"
const initSearch = () => {
    let datas = ReciepesDatas.getAll();
    for (let i = 0; i < datas.length; i++) {
        let reciepe = new Reciepe(datas[i].id, datas[i].name, datas[i].servings, datas[i].ingredients, datas[i].time, datas[i].description, datas[i].appliance, datas[i].ustensils);
        $('#recipe-list').append(reciepe.createCard())
    }


}




export { initSearch }