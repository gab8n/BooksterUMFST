
let params = new URLSearchParams(window.location.search);
const currentBookId = params.get("bookid");

let bookCover = document.querySelector(".book-cover");
let bookTitle = document.querySelector(".book-title");
let bookAuthor = document.querySelector(".book-author");
let bookCategory = document.querySelector(".book-category");
let bookPages = document.querySelector(".book-pages");
let bookDescription = document.querySelector(".book-description");


const renderBookDetails = function(data) {
    bookCover.setAttribute('src', `${data.thumbnailUrl ? data.thumbnailUrl : './assets/missingCover.jpg'}`); 
    bookCover.setAttribute ( 'onerror','this.src ="./assets/missingCover.jpg"; ');
    bookTitle.innerHTML = `${data.title}`;
    bookAuthor.innerHTML = `by: ${data.authors[0]}`;
    bookCategory.innerHTML = `Category: <span class="categ-span">${data.categories[0]}</span>`;
    bookPages.innerHTML = `Number of pages: <span class="pages-span">${data.pageCount}</span>`;
    bookDescription.innerHTML = `${data.longDescription.slice(0, 660)}`;
}



if (currentBookId) {
  firebase
    .firestore()
    .collection("BookCollection")
    .doc(currentBookId)
    .get()
    .then((doc) => renderBookDetails(doc.data().element))
    .catch((err) => console.log(err));
};


// WISHLIST

const wishBtn = document.querySelector(".wish-btn");

wishBtn.addEventListener('click', function() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      firebase.firestore().collection('users')
      .doc(user.uid)
      .update({
        userWishList: firebase.firestore.FieldValue.arrayUnion(currentBookId)
      });
      wishBtn.style.backgroundColor = "rgb(250, 72, 72)";
    }
  });
})

// COMMENTS SECTION

const commentsSection = document.querySelector(".book-comments");
const loggedInAvatar = document.querySelector(".img-avatar");
let userID = "";
let userAvatar = "";
let userDisplayName = "";
const commentContent = document.querySelector(".comment-input");
const createComment = document.querySelector(".add-comment");
const commentsForm = document.querySelector(".comments-form_container");



firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          loggedInAvatar.src = user.photoURL;
          userID = user.uid;
          userDisplayName = user.displayName;
          userAvatar = user.photoURL;

          commentsForm.classList.remove("hidden-comments-form");
          
          createComment.addEventListener('click', function() {
            addComment();
            commentContent.value = "";
          });
        };
})


//getLoggedUserDetails();


function addComment() {    
    firebase
      .firestore()
      .collection("BookComments")
      .doc()
      .set(
        comment = {
          ownerID: userID,
          ownerName: userDisplayName,
          ownerAvatar: userAvatar,
          bookRelatedID: currentBookId,
          content: commentContent.value
        }
      )
      .then(() => location.reload())
      .catch((error) => {
        console.error("Item loading failed: ", error);
      }); 
};


let commentsList = [];

async function getDbCommentsList() {
  await firebase.firestore().collection('BookComments').get().then(snapshot => {
    commentsList = snapshot.docs.map(doc => (
      {
        id: doc.id,
        comment: doc.data()
      }
    ));    
  });
};

//Create comment component

function renderComment(data, id) {

    let commentCard = document.createElement('div');
    commentCard.className = "comment";

    let avatar = document.createElement('figure');
    avatar.className = "comment-avatar";

    let avatarImg = document.createElement('img');
    avatarImg.src = `${data.ownerAvatar}`;

    let commentBody = document.createElement('div');
    commentBody.className = "comment-content";
    
    let commentOwner = document.createElement('h3');
    commentOwner.className = "comment-author";
    commentOwner.innerHTML = `${data.ownerName}`;

    let commentText = document.createElement('p');
    commentText.className = "comment-text";
    commentText.innerHTML = `${data.content}`;

    
    let removeComm = document.createElement('i');
    removeComm.className = "fas fa-trash-alt remove-comment";
    removeComm.setAttribute("title", "Remove this comment")
    removeComm.addEventListener('click', function() {
      removeComment(id);
    })
  


    commentCard.appendChild(avatar);
    commentCard.appendChild(commentBody);
    avatar.appendChild(avatarImg);
    commentBody.appendChild(commentOwner);
    commentBody.appendChild(commentText);

    if (commentsList.find(comm => comm.id === id).comment.ownerID === userID) {
    commentBody.appendChild(removeComm);
    }

  return commentCard;
};

//Display comments from database

function displayComments() {
  let comments = commentsList.filter(item => item.comment.bookRelatedID === currentBookId);
  comments.forEach(element => commentsSection.appendChild(renderComment(element.comment, element.id)));
};

// Remove comment

function removeComment(id) {
  if (commentsList.find(comm => comm.id === id).comment.ownerID === userID) {
  firebase.firestore().collection('BookComments')
  .doc(id)
  .delete()
  .then(() => {
    location.reload();
  })
  .catch(error => console.error("Error removing comment", error));
  } else {
    alert('You are not authorized to remove this coment!');
  }
};


getDbCommentsList().then(() => displayComments());




