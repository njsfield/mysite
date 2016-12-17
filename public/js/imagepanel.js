(function () {
  var imageBtn = document.querySelector('.edit__image-button');
  var imagesContainer = document.querySelector('.images');
  var gallery = document.querySelector('.images__container');
  var backBtn = document.querySelector('.button__back');
  var selectBtn = document.querySelector('.button__select');
  var uploadBtn = document.querySelector('.upload');
  var imageInput = document.querySelector('.edit__image-input');
  var outputImage = document.querySelector('.edit__image');

  var XML = XMLHttpRequest;

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

  // Inject Images
  function injectImages (images, elt, className, selectedClassName, eventFunc) {
    images.forEach(function (image) {
      var imageElt = document.createElement('span');
      imageElt.style.backgroundImage = 'url(/images/' + image + ')';
      imageElt.className = className;
      imageElt.setAttribute('path', image);
      imageElt.addEventListener('click', function () {
        Array.prototype.forEach.call(elt.children, function (elt) {
          elt.classList.remove(selectedClassName);
        });
        imageElt.classList.add(selectedClassName);
        eventFunc();
      });
      elt.appendChild(imageElt);
    });
  }

  // Make request
  function fetchImages (cb) {
    var xhr = new XML();
    xhr.addEventListener('load', function (res) {
      cb(JSON.parse(res.target.responseText).images);
    });
    xhr.open('get', '/images');
    xhr.send();
  }

  // Image Button
  imageBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleElt(imagesContainer, 'images--hidden');
    clearContent(gallery);
    fetchImages(function (images) {
      injectImages(images, gallery, 'images__image', 'images__image--selected', enableElt.bind(null, selectBtn));
    });
  });

  // Back Button
  backBtn.addEventListener('click', function (e) {
    e.preventDefault();
    toggleElt(imagesContainer, 'images--hidden');
  });

  // Upload Button
  uploadBtn.addEventListener('change', function (e) {
    retrieveImage(e, function (file) {
      postImage(file, function () {
        clearContent(gallery);
        fetchImages(function (images) {
          injectImages(images, gallery, 'images__image', 'images__image--selected', enableElt.bind(null, selectBtn));
        });
      });
    });
  }, false);

  // Retrieve Image
  function retrieveImage (evt, cb) {
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();
    reader.onload = function (raw) {
      cb({name: f.name, raw: raw.target.result});
    };
    reader.readAsDataURL(f);
  }

  // Post image (file = {name: filename, raw: rawfile})
  function postImage (file, cb) {
    var xhr = new XML();
    xhr.addEventListener('load', function (data) {
      cb();
    });
    xhr.open('post', '/images?name=' + file.name);
    xhr.send(file.raw);
  }

  // Select Image
  selectBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var path = document.querySelector('.images__image--selected').getAttribute('path');
    imageInput.value = path;
    outputImage.setAttribute('src', '/images/' + path);
    disableElt(selectBtn);
    toggleElt(imagesContainer, 'images--hidden');
  });
})();
