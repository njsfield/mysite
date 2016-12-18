(function () {
  // Edit Form elts
  var imageBtn = document.querySelector('.edit__feature-image-btn');
  var addImageBtn = document.querySelector('.edit__add-image-btn');
  var previewBtn = document.querySelector('.edit__preview-btn');
  var imageInput = document.querySelector('.edit__feature-image-input');
  var outputImage = document.querySelector('.edit__feature-image-output');
  var postBody = document.querySelector('.edit__post-body');
  var outputBody = document.querySelector('.edit__post-body-output');

  // Image Container elts
  var imagesContainer = document.querySelector('.images');
  var gallery = document.querySelector('.images__gallery');
  var selectedTitle = document.querySelector('.images__selected-title');
  var backBtn = document.querySelector('.images__back-btn');
  var selectBtn = document.querySelector('.images__select-btn');
  var uploadBtn = document.querySelector('.images__upload-btn');

  // Output elt

  var outputMainImage = false;

  /* Helpers */

  // Toggle Elt className
  function toggleElt (elt, className) {
    if (elt.className.indexOf(className) > -1) {
      elt.classList.remove(className);
    } else {
      elt.classList.add(className);
    }
  }

  // Toggle Disabled
  function disableElt (elt) {
    elt.disabled = true;
  }
  // Toggle Disabled
  function enableElt (elt) {
    elt.disabled = false;
  }

  // clearContent
  function clearContent (elt) {
    elt.innerHTML = '';
  }

  // Display elt
  function displayElt (elt) {
    elt.style.display = 'block';
  }

  // Inject Images
  function injectImages (images, elt, className, selectedClassName, eventFunc) {
    // Add array method
    var DOMForEach = Array.prototype.forEach;

    images.forEach(function (image) {
      var imageElt = document.createElement('span');
      imageElt.style.backgroundImage = 'url(/images/' + image + ')';
      imageElt.className = className;
      imageElt.setAttribute('path', image);
      imageElt.addEventListener('click', function () {
        DOMForEach.call(elt.children, function (elt) {
          elt.classList.remove(selectedClassName);
        });
        imageElt.classList.add(selectedClassName);
        eventFunc(image);
      });
      elt.appendChild(imageElt);
    });
  }

  // Request
  function serverRequest (path, payload, cb) {
    var method = 'post';
    // If payload
    if (arguments.length === 2) {
      cb = payload;
      payload = undefined;
      method = 'get';
    }
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function (data) {
      cb(xhr.responseText);
    });
    xhr.open(method, path);
    xhr.send(payload);
  }

  // Retrieve File
  function retrieveFile (evt, cb) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function (raw) {
      cb({name: f.name, raw: raw.target.result});
    };
    reader.readAsDataURL(f);
  }

  // Elt toggle
  function toggleElts (elt1, elt2, bool) {
    if (bool) {
      elt1.style.display = 'block';
      elt2.style.display = 'none';
    } else {
      elt2.style.display = 'block';
      elt1.style.display = 'none';
    }
  }

  // Build Images
  function buildGallery (fromGallery) {
    var parentElt = imagesContainer;
    var elt = gallery;
    var imageClass = 'images__image';
    var imageSelectedClass = 'images__image--selected';

    var cbFunc = function (imageurl) {
      enableElt(selectBtn);
      serverRequest('/image?imageurl=' + imageurl, function (data) {
        addTitleToElt(JSON.parse(data).imagetitle, selectedTitle);
        displayElt(selectedTitle);
      });
    };
    if (!fromGallery) {
      toggleElt(parentElt, 'images--hidden');
    }
    clearContent(elt);
    serverRequest('/images', function (raw) {
      injectImages(JSON.parse(raw).images, elt, imageClass, imageSelectedClass, cbFunc);
    });
  }

  // Add title
  function addTitleToElt (title, elt) {
    elt.value = title;
  }

  /** Events **/

  // Image Button on click
  imageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    outputMainImage = true;
    buildGallery();
  });

  // Add Image Button on click
  addImageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    outputMainImage = false;
    buildGallery();
  });

  // Back Button
  backBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleElt(imagesContainer, 'images--hidden');
  });

  // Upload Button
  uploadBtn.addEventListener('change', function (e) {
    retrieveFile(e, function (file) {
      serverRequest('/images?name=' + file.name, file.raw, function () {
        buildGallery(true);
      });
    });
  }, false);

  // Select Image
  selectBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var path = document.querySelector('.images__image--selected').getAttribute('path');
    if (outputMainImage) {
      imageInput.setAttribute('value', path);
      outputImage.setAttribute('src', '/images/' + path);
    } else {
      postBody.value = postBody.value + ' ![' + selectedTitle.value + '](/images/' + path + ')';
    }

    disableElt(selectBtn);
    toggleElt(imagesContainer, 'images--hidden');
  });

  // Preview Button
  previewBtn.addEventListener('click', function (e) {
    e.preventDefault();
    serverRequest('/marked', postBody.value, function (htmlString) {
      outputBody.innerHTML = JSON.parse(htmlString).marked;
      toggleElts(outputBody, postBody, outputBody.style.display === 'none');
    });
  });

  // Output body
  outputBody.addEventListener('click', function (e) {
    toggleElts(outputBody, postBody, outputBody.style.display === 'none');
  });

  // Selected Title
  selectedTitle.addEventListener('focusout', function (e) {
    serverRequest('/image', JSON.stringify({
      imagetite: selectedTitle.value,
      imageurl: document.querySelector('.images__image--selected').getAttribute('path')
    }), function (data) {
      console.log(data);
    });
  });
})();
