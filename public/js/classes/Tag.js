export default class Tag {
	constructor(name, type) {
		this.name = name.toLowerCase();
		this.type = type;
	}

	createTagSelected() {
		this.getNameForDisplay();
		let content = `<span class="tag tag--${this.type} tagSelected" data-name="${this.name}" data-type="${this.type}">${this.name}<i class="far fa-times-circle filter-tag" data-name="${this.name}"  data-type="${this.type}"></i></span>`;
		let result = stringToHTML(content);
		return result;

		function stringToHTML(str) {
			let parser = new DOMParser();
			let html = parser.parseFromString(str, "text/html");
			return html.body.firstChild;
		}
	}

	createTagList() {
		let content = `<li><a class="dropdown-item" href="#" value="${this.name}" data-type="${this.type}">${this.getNameForDisplay()}</a></li>`;
		let result = stringToHTML(content);
		return result;
	}
	
	getNameForDisplay() {
		let splitedName = this.name.split(" ");
		if (splitedName.length >= 5) {
			splitedName[2] += "<br/>";
			return splitedName.join(" ");
		} else {
			return this.name;
		}
	}
}
const stringToHTML = (str) => {
	let parser = new DOMParser();
	let html = parser.parseFromString(str, "text/html");
	return html.body.firstChild;
};
