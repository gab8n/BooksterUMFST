// reading data from database and filling the books collection

const booksCollection = document.querySelector(".collection");
const searchBarInput = document.querySelector('.search-bar input');
const prevBtn = document.querySelector(".prev-page");
const nextBtn = document.querySelector(".next-page");
const displayedPageNr = document.querySelector(".displayed-pageNr");


const createParamasForDetailsPage = function(id) {
  let bookID = id;
  let params = new URLSearchParams();
  params.append('bookid', bookID);
  let url = 'bookDetails.html?' + params.toString();
  location.href = url;
  
};


const renderBook = function (data, id, nameCLassOfThePage) {
  let bookCard = document.createElement("div");
  bookCard.className = "collection-item";
  bookCard.classList.add('pageOfBooks' + nameCLassOfThePage);
  if (nameCLassOfThePage !== 1) {
    bookCard.classList.add('hidden');
  }  

  let bookImg = document.createElement("img");
  bookImg.className = "item-img";
  bookImg.src = `${
    data.thumbnailUrl ? data.thumbnailUrl : "./assets/missingcover.jpg"
  }`;
  bookImg.setAttribute ( 'onerror','this.src ="./assets/missingCover.jpg"; ');
  bookImg.alt = "Book cover";

  let bookTitle = document.createElement("h6");
  bookTitle.className = "item-title";
  bookTitle.innerHTML = `${data.title}`;

  let bookDescription = document.createElement("div");
  bookDescription.className = "item-desc";
  bookDescription.innerHTML = `${
    data.longDescription
      ? data.longDescription.slice(0, 100) + "..."
      : "Description unavailable"
  }`;

  let detailsBtn = document.createElement("a");
  detailsBtn.className = "borrow-btn";
  detailsBtn.innerHTML = "Details";
  detailsBtn.href = "#"

  detailsBtn.addEventListener("click", function () {
    createParamasForDetailsPage(id);
  });

  bookCard.appendChild(bookImg);
  bookCard.appendChild(bookTitle);
  bookCard.appendChild(bookDescription);
  bookCard.appendChild(detailsBtn);

  return bookCard;
};

let booksList = [];
let bookListFiltered;

async function getDbCollection() {
  await firebase.firestore().collection('BookCollection').get().then(snapshot => {
    booksList = snapshot.docs.map(doc => (
      {
        id: doc.id,
        book: doc.data().element,
      }
    ));    
  });
};

// function is called when page loads, to fill the collection 1st page
getDbCollection().then(() => getBooksPageList());

function getBooksPageList() {  
    
    let bookCollectionAux = document.createElement('div');
    bookCollectionAux.className = 'collection';
    let pageClass = 1;
    let keyWord = searchBarInput.value.toLowerCase();

    if (keyWord !== '') {
      bookListFiltered = booksList.filter((element) => {
        let stringForMatchingKeyWord = (
          element.book.authors +
          ',' +
          element.book.shortDescription +
          ',' +
          element.book.title +
          ',' +
          element.book.categories
        ).toLowerCase();
        if (stringForMatchingKeyWord.includes(keyWord)) return element;
      });
    } else {
      bookListFiltered = booksList.filter(element=>{
        if(element.book.borrowed === false)
          return element;
      })
    }

    for (let i = 1; i < bookListFiltered.length + 1; i++) {
      bookCollectionAux.appendChild(
        renderBook(
          bookListFiltered[i - 1].book,
          bookListFiltered[i - 1].id,
          pageClass
        )
      );
      if (i % itemsPerPage === 0 && i != 0) {
        pageClass++;
      }
    }
    booksCollection.innerHTML = '';
    booksCollection.appendChild(bookCollectionAux);
    currentPage = 1;
    displayedPageNr.textContent = currentPage;
  };



// function getBooksPageList(start, itemsNr) {
//     location.hash = `#page=${currentPage}`;
//     let pageList = booksList.slice(start, start + itemsNr);
//     pageList.forEach(bookItem => booksCollection.appendChild(renderBook(bookItem.book, bookItem.id)))
// };


//-------------------------------------------------

// pagination

let currentPage = 1;
let itemsPerPage = 12;







function switchPage() {
  displayedPageNr.textContent = currentPage;
  document.querySelectorAll('.collection-item').forEach((element) => {
    element.classList.toggle('hidden', true);
   
  });
  document.querySelectorAll('.pageOfBooks' + currentPage).forEach((element) => {
    
    element.classList.toggle('hidden', false);
  });
}



  prevBtn.addEventListener('click', function(){
    if (currentPage > 1) {
      currentPage--;
      switchPage();
    }
  });
  
  nextBtn.addEventListener('click', function(){
    if (currentPage < Math.ceil(bookListFiltered.length / itemsPerPage)) {
      currentPage++;
  
      switchPage();
    }
  });
  searchBarInput.addEventListener('change', function () {
    getBooksPageList();
  });

