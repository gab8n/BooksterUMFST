
let openAnswer = document.querySelectorAll('.fa-arrow-down');
let closeAnswer = document.querySelectorAll('.fa-arrow-up');


openAnswer.forEach(element=>{
    element.addEventListener('click', function(){
        element.parentElement.parentElement.parentElement.children[1].classList.toggle('hidden-answer');
        element.classList.toggle('hidden-answer');
    })
});


closeAnswer.forEach(element=>{
    element.addEventListener('click', function(){
        element.parentElement.parentElement.classList.toggle('hidden-answer');
        element.parentElement.parentElement.parentElement.children[0].querySelector('i').classList.toggle('hidden-answer');
    })
});




