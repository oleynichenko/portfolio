function popUp() {
	var writeBtn = document.querySelector("#writeBtn");
	var popUpWrap = document.querySelector(".pop-up__wrapper");
	var popUpBtn = document.querySelector(".pop-up__btn-switch");
	var popUp = document.querySelector(".pop-up--pop");

  smoothDisplay(popUpWrap, "0.5s", writeBtn, popUpBtn);

  // закрытие по клику вне окна
	popUpWrap.addEventListener("click", function(event) {
		event.preventDefault();
		if (!popUp.contains(event.target)) { 
			popUpWrap.classList.add("smooth-display__elem--hide");
		}
	});

  // закрытие по esc
  window.addEventListener("keydown", function(event) {
  	if (event.keyCode === 27 && !popUpWrap.classList.contains("smooth-display__elem--hide")) {
  		popUpWrap.classList.add("smooth-display__elem--hide");
  	}
  });	
} 