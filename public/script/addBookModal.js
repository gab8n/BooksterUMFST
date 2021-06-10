const addBookBtn = document.querySelector(".add-book-btn");

const createAddBookModal = function () {
  let modal_content = document.createElement("div");
  modal_content.classList.add("add-book-modal");

  let bookAddForm = document.createElement("form");
  bookAddForm.classList.add("add-book-form");

  let titleAndAuthorContainer = document.createElement("div");
  titleAndAuthorContainer.className = "container-of-two-inputs";

  let bookTitleInput = document.createElement("input");
  bookTitleInput.classList.add("add-book-title");
  bookTitleInput.placeholder = "Book title";

  let bookAuthor = document.createElement("input");
  bookAuthor.classList.add("add-book-author");
  bookAuthor.placeholder = "Author";

  let isbnAndCategoryAndNumberOfPagesContainer = document.createElement("div");
  isbnAndCategoryAndNumberOfPagesContainer.className =
    "container-of-three-inputs";

  let bookISBNInput = document.createElement("input");
  bookISBNInput.classList.add("add-book-isbn");
  bookISBNInput.placeholder = "ISBN";

  let bookCategory = document.createElement("input");
  bookCategory.classList.add("add-book-category");
  bookCategory.placeholder = "Category";

  let bookPagesInput = document.createElement("input");
  bookPagesInput.classList.add("add-book-pages");
  bookPagesInput.placeholder = "Nr of pages";

  let bookDescription = document.createElement("textarea");
  bookDescription.classList.add("add-book-description");
  bookDescription.placeholder = "Description";

  let bookThumbnailURL = document.createElement("input");
  bookThumbnailURL.classList.add("add-book-thumbnail-url");
  bookThumbnailURL.placeholder = "Cover photo URL";
  bookThumbnailURL.required = true;

  let containerOfImagePreviewAndUploadImage = document.createElement('div');
  containerOfImagePreviewAndUploadImage.className = 'image-preview-upload-container';

  let imagePreviewOfaddBookCover = document.createElement('img');
  imagePreviewOfaddBookCover.className = 'image-preview-book';
  imagePreviewOfaddBookCover.src = 'https://cdn1.bbcode0.com/uploads/2021/4/20/b9a6955c0a271ffdc3f9c7e814bbdf97-full.jpg';

  imagePreviewOfaddBookCover.setAttribute ( 'onerror','this.src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLP_DmTUnuJTcG1WvRL4crrkRX4uFXlc8tecCMc3raQPkbW2Yby-04uMQa6A1Zxb7gXAw&usqp=CAU"; ');

  let uploadImageContainer = document.createElement('label');
  uploadImageContainer.className = 'upload-image-container'
  uploadImageContainer.innerText = 'Upload';

  let uploadImage = document.createElement('input')
  uploadImage.type  = 'file';
  uploadImage.addEventListener("change", function(){

    if (this.files && this.files[0]) {
    
      var FR= new FileReader();
      
      FR.addEventListener("load", function(e) {
         imagePreviewOfaddBookCover.src = e.target.result;
        bookThumbnailURL.value = e.target.result;
      }); 
      
      FR.readAsDataURL( this.files[0] );
    }

  });



  bookThumbnailURL.addEventListener("input", function () {
    imagePreviewOfaddBookCover.src = bookThumbnailURL.value;
    console.log("image");
  });

  let bookAddSubmit = document.createElement("button");
  bookAddSubmit.type = "submit";
  bookAddSubmit.innerText = "Submit";
  bookAddSubmit.classList.add("add-book-submit");

  let bookAddMessage = document.createElement("p");
  bookAddMessage.classList.add("add-book-message");
  bookAddMessage.style.display = "none";

  titleAndAuthorContainer.appendChild(bookTitleInput);
  titleAndAuthorContainer.appendChild(bookAuthor);

  isbnAndCategoryAndNumberOfPagesContainer.appendChild(bookISBNInput);
  isbnAndCategoryAndNumberOfPagesContainer.appendChild(bookCategory);
  isbnAndCategoryAndNumberOfPagesContainer.appendChild(bookPagesInput);

  bookAddForm.appendChild(titleAndAuthorContainer);
  bookAddForm.appendChild(isbnAndCategoryAndNumberOfPagesContainer);

  bookAddForm.appendChild(bookDescription);

  bookAddForm.appendChild(bookThumbnailURL);

  uploadImageContainer.appendChild(uploadImage);
  containerOfImagePreviewAndUploadImage.appendChild(imagePreviewOfaddBookCover);
  containerOfImagePreviewAndUploadImage.appendChild(uploadImageContainer);
  bookAddForm.appendChild(containerOfImagePreviewAndUploadImage);
  bookAddForm.appendChild(bookAddSubmit);
  bookAddForm.appendChild(bookAddMessage);

  modal_content.appendChild(bookAddForm);

  return modal_content;
};

addBookBtn.addEventListener("click", () => {
  createModal(createAddBookModal(), "Add a book");
});
