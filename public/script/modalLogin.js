let openLoginModal = document.querySelector(".login-button");

const createLoginModal = function () {
  let modal_content = document.createElement("div");
  modal_content.className = "modal-content-login";

  let form = document.createElement("form");
  form.classList.add("login-form");

  let usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.placeholder = "Email";
  usernameInput.classList.add("email-login");

  let passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.classList.add("password-login");
  passwordInput.setAttribute("autocomplete", "on");

  let googleAuth = document.createElement("div");
  googleAuth.innerHTML = `
  <img src="./assets/google-icon.svg"/>
  <div class="google-auth-text">Sign in with Google</div>
  `;

  let loginMessage = document.createElement("div"); // will be later asigned a value when the login is either successfull or failed
  loginMessage.classList.add("login-message");

  googleAuth.classList.add("google-auth");
  googleAuth.style.display = "flex";

  let questionPasswordForgottenParagraph = document.createElement("p");
  questionPasswordForgottenParagraph.innerHTML = "Forgot your password?";

  let loginButton = document.createElement("button");
  loginButton.innerHTML = "Login";
  loginButton.type = "submit";
  loginButton.classList.add("login-modal");

  let questionNewUserParagraph = document.createElement("p");
  questionNewUserParagraph.innerHTML = "New user ? Create an account";
  questionNewUserParagraph.classList.add("new-user-paragraph");
  questionNewUserParagraph.addEventListener("click", () => {
    createModal(createRegisterModal(), "Sign Up");
  });
  modal_content.appendChild(form);
  form.appendChild(usernameInput);
  form.appendChild(passwordInput);
  modal_content.appendChild(googleAuth);
  modal_content.appendChild(loginMessage);
  modal_content.appendChild(questionPasswordForgottenParagraph);
  form.appendChild(loginButton);
  modal_content.appendChild(questionNewUserParagraph);

  return modal_content;
};
const createRegisterModal = function () {
  let modal_content = document.createElement("div");
  modal_content.className = "modal-content-login";

  let form = document.createElement("form");
  form.classList.add("register-form");

  let usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.placeholder = "Username";
  usernameInput.classList.add("username-register");

  let emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.placeholder = "E-mail";
  emailInput.classList.add("email-register");

  let passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.placeholder = "Password";
  passwordInput.setAttribute("autocomplete", "on");
  passwordInput.classList.add("password-register");

  let registerMessage = document.createElement("div");
  registerMessage.classList.add("register-message");

  let loginButton = document.createElement("button");
  loginButton.type = "submit";
  loginButton.innerText = "Register";

  let questionAlreadyHaveAccountParagraph = document.createElement("p");
  questionAlreadyHaveAccountParagraph.innerHTML =
    "Already have an account ? Sign In";
  questionAlreadyHaveAccountParagraph.addEventListener("click", () => {
    createModal(createLoginModal(), "Log In");
  });

  modal_content.appendChild(form);
  form.appendChild(usernameInput);
  form.appendChild(emailInput);
  form.appendChild(passwordInput);
  form.appendChild(loginButton);
  modal_content.appendChild(registerMessage);
  modal_content.appendChild(questionAlreadyHaveAccountParagraph);

  return modal_content;
};
openLoginModal.addEventListener("click", function () {
  createModal(createLoginModal(), "Log In");
});
