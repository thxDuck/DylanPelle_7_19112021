export default class Recipe {
	constructor(id, name, servings, ingredients, time, description, appliance, ustensils) {
		this.id = id;
		this.name = name;
		this.servings = servings;
		this.ingredients = ingredients;
		this.time = time;
		this.description = description;
		this.appliance = appliance;
		this.ustensils = ustensils;
	}

	getUnit(unit = "") {
		if (!unit) return unit;
		switch (unit) {
			case "grammes":
				return "g";
			case "cuillères à soupe":
				return "c. à s";
			case "cuillère à soupe":
				return "c. à s";
			case "cuillères à café":
				return "c. à s";
			case "cuillère à café":
				return "c. à s";
			default:
				return unit;
		}
	}
	getDescritpionPreview() {
		let description = this.description;
		let preview = "";
		if (description.length > 130) {
			preview = description.slice(0, 130);
			let lastWordIndex = preview.lastIndexOf(" ");
			if (preview[lastWordIndex - 1] === ",") lastWordIndex -= 1;
			if (lastWordIndex) {
				preview = preview.slice(0, lastWordIndex) + "...";
			}
		} else {
			preview = description;
		}
		return preview;
	}
	createCard() {
		let ingredientList = "";
		let ingredientDatas = this.ingredients;
		if (ingredientDatas.length > 0) {
			for (let i = 0; i < ingredientDatas.length; i++) {
				let ingredient = ingredientDatas[i].ingredient;
				let quantity = !!ingredientDatas[i].quantity ? ingredientDatas[i].quantity.toString() : "";
				let units = !!ingredientDatas[i].quantity ? this.getUnit(ingredientDatas[i].unit) : "";
				ingredientList += '<li><span class="text-bolder">' + ingredient + ":</span><span>" + quantity + " " + units + "</span></li>";
			}
		}
		let content = `
			<div class="card" data-id="${this.getId()}">
				<img class="card-img-top" src="" alt=" "> 
				<div class="card-body container"> 
					<div class="row card-body__heading"> 
						<h5 class="card-title">${this.name}</h5> 
						<span class="cooktime"><i class="far fa-clock"></i><span class="time">${this.getTime()} min</span> 
					</div> 
					<div class="row card-body__text"> 
						<div class="ingredient-list"> 
							<ul class="card-text"> 
								${ingredientList} 
							</ul> 
						</div> 
						<div class="description"> 
							<p class="card-text">${this.getDescritpionPreview()}</p> 
						</div> 
					</div> 
				</div> 
			</div>`;
		let result = stringToHTML(content);
		return result;
		function stringToHTML(str) {
			let parser = new DOMParser();
			let html = parser.parseFromString(str, "text/html");
			return html.body.firstChild;
		}
	}

	// GETTERS
	getName() {
		return this.name.toString();
	}
	getId() {
		return this.id.toString();
	}
	getTime() {
		return this.time.toString();
	}
	getServings() {
		return this.servings.toString();
	}
}
