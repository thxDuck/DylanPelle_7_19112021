export const U = {
	get: (element) => {
		let elementsFind = document.querySelectorAll(element);
		return elementsFind.length <= 1 ? elementsFind[0] : elementsFind;
	},
	hide: (element) => {
		let HTMLel = U.get(element);
		HTMLel.classList.add("d-none");
	},
	show: (element) => {
		let HTMLel = U.get(element);
		HTMLel.classList.remove("d-none");
	},
	empty: (element) => {
		let HTMLel = U.get(element);
		HTMLel.innerHTML = "";
	},
};
