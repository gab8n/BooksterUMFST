const getNowButton = document.querySelector(".getNowButton");
const createBorrowModal = function () {
  let modal_content = document.createElement("div");
  modal_content.classList.add("modal-borrow");

  let form = document.createElement("form");
  form.classList.add("borrow-form");

  let firstAndLastNameContainer = document.createElement("div");
  firstAndLastNameContainer.classList.add("container-of-two-inputs");

  let firstNameInput = document.createElement("input");
  firstNameInput.placeholder = "First Name";
  firstNameInput.classList.add("firstname-borrow");
  firstNameInput.required = true;

  let lastNameInnput = document.createElement("input");
  lastNameInnput.placeholder = "Last Name";
  lastNameInnput.type = "text";
  lastNameInnput.classList.add("lastname-borrow");
  lastNameInnput.required = true;

  let phoneNumerInput = document.createElement("input");
  // phoneNumerInput.name = "phone";
  phoneNumerInput.type = "text";
  phoneNumerInput.id = "phone";
  phoneNumerInput.required = true;

  let streetAdressInnput = document.createElement("input");
  streetAdressInnput.placeholder = "Street Adress";
  streetAdressInnput.type = "text";
  streetAdressInnput.classList.add("street-address-borrow");
  streetAdressInnput.required = true;

  let cityAndStateContainer = document.createElement("div");
  cityAndStateContainer.classList.add("container-of-two-inputs");

  let cityInnput = document.createElement("input");
  cityInnput.placeholder = "City";
  cityInnput.type = "text";
  cityInnput.classList.add("city-input-borrow");
  cityInnput.required = true;

  let stateProvinceInnput = document.createElement("input");
  stateProvinceInnput.placeholder = "State / Province";
  stateProvinceInnput.type = "text";
  stateProvinceInnput.classList.add("state-borrow");
  stateProvinceInnput.required = true;

  let zipCodeInnput = document.createElement("input");
  zipCodeInnput.placeholder = "Postal / Zip Code";
  zipCodeInnput.type = "text";
  zipCodeInnput.pattern = "[0-9]*";
  zipCodeInnput.classList.add("zip-code-borrow");
  zipCodeInnput.required = true;

  let submitBorrwButton = document.createElement("button");
  submitBorrwButton.type = "submit";
  submitBorrwButton.innerText = "Borrow";

  let borrowFormMessage = document.createElement("p");
  borrowFormMessage.classList.add("borrow-message");

  firstAndLastNameContainer.appendChild(firstNameInput);
  firstAndLastNameContainer.appendChild(lastNameInnput);

  cityAndStateContainer.appendChild(cityInnput);
  cityAndStateContainer.appendChild(stateProvinceInnput);

  modal_content.appendChild(form);
  form.appendChild(firstAndLastNameContainer);
  form.appendChild(phoneNumerInput);
  form.appendChild(streetAdressInnput);
  form.appendChild(cityAndStateContainer);
  form.appendChild(zipCodeInnput);
  form.appendChild(submitBorrwButton);
  form.appendChild(borrowFormMessage);

  return modal_content;
};
function creareInputNumberByCountry() {
  const phoneInputField = document.querySelector("#phone");
  window.intlTelInput(phoneInputField, {
    preferredCountries: ["ro", "us", "uk", "de"],
    initialCountry: "ro",
    nationalMode: false,
    autoHideDialCode: false,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });
}

getNowButton.addEventListener("click", borrowModalEventListener);

//added a named function because i need to later remove the eventListener if a certain book is borrowed
function borrowModalEventListener() {
  createModal(
    createBorrowModal(),
    "Borrow: " + document.querySelector(".book-title").innerHTML
  );
  creareInputNumberByCountry();
}
