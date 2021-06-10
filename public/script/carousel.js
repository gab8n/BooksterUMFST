const sliders = document.querySelector(".carousel-box");
const scrollToLeftCarouselButton  = document.querySelector('.switch-left')
const scrollToRightCarouselButton  = document.querySelector('.switch-right')
let scrollPerClick;
let imagePadding = 20;
let booksList=[];
let numberOfBooksToShow = 15;

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
  getDbCollection().then(() => addElementToCarousel());
let scrollAmount = 0;

function sliderScrollLeft() {
  sliders.scrollTo({
    top: 0,
    left: (scrollAmount -= scrollPerClick),
    behavior: "smooth",
  });

  if (scrollAmount < 0) {
    scrollAmount = 0;
  }

}

function sliderScrollRight() {
  if (scrollAmount <= sliders.scrollWidth - sliders.clientWidth) {
    sliders.scrollTo({
      top: 0,
      left: (scrollAmount += scrollPerClick),
      behavior: "smooth",
    });
  }
}

function addElementToCarousel(){
    for(let i=0 ; i<numberOfBooksToShow;i++)
    {
        let newImageForCarousel =  document.createElement('img');
        newImageForCarousel.src = `${
            booksList[i].book.thumbnailUrl ? booksList[i].book.thumbnailUrl : "./assets/missingCover.jpg"
          }`;
          newImageForCarousel.setAttribute ( 'onerror','this.src ="./assets/missingCover.jpg"; ');
          newImageForCarousel.className = 'image-for-carousel';
          newImageForCarousel.addEventListener("click", function () {
            createParamasForDetailsPage(booksList[i].id);
          });
          
          sliders.appendChild(newImageForCarousel);
    }
     scrollPerClick = 250 +imagePadding;
}

const createParamasForDetailsPage = function(id) {
    let bookID = id;
    let params = new URLSearchParams();
    console.log(params);
    params.append('bookid', bookID);
    let url = 'bookDetails.html?' + params.toString();
    location.href = url;
    
  };
scrollToLeftCarouselButton.addEventListener('click', function(){
    console.log('stanga')
    sliderScrollLeft();
})
scrollToRightCarouselButton.addEventListener('click', function(){
    console.log('dreapta')
    sliderScrollRight();
})