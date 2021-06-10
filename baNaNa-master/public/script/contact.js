const contactGetBook = document.querySelector("#get-book-btn");
const contactMeetUs = document.querySelector("#meet-us-btn");

if (contactGetBook) {
  contactGetBook.addEventListener("click", () => {
    window.location.href = "bookCollection.html";
  });
}

if (contactMeetUs) {
  contactMeetUs.addEventListener("click", () => {
    window.location.href = "aboutUs.html";
  });
}
