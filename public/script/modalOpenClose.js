
    let modal_container = document.createElement("div");
    modal_container.className = "modal-container";

    let modal = document.createElement("div");
    modal.className = "modal";

    let modal_header = document.createElement("div");
    modal_header.className = "modal-header";

    let modal_title = document.createElement('h2');
    
    let modal_close_button = document.createElement("button");
    modal_close_button.className = "close-modal";
    modal_close_button.innerHTML = "&#10006";

    modal_header.appendChild(modal_title);
    modal_header.appendChild(modal_close_button);

    modal.appendChild(modal_header);
    

    modal_container.appendChild(modal);
    document.getElementsByTagName("BODY")[0].appendChild(modal_container);
    
    

    
        
    modal_close_button.addEventListener('click', function(){
    
        modal_container.style.display = "none";
    })

    window.onclick = function(e){
        if(e.target == modal_container)
        {
            modal_container.style.display = "none";
        }

    
}
function createModal(contentOfModal, title){
    modal_title.innerHTML = title;
    if(modal.children[1])
    {
        modal.children[1].replaceWith(contentOfModal);
        
        let openModal=()=> {modal_container.style.display = "flex"};openModal();
    }
    else
    {
        modal.appendChild(contentOfModal);
        let openModal=()=> {modal_container.style.display = "flex"};openModal();
        
    }
    
    
        
}
