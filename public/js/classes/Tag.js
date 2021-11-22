export default class Tag {
	constructor(name, type) {
		this.name = name;
		this.type = type;
	}
	
	createTagSelected() {
		let content = `<span class="tag tag--${this.type}">${this.name}<i class="far fa-times-circle"></i></span>`;
		let result = stringToHTML(content)
		return result;

		function stringToHTML(str) {
			let parser = new DOMParser();
			let html = parser.parseFromString(str, 'text/html');
			return html.body.firstChild;
		};
	}


	createTagList() {
		let content = `<li><a class="dropdown-item" href="#" value="${this.name}">${this.name}</a></li>`;
		let result = stringToHTML(content);
		return result;

		function stringToHTML(str) {
			let parser = new DOMParser();
			let html = parser.parseFromString(str, 'text/html');
			return html.body.firstChild;
		};
	}


}