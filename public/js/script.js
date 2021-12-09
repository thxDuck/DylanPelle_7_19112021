import { U } from "./utilities/utils.js";
import * as Search from "./controller/searchEngine.js";
Search.initSearch();

const TRIGGER_DROPDOWN = U.get(".activeOnClick");
let activeDropdown = null;

for (let i = 0; i < TRIGGER_DROPDOWN.length; i++) {
	const el = TRIGGER_DROPDOWN[i];
	el.addEventListener("click", (e) => {
		if (activeDropdown === el) {
			if (!!e.target.className && e.target.className.indexOf("replyDropBox") > -1) {
				activeDropdown.classList.remove("active");
				activeDropdown = null;
			}
		} else {
			if (!!activeDropdown) {
				activeDropdown = U.get(".active");
				activeDropdown.classList.remove("active");
			}
			el.classList.add("active");
			activeDropdown = el;
		}
	});
}
U.get("#global-search").addEventListener("click", () => {
	if (!!activeDropdown) {
		activeDropdown.classList.remove("active");
		activeDropdown = null;
	}
});
