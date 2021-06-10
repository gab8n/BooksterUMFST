const editMyBookModal = function () {
  let modal_content = document.createElement("div");
  modal_content.classList.add("edit-book-modal");

  let bookEditForm = document.createElement("form");
  bookEditForm.classList.add("edit-book-form");

  let titleAndAuthorContainer = document.createElement('div');
  titleAndAuthorContainer.className = 'container-of-two-inputs';

  let bookTitleInput = document.createElement("input");
  bookTitleInput.classList.add("edit-book-title");
  bookTitleInput.placeholder = "Book title";

  let bookAuthor = document.createElement("input");
  bookAuthor.classList.add("edit-book-author");
  bookAuthor.placeholder = "Author";

  let isbnAndCategoryAndNumberOfPagesContainer = document.createElement('div');
  isbnAndCategoryAndNumberOfPagesContainer.className = 'container-of-three-inputs';

  let bookISBNInput = document.createElement("input");
  bookISBNInput.classList.add("edit-book-isbn");
  bookISBNInput.placeholder = "ISBN";

  let bookCategory = document.createElement("input");
  bookCategory.classList.add("edit-book-category");
  bookCategory.placeholder = "Category";

  let bookPagesInput = document.createElement("input");
  bookPagesInput.classList.add("edit-book-pages");
  bookPagesInput.placeholder = "Nr of pages";

  let bookDescription = document.createElement("textarea");
  bookDescription.classList.add("edit-book-description");
  bookDescription.placeholder = "Description";

  let bookEditSubmit = document.createElement("button");
  bookEditSubmit.type = "submit";
  bookEditSubmit.innerText = "Submit";
  bookEditSubmit.classList.add("edit-book-submit");

  let bookThumbnailURL = document.createElement("input");
  bookThumbnailURL.classList.add("edit-book-thumbnail-url");
  bookThumbnailURL.placeholder = "Cover photo URL";

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

  bookThumbnailURL.addEventListener('input', function(){
    imagePreviewOfaddBookCover.src = bookThumbnailURL.value;
    
  })

  
  titleAndAuthorContainer.appendChild(bookTitleInput);
  titleAndAuthorContainer.appendChild(bookAuthor);
  bookEditForm.appendChild(titleAndAuthorContainer);

  isbnAndCategoryAndNumberOfPagesContainer.appendChild(bookISBNInput);
  isbnAndCategoryAndNumberOfPagesContainer.appendChild(bookCategory);
  isbnAndCategoryAndNumberOfPagesContainer.appendChild(bookPagesInput);
  bookEditForm.appendChild(isbnAndCategoryAndNumberOfPagesContainer);
  
  bookEditForm.appendChild(bookDescription);
  bookEditForm.appendChild(bookThumbnailURL);

  uploadImageContainer.appendChild(uploadImage);
  containerOfImagePreviewAndUploadImage.appendChild(imagePreviewOfaddBookCover);
  containerOfImagePreviewAndUploadImage.appendChild(uploadImageContainer);
  bookEditForm.appendChild(containerOfImagePreviewAndUploadImage);

  bookEditForm.appendChild(bookEditSubmit);

  modal_content.appendChild(bookEditForm);

  return modal_content;
};
