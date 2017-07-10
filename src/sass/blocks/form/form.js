function form() {

  // ПРОВЕРКА ВАЛИДНОСТИ ПОЛЕЙ Form

  var form = document.querySelector(".form");
  var formBtn = document.querySelector(".form__btn");
  var userName = document.querySelector("#user-name");
  var userEmail = document.querySelector("#user-email");
  var userMsg = document.querySelector("#user-msg");
  var resendIndex = false;

  function showError(elem) {
  	event.preventDefault();
  	elem.parentElement.classList.add("form__item--error");
  	resendIndex = true;
  };

  formBtn.addEventListener("click", function(event) {
  	if(!userName.value) {
  		showError(userName);
  	} else if(!userEmail.value) {
  		showError(userEmail);
  	} else if(!userMsg.value) {
  		showError(userMsg);
  	} else {
  		// message.classList.remove("message--open"); // закрывался pop-up
  	}
  });

  form.addEventListener("blur", function(event) {
  	var elem = event.target;
  	if(resendIndex  && !!elem.value) { 
	  	elem.parentElement.classList.remove("form__item--error");
  	}
  }, true);
}