//addBookBtn is firstly grabbed in addBookModal.js


let myUserData = {
  myBooks: [],
  borrowedBooks: [],
  userWishList: [],
  userAddress: {
    address: "",
    city: "",
    firstname: "",
    lastname: "",
    phone: "",
    state: "",
    zip: "",
  },
};

const userAvatar = document.querySelector(".user-avatar");


addBookBtn.addEventListener("click", () => {
  const addBookForm = document.querySelector(".add-book-form");
  if (addBookForm) {
    const addBookTitle = document.querySelector(".add-book-title");
    const addBookISBN = document.querySelector(".add-book-isbn");
    const addBookPages = document.querySelector(".add-book-pages");
    const addThumbnailURL = document.querySelector(".add-book-thumbnail-url");
    const addBookAuthor = document.querySelector(".add-book-author");
    const addBookDescription = document.querySelector(".add-book-description");
    const addBookCategory = document.querySelector(".add-book-category");

    if (myUserData.myBooks.length < 10) {
      //add the newly submited book to BookCollection only if the user has not already added more than 10 books!
      addBookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        let newBookRef = db.collection("BookCollection").doc();
        newBookRef
          .set({
            element: {
              authors: [addBookAuthor.value],
              borrowed: false,
              categories: [addBookCategory.value],
              isbn: addBookISBN.value,
              longDescription: addBookDescription.value,
              pageCount: addBookPages.value,
              thumbnailUrl: addThumbnailURL.value,
              title: addBookTitle.value,
            },
          })
          // add the newly submited book to the user that submited it , under the myBooks field
          .then(() => {
            db.collection("users")
              .doc(firebase.auth().currentUser.uid)
              .update({
                myBooks: firebase.firestore.FieldValue.arrayUnion(
                  `${newBookRef.id}`
                ),
              });
            location.reload();
          })
          .catch((err) => console.log(err));
      });
    } else {
      const bookAddMessage = document.querySelector(".add-book-message");
      const bookAddSubmit = document.querySelector(".add-book-submit");
      bookAddSubmit.style.display = "none";

      bookAddMessage.innerText =
        "You can add a maximum of 10 books at the same time!";
      bookAddMessage.style.display = "inline-block";
    }
  }
});

//Get my added books and store them to myUserData object;

function getUserAddedBooks() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      userAvatar.style.backgroundImage = `url(${user.photoURL})`;
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.data().myBooks) {
            const booksID = doc.data().myBooks; //array of books id
            interogateBookCollection(booksID, user.uid);
          }
        })
        .catch((err) => console.log(err));
    } else {
    }
  });
}

async function interogateBookCollection(booksIdArray, userID) {
  //up to 10 inputs for the where('',in,'') method
  if (booksIdArray.length !== 0) {
    await db
      .collection("BookCollection")
      .where(firebase.firestore.FieldPath.documentId(), "in", booksIdArray)
      .get()
      .then((snapshot) => {
        myUserData["myBooks"] = snapshot.docs.map((doc) => {
          return {
            book: doc.data().element,
            id: doc.id,
          };
        });
      })
      .then(() => {
        displayUserAddedBooks(userID);
      });
  }
}

const displayUserAddedBooks = (userID) => {
  const myBooksContainer = document.querySelector(".my-added-books-container");

  myUserData.myBooks.forEach((el, i) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("my-books-item");

    const bookItemCover = document.createElement("div");
    bookItemCover.classList.add("my-books-cover");

    const bookStatus = document.createElement("p");
    bookStatus.classList.add("my-books-status");
    bookStatus.style.color = "white";
    if (el.book.borrowed === "true") {
      bookStatus.innerText = "borrowed";
      bookStatus.style.backgroundColor = `#77dd91`;
    } else {
      bookStatus.innerText = "not borrowed";
      bookStatus.style.backgroundColor = `#ff7661`;
    }

    const bookBtnGroup = document.createElement("div");
    bookBtnGroup.classList.add("my-books-btn-group");

    const editBtn = document.createElement("button");
    editBtn.classList.add(`my-books-edit-btn${i}`);
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(`my-books-delete-btn${i}`);
    deleteBtn.innerText = "Delete";

    bookItemCover.style.backgroundImage = el.book.thumbnailUrl
      ? `url(${el.book.thumbnailUrl})`
      : `url(./assets/missingCover.jpg)`;

    bookItemCover.addEventListener("click", () => {
      redirectToBookPage(i, bookItem);
    });

    editBtn.addEventListener("click", () => {
      createModal(editMyBookModal(), "Edit book");
      updateBookInDB(editBtn);
    });
    deleteBtn.addEventListener("click", () => {
      deleteBookFromDB(deleteBtn, userID, bookItem);
    });

    myBooksContainer.appendChild(bookItem);
    bookItem.appendChild(bookStatus);
    bookItem.appendChild(bookItemCover);
    bookBtnGroup.appendChild(editBtn);
    bookBtnGroup.appendChild(deleteBtn);
    bookItem.appendChild(bookBtnGroup);
  });
};

//update book in DB

const updateBookInDB = (editBtn) => {
  const editBtnIndex = editBtn.className.indexOf("btn") + 3; // get the index that represents the number of the edit button
  const editBtnId = editBtn.className.substring(editBtnIndex); //get the actual formated id number of the clicked edit button

  const editBookForm = document.querySelector(".edit-book-form");
  const editBookTitle = document.querySelector(".edit-book-title");
  const editBookISBN = document.querySelector(".edit-book-isbn");
  const editBookPages = document.querySelector(".edit-book-pages");
  const editThumbnailURL = document.querySelector(".edit-book-thumbnail-url");
  const editBookAuthor = document.querySelector(".edit-book-author");
  const editBookDescription = document.querySelector(".edit-book-description");
  const editBookCategory = document.querySelector(".edit-book-category");

  editBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(myUserData.myBooks[editBtnId].book);
    db.collection("BookCollection")
      .doc(myUserData.myBooks[editBtnId].id)
      .update({
        element: {
          title: editBookTitle.value
            ? editBookTitle.value
            : myUserData.myBooks[editBtnId].book.title,
          thumbnailUrl: editThumbnailURL.value
            ? editThumbnailURL.value
            : myUserData.myBooks[editBtnId].book.thumbnailUrl,
          pageCount: editBookPages.value
            ? editBookPages.value
            : myUserData.myBooks[editBtnId].book.pageCount,
          longDescription: editBookDescription.value
            ? editBookDescription.value
            : myUserData.myBooks[editBtnId].book.longDescription,
          isbn: editBookISBN.value
            ? editBookISBN.value
            : myUserData.myBooks[editBtnId].book.isbn,
          categories: editBookCategory.value
            ? editBookCategory.value
            : myUserData.myBooks[editBtnId].book.categories,
          borrowed: myUserData.myBooks[editBtnId].book.borrowed,
          authors: editBookAuthor.value
            ? editBookAuthor.value
            : myUserData.myBooks[editBtnId].book.authors,
        },
      })
      .then(() => {
        location.reload();
      })
      .catch((err) => console.log(err));
  });
};

//delete book
//the source parameter indicates if we should delete the button from myBooks or from borrowedBooks
const deleteBookFromDB = (deleteBtn, userID, source) => {
  const deleteBtnIndex = deleteBtn.className.indexOf("btn") + 3; // get the index that represents the number of the delete button
  const deleteBtnId = deleteBtn.className.substring(deleteBtnIndex); //get the actual formated id number of the clicked delete button

  if (source.className === "my-books-item") {
    db.collection("BookCollection")
      .doc(myUserData.myBooks[deleteBtnId].id)
      .delete()
      .then(() => {
        console.log("Book deleted from BookCollection!");
      });
    db.collection("users")
      .doc(userID)
      .update({
        myBooks: firebase.firestore.FieldValue.arrayRemove(
          `${myUserData.myBooks[deleteBtnId].id}`
        ),
      })
      .then(() => {
        location.reload();
        console.log("Book deleted from users!");
      });
  } else if (source.className === "my-borrowed-item") {
    db.collection("BookCollection")
      .doc(myUserData.borrowedBooks[deleteBtnId].id)
      .update({
        "element.borrowed": false,
      })
      .then(() => {
        console.log("Updated in BookCollection!");
      });
    db.collection("users")
      .doc(userID)
      .update({
        borrowedBooks: firebase.firestore.FieldValue.arrayRemove(
          `${myUserData.borrowedBooks[deleteBtnId].id}`
        ),
      })
      .then(() => {
        location.reload();
        console.log("Book deleted from users!");
      });
  } else if (source.className === "my-wishlist-item") {
    db.collection("users")
      .doc(userID)
      .update({
        userWishList: firebase.firestore.FieldValue.arrayRemove(
          `${myUserData.userWishList[deleteBtnId].id}`
        ),
      })
      .then(() => {
        location.reload();
        console.log("Book deleted from wishlist!");
      });
  }
};

// get my borrowed books

const getUserBorrowedBooks = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.data().borrowedBooks) {
            const booksID = doc.data().borrowedBooks; //array of borrowed books id
            interogateBookCollectionBorrowed(booksID, user.uid);
            getUserAddress(user.uid);
          }
        })
        .catch((err) => console.log(err));
    } else {
    }
  });
};

async function interogateBookCollectionBorrowed(booksIdArray, userID) {
  //up to 10 inputs for the where('',in,'') method
  if (booksIdArray.length !== 0) {
    await db
      .collection("BookCollection")
      .where(firebase.firestore.FieldPath.documentId(), "in", booksIdArray)
      .get()
      .then((snapshot) => {
        myUserData["borrowedBooks"] = snapshot.docs.map((doc) => {
          return {
            book: doc.data().element,
            id: doc.id,
          };
        });
      })
      .then(() => {
        displayUserBorrowedBooks(userID);
      });
  }
}

const displayUserBorrowedBooks = (userID) => {
  const myBorrowedContainer = document.querySelector(
    ".my-borrowed-books-container"
  );

  myUserData.borrowedBooks.forEach((el, i) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("my-borrowed-item");

    const bookItemCover = document.createElement("div");
    bookItemCover.classList.add("my-borrowed-cover");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(`my-borrowed-delete-btn${i}`);
    deleteBtn.innerText = "Return";

    bookItemCover.style.backgroundImage = el.book.thumbnailUrl
      ? `url(${el.book.thumbnailUrl})`
      : `url(./assets/missingCover.jpg)`;

    bookItemCover.addEventListener("click", () => {
      redirectToBookPage(i, bookItem);
    });

    deleteBtn.addEventListener("click", () => {
      deleteBookFromDB(deleteBtn, userID, bookItem);
    });

    myBorrowedContainer.appendChild(bookItem);
    bookItem.appendChild(bookItemCover);
    bookItem.appendChild(deleteBtn);
  });
};

//bookItem is common to both My books and Borrowed books but the class is different and it is used to identy which
//method to access from myUserData object
const redirectToBookPage = (index, bookItem) => {
  if (bookItem.className === "my-books-item") {
    window.location.href = `bookDetails.html?bookid=${myUserData.myBooks[index].id}`;
  } else if (bookItem.className === "my-borrowed-item") {
    window.location.href = `bookDetails.html?bookid=${myUserData.borrowedBooks[index].id}`;
  } else if (bookItem.className === "my-wishlist-item") {
    window.location.href = `bookDetails.html?bookid=${myUserData.userWishList[index].id}`;
  }
};

//get user address info so i can display it in "Your info" section
async function getUserAddress(userID) {
  if (userID) {
    await db
      .collection("users")
      .doc(userID)
      .get()
      .then((doc) => {
        myUserData["userAddress"] = doc.data().userAddress;
      })
      .then(() => {
        displayUserAddress();
      });
  }
}

const displayUserAddress = () => {
  const books_container = document.querySelector(".books-info-container");

  const firstname = document.createElement("p");
  firstname.classList.add("info-firstname");
  firstname.innerText = `Firstname: ${myUserData.userAddress.firstname}`;

  const lastname = document.createElement("p");
  lastname.classList.add("info-lastname");
  lastname.innerText = `Lastname: ${myUserData.userAddress.lastname}`;

  const state = document.createElement("p");
  state.classList.add("info-state");
  state.innerText = `State: ${myUserData.userAddress.state}`;

  const city = document.createElement("p");
  city.classList.add("info-city");
  city.innerText = `City: ${myUserData.userAddress.city}`;

  const address = document.createElement("p");
  address.classList.add("info-address");
  address.innerText = `Address: ${myUserData.userAddress.address}`;

  const zip = document.createElement("p");
  zip.classList.add("info-zip");
  zip.innerText = `Zip code: ${myUserData.userAddress.zip}`;

  books_container.appendChild(firstname);
  books_container.appendChild(lastname);
  books_container.appendChild(address);
  books_container.appendChild(city);
  books_container.appendChild(state);
  books_container.appendChild(zip);
};

const profileSignOut = document.querySelector(".profile-sign-out");
profileSignOut.addEventListener("click", () => {
   auth.signOut(); ;
  window.location.href = 'index.html';
  
  
});


// Get user's wishlist from database

function getUserWishlist() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.data().userWishList) {
            const booksID = doc.data().userWishList; //array of books id
            interogateBookWishlist(booksID, user.uid);
          }
        })
        .catch((err) => console.log(err));
    } else {
    }
  });
}


async function interogateBookWishlist(booksIdArray, userID) {
  //up to 10 inputs for the where('',in,'') method
  if (booksIdArray.length !== 0) {
    await db
      .collection("BookCollection")
      .where(firebase.firestore.FieldPath.documentId(), "in", booksIdArray)
      .get()
      .then((snapshot) => {
        myUserData["userWishList"] = snapshot.docs.map((doc) => {
          return {
            book: doc.data().element,
            id: doc.id,
          };
        });
      })
      .then(() => {
        displayUserWishlist(userID);
      });
  }
};


const displayUserWishlist = (userID) => {
  const myWishlist = document.querySelector(
    ".my-wishlist-container"
  );

  myUserData.userWishList.forEach((el, i) => {
    const bookItem = document.createElement("div");
    bookItem.classList.add("my-wishlist-item");

    const bookItemCover = document.createElement("div");
    bookItemCover.classList.add("my-wishlist-cover");

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add(`my-wishlist-delete-btn${i}`);
    deleteBtn.innerText = "Remove";

    bookItemCover.style.backgroundImage = el.book.thumbnailUrl
      ? `url(${el.book.thumbnailUrl})`
      : `url(./assets/missingCover.jpg)`;

    bookItemCover.addEventListener("click", () => {
      redirectToBookPage(i, bookItem);
    });

    deleteBtn.addEventListener("click", () => {
      deleteBookFromDB(deleteBtn, userID, bookItem);
    });

    myWishlist.appendChild(bookItem);
    bookItem.appendChild(bookItemCover);
    bookItem.appendChild(deleteBtn);
  });
};
//----------------------------------------
userAvatar.addEventListener('click', ()=>{
  createModal(changeProfilePictureModal(), "Change Profile Picture");
  const changeProfilePictureForm = document.querySelector(".change-profile-picture-form");
  const changeProfilePictureThumbnailUrl = document.querySelector('.change-profile-picture-thumbnail-url');
  let fileToUploadForProfileImage = {};
  const uploadProfilePictureInput = document.querySelector('.upload-profile-picture-input').addEventListener('change', function(e){fileToUploadForProfileImage= e.target.files[0]})

  

  changeProfilePictureForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    let user = firebase.auth().currentUser;
    
    
    let storageRef = firebase.storage().ref('users/' +user.uid + '/profile.jpg' ).put(fileToUploadForProfileImage).then((snapshot)=>{

      firebase.storage().ref('users/' +user.uid + '/profile.jpg').getDownloadURL().then(imgUrl=>{
        user.updateProfile({ photoURL: imgUrl });
         location.reload();
        
      }).catch((error) => {console.log(error)});

    }).catch((error)=>{
      console.log(error);
    })

  })
})

     




getUserAddress();
getUserAddedBooks();
getUserBorrowedBooks();
getUserWishlist();
