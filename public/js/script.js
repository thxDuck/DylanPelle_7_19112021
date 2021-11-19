const $ = (element) => {
   let elementsFind = document.querySelectorAll(element);
   return elementsFind.length <= 1 ? elementsFind[0] : elementsFind;
}

const GLOBAL_INPUT = $('#global-search');
const ADVANCED_INPUT = $('#global-search');
const TRIGGER_DROPDOWN = $('.activeOnClick');
let activeDropdown = null;
for (let i = 0; i < TRIGGER_DROPDOWN.length; i++) {
   const el = TRIGGER_DROPDOWN[i];
   el.addEventListener("click", (e) => {
      if (activeDropdown === el) {
         if (!!e.target.className && e.target.className.indexOf("replyDropBox") > -1) {
            activeDropdown.classList.remove("active")
            activeDropdown = null;
         }
      } else {
         if (!!activeDropdown) {
            activeDropdown = $('.active');
            activeDropdown.classList.remove("active")
         }
         el.classList.add("active")
         activeDropdown = el;
      }
   });
}
