const changeProfilePictureModal = function () {
    let modal_content = document.createElement("div");
    modal_content.classList.add("change-profile-picture-modal");
  
    let changeProfilePictureForm = document.createElement("form");
    changeProfilePictureForm.classList.add("change-profile-picture-form");
   
    let changeProfilePictureSubmit = document.createElement("button");
    changeProfilePictureSubmit.type = "submit";
    changeProfilePictureSubmit.innerText = "Submit";
    changeProfilePictureSubmit.classList.add("change-profile-picture-submit");
  
    let pictureThumbnailURL = document.createElement("input");
    pictureThumbnailURL.classList.add("change-profile-picture-thumbnail-url");
    pictureThumbnailURL.placeholder = "Image Name";
    pictureThumbnailURL.readOnly = true;
  
    let containerOfImagePreviewAndUploadImage = document.createElement('div');
    containerOfImagePreviewAndUploadImage.className = 'image-preview-upload-container';
  
    let imagePreviewOfProfilePicture = document.createElement('img');
    imagePreviewOfProfilePicture.className = 'image-preview-profile-picture';
    imagePreviewOfProfilePicture.src = 'https://p.kindpng.com/picc/s/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png';
    imagePreviewOfProfilePicture.setAttribute ( 'onerror','this.src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLP_DmTUnuJTcG1WvRL4crrkRX4uFXlc8tecCMc3raQPkbW2Yby-04uMQa6A1Zxb7gXAw&usqp=CAU"; ');
  
    let uploadImageContainer = document.createElement('label');
    uploadImageContainer.className = 'upload-image-container'
    uploadImageContainer.innerText = 'Upload';
  
    let uploadImage = document.createElement('input')
    uploadImage.type  = 'file';
    uploadImage.required = 'true';
    uploadImage.accept = ".jpg";
    uploadImage.className = 'upload-profile-picture-input'
    uploadImage.addEventListener("change", function(){
  
      if (this.files && this.files[0]) {
          pictureThumbnailURL.value = this.files[0].name;
          var FR= new FileReader();
      
            FR.addEventListener("load", function(e) {
                imagePreviewOfProfilePicture.src = e.target.result;
               
            }); 
            
            FR.readAsDataURL( this.files[0] );
        }
        
        
      })
  
   
  
    pictureThumbnailURL.addEventListener('input', function(){
      imagePreviewOfProfilePicture.src = pictureThumbnailURL.value;
      
    })
  
    
   

    
   
    changeProfilePictureForm.appendChild(pictureThumbnailURL);
  
    uploadImageContainer.appendChild(uploadImage);
    containerOfImagePreviewAndUploadImage.appendChild(imagePreviewOfProfilePicture);
    containerOfImagePreviewAndUploadImage.appendChild(uploadImageContainer);
    changeProfilePictureForm.appendChild(containerOfImagePreviewAndUploadImage);
  
    changeProfilePictureForm.appendChild(changeProfilePictureSubmit);
  
    modal_content.appendChild(changeProfilePictureForm);
  
    return modal_content;
  };
  