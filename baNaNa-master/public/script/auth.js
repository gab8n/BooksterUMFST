const auth = firebase.auth();
const db = firebase.firestore();

const signedOut = document.querySelector(".signed-out");
const signedIn = document.querySelector(".signed-in");

const loginBtn = document.querySelector(".login-button");
const signOutBtn = document.querySelector(".sign-out-btn");

// const userAvatarChange = document.querySelector(".user-avatar");

const googleProvider = new firebase.auth.GoogleAuthProvider(); //google provider for google auth

// const userAvatar = document.querySelector('.user-avatar');

loginBtn.addEventListener("click", () => {
  const googleLogin = document.querySelector(".google-auth");
  const loginMessage = document.querySelector(".login-message");
  const newUserParagraph = document.querySelector(".new-user-paragraph");
  const formLogin = document.querySelector(".login-form");

  //register
  newUserParagraph.addEventListener("click", () => {
    const formRegister = document.querySelector(".register-form");
    const usernameInput = document.querySelector(".username-register");
    const emailInput = document.querySelector(".email-register");
    const passInput = document.querySelector(".password-register");
    const registerMessage = document.querySelector(".register-message");

    formRegister.addEventListener("submit", (e) => {
      e.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailInput.value, passInput.value)
        .then((credentials) => {
          let myBooks = db.collection("users").doc(credentials.user.uid);
          document.querySelector('.modal-container').style.display = 'none';
          myBooks.set({
            myBooks: [],
            borrowedBooks: [],
            userAddress: {},
            userWishList: []
          });
        })
        .then(() => {
          firebase
            .auth()
            .currentUser.updateProfile({
              displayName: `${usernameInput.value}`,
              photoURL: "https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png",
            })
            .then(() => {
              loggedIn = true;
              location.reload();
            });
        })
        .catch((err) => {
          registerMessage.classList.add("failed-login");
          registerMessage.innerText = err.message;
        });
    });
  });

  //email password login
  formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.querySelector(".email-login");
    const passwordInput = document.querySelector(".password-login");
    firebase
      .auth()
      .signInWithEmailAndPassword(emailInput.value, passwordInput.value)
      .then(() => {
        googleLogin.style.display = "none";
        loginMessage.classList.remove("failed-login");
        loginMessage.classList.add("success-login");
        loginMessage.innerHTML = `<p>Successfully logged in !</p>`;
        document.querySelector('.modal-container').style.display = 'none';
        loggedIn = true;
      })
      .catch((err) => {
        loginMessage.classList.remove("success-login");
        loginMessage.classList.add("failed-login");
        loginMessage.innerText = `${err.message}`;
      });
  });

  //google login
  googleLogin.addEventListener("click", () => {
    auth
      .signInWithPopup(googleProvider)
      .then((credentials) => {
        googleLogin.style.display = "none";
        loginMessage.classList.remove("failed-login");
        loginMessage.classList.add("success-login");
        loginMessage.innerHTML = `<p>Successfully logged in !</p>`;
        document.querySelector('.modal-container').style.display = 'none';
        loggedIn = true;
        // set myBooks and borrowedBooks for the google logged in user only the first time he logs in , so i do not overwrite these fields each time a new book is added to them
        if (credentials.additionalUserInfo.isNewUser === true) {
          let myBooks = db.collection("users").doc(credentials.user.uid);
          myBooks.set({
            myBooks: [],
            borrowedBooks: [],
            userAddress: {},
            userWishList: []
          });
        }
      })

      .catch((err) => {
        loginMessage.classList.remove("success-login");
        loginMessage.classList.add("failed-login");
        loginMessage.innerText = `${err.message}`;
      });
  });
});

signOutBtn.addEventListener("click", () => {
  auth.signOut();
  location.reload();
});

const userIcon = document.querySelector(".user-icon");
const userName = document.querySelector(".user-name");
const profilePageContent = document.querySelector(".profile-content");
const restrictedContent = document.querySelector(".restricted-content");

window.addEventListener("load", () => {
  auth.onAuthStateChanged((user) => {
    // is logged in
    if (user) {
      document.querySelector(".login-button").style.display = "none";
      profilePageContent ? (profilePageContent.style.display = "flex") : null;
      restrictedContent ? (restrictedContent.style.display = "none") : null;

      signedOut.hidden = true;
      signedIn.hidden = false;
      userIcon.style.backgroundImage = `url('${user.photoURL}')`;
      userName ? (userName.innerText += ` ${user.displayName}`) : null; // to prevent an error if we are on another page than profile.html and the userName is not defined
    }
    //is NOT logged in
    else {
      signedOut.hidden = false;
      signedIn.hidden = true;
      document.querySelector(".login-button").style.display = "inline-block";
      if (
        window.location.href.substring(
          window.location.href.indexOf("public") + 6
        ) === "/profile.html"
      ) {
        console.log("da");
        document.querySelector(".profile-content").style.display = "none";
        document.querySelector(".restricted-content").style.display =
          "inline-block";
      }
    }
  });
});

// handle borrow book

const getNowBtn = document.querySelector(".getNowButton");
const modalContainer = document.querySelector(".modal"); //target node for observer
const borrowBtn = document.querySelector(".borrow-btn");
const config = { childList: true };

// create an observer instance
let observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    //checking to see if the element exists , because my observer's target is '.modal' , which is also the parrent of the login modal
    if (document.querySelector(".modal-borrow")) {
      borrowForm = document.querySelector(".modal-borrow").firstChild;
      borrowMessage = document.querySelector(".borrow-message");
      borrowFirstName = document.querySelector(".firstname-borrow");
      borrowLastName = document.querySelector(".lastname-borrow");
      borrowPhoneNr = document.querySelector("#phone");
      borrowAddress = document.querySelector(".street-address-borrow");
      borrowCity = document.querySelector(".city-input-borrow");
      borrowState = document.querySelector(".state-borrow");
      borrowZip = document.querySelector(".zip-code-borrow");

      if (borrowForm) {
        borrowForm.addEventListener("submit", (e) => {
          e.preventDefault();
          auth.onAuthStateChanged((user) => {
            if (user) {
              let params = new URLSearchParams(window.location.search);
              const currentBookId = params.get("bookid");

              //add the book to the coresponding user when he rents a book
              db.collection("users")
                .doc(user.uid)
                .update({
                  borrowedBooks: firebase.firestore.FieldValue.arrayUnion(
                    `${currentBookId}`
                  ),
                  userAddress: {
                    firstname: borrowFirstName.value,
                    lastname: borrowLastName.value,
                    phone: borrowPhoneNr.value,
                    address: borrowAddress.value,
                    city: borrowCity.value,
                    state: borrowState.value,
                    zip: borrowZip.value,
                  },
                })
                // remove borrowed bok from wishlist
              db.collection("users")
                .doc(user.uid)
                .update({
                  userWishList: firebase.firestore.FieldValue.arrayRemove(
                    `${currentBookId}`
                  )
                })
                //----------------------------------
                .catch((err) => console.log(err.message));
              db.collection("BookCollection")
                .doc(currentBookId)
                .update({
                  "element.borrowed": "true", //mark the book as borrowed in the db
                })
                .catch((err) => console.log(err.message));
              getNowBtn.innerText = "Borrowed";
              getNowBtn.style.backgroundColor = "green";
              modalContainer.parentElement.style.display = "none";
              observer.disconnect();
            } else {
              borrowMessage.innerText = "You need to be logged in first!";
            }
          });
        });
      }
    } else {
      observer.disconnect();
    }
  });
});

// target node and config for the observer
observer.observe(modalContainer, config);

// handle the links "Your info" and "Books dashboard" from profile page

const yourInformation = document.querySelector(".your-information");
const yourInformationBtn = document.querySelector(".your-information-btn");
const booksDashboard = document.querySelector(".books-dashboard");
const booksDashboardBtn = document.querySelector(".books-dashboard-btn");
const myWishlist = document.querySelector(".my-wishlist");
const myWishlistBtn = document.querySelector(".books-wishlist-btn");


if (yourInformationBtn) {
  yourInformationBtn.addEventListener("click", () => {
    yourInformation.style.display = "block";
    booksDashboard.style.display = "none";
    myWishlist.style.display = "none";
  });
}
if (booksDashboardBtn) {
  booksDashboardBtn.addEventListener("click", () => {
    yourInformation.style.display = "none";
    booksDashboard.style.display = "block";
    myWishlist.style.display = "none";
  });
}

if (myWishlistBtn) {
  myWishlistBtn.addEventListener("click", () => {
    yourInformation.style.display = "none";
    booksDashboard.style.display = "none";
    myWishlist.style.display = "block";
  });
}

userIcon.addEventListener("click", () => {
  window.location.href = "profile.html";
});
