(function () {
  // Edit Form elts
  var imageBtn = document.querySelector('.edit__feature-image-btn');
  var clearImageBtn = document.querySelector('.edit__clear-image-btn');
  var addImageBtn = document.querySelector('.edit__add-image-btn');
  var previewBtn = document.querySelector('.edit__preview-btn');
  var imageInput = document.querySelector('.edit__feature-image-input');
  var imageOutput = document.querySelector('.edit__feature-image-output');
  var postBody = document.querySelector('.edit__post-body');
  var outputBody = document.querySelector('.edit__post-body-output');

  // Image Container elts
  var imagesContainer = document.querySelector('.images');
  var gallery = document.querySelector('.images__gallery');
  var selectedTitle = document.querySelector('.images__selected-title');
  var backBtn = document.querySelector('.images__back-btn');
  var selectBtn = document.querySelector('.images__select-btn');
  var uploadBtn = document.querySelector('.images__upload-btn');

  /* Helpers */

  // Toggle Elt className
  const toggleClass = (elt, className) => ([...elt.classList].includes(className)) ? removeClass(elt, className) : addClass(elt, className);

  // Toggle Disabled
  const disableElt = (elt) => { elt.disabled = true; };

  // Toggle Disabled
  const enableElt = (elt) => { elt.disabled = false; };

  // clearHTML
  const clearHTML = (elt) => { elt.innerHTML = ''; };

  // setHTML
  const setHTML = (elt, html) => { elt.innerHTML = html; };

  // Display elt
  const displayElt = (elt) => { elt.style.display = 'block'; };

  // Hide elt
  const hideElt = (elt) => { elt.style.display = 'none'; };

  // Set className
  const addClass = (elt, className) => { elt.classList.add(className); };

  // remove className
  const removeClass = (elt, className) => { elt.classList.remove(className); };

  // set Attribute
  const setAttr = (elt, attr, val) => { elt[attr] = val; };

  // set Attribute
  const getAttr = (elt, attr) => { elt.getAttribute(attr); };

  // Create raw elt from str
  const createRawElt = (str) => {
    let elt = document.createElement('span');
    elt.innerHTML = str;
    return elt.children[0];
  };

  // Check if hidden
  const isHidden = (elt) => elt.style.display === 'none';

  // Check if visible
  const isVisible = (elt) => elt.style.display !== 'none';

  // querySelector
  const elt = (elt) => document.querySelector(elt);

  // on Click
  const onClick = (elt, func) => { elt.addEventListener('click', func); };

  // for Each Elt
  const forEachElt = (elts, func) => { Array.prototype.forEach.call(elts, func); };

  // get parent Elt
  const parentElt = (elt) => elt.parentElement;

  // prevent event default
  const stopE = (e) => e.preventDefault();

  // stealClass
  const stealClass = (elt, className) => {
    forEachElt(parentElt(elt).children, child => removeClass(child, className));
    addClass(elt, className);
  };

  // set value
  const setEltValue = (elt, value) => { elt.value = value; };

  // Elt toggle
  const toggleElts = (elt1, elt2, bool) => {
    bool ? displayElt(elt1) : displayElt(elt2);
    bool ? hideElt(elt2) : hideElt(elt1);
  };

  // Request
  const serverRequest = (path, payload, cb) => {
    let method = 'post';
    if (arguments.length === 2) {
      cb = payload;
      payload = undefined;
      method = 'get';
    }
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (data) => {
      cb(xhr.responseText);
    });
    xhr.open(method, path);
    xhr.send(payload);
  };

  // Retrieve File
  const retrieveFile = (evt, cb) => {
    let files = evt.target.files;
    let f = files[0];
    let reader = new FileReader();
    reader.onload = (raw) => {
      cb({name: f.name, raw: raw.target.result});
    };
    reader.readAsDataURL(f);
  };

  // Build Images
  const buildGallery = (fromGallery) => {
    if (!fromGallery) {
      toggleClass(elt('.images'), 'images--hidden');
    }
    clearHTML(elt('.images__gallery'));
    serverRequest('/images', (raw) => {
      JSON.parse(raw).images.forEach((image) => {
        let imageElt = createRawElt(`<span class="images__image" style="background-image: url(/images/${image})" path="${image}"></span>`);
        onClick(imageElt, () => {
          stealClass(imageElt, 'images__image--selected');
          enableElt(elt('.images__select-btn'));
          serverRequest('/image?imageurl=' + image, (data) => {
            if (data) {
              setEltValue(elt('.images__selected-title'), JSON.parse(data).imagetitle);
              displayElt(elt('.images__selected-title'));
            }
          });
        });
        let imageDelete = createRawElt(`<span class="images__delete" path="${image}"></span>`);
        onClick(imageDelete, 'click', () => {
          serverRequest('/delete', JSON.stringify({
            item: 'image',
            imageurl: image
          }), (data) => {
            buildGallery(true);
          });
        });
        imageElt.appendChild(imageDelete);
        elt('.images__gallery').appendChild(imageElt);
      });
    });
  };

  /** Events **/

  // Image Button on click
  elt('.edit__feature-image-btn').addEventListener('click', (e) => {
    stopE(e);
    setAttr(elt('.images__select-btn'), 'outputMainImage', 'true');
    buildGallery();
  });

  // Add Image Button on click
  elt('.edit__add-image-btn').addEventListener('click', (e) => {
    stopE(e);
    setAttr(elt('.images__select-btn'), 'outputMainImage', '');
    buildGallery();
  });

  // Back Button
  elt('.images__back-btn').addEventListener('click', (e) => {
    stopE(e);
    toggleClass(elt('.images'), 'images--hidden');
  });

  // Upload Button
  elt('.images__upload-btn').addEventListener('change', (e) => {
    retrieveFile(e, (file) => {
      serverRequest('/images?name=' + file.name, file.raw, function () {
        buildGallery(true);
      });
    });
  }, false);

  // Select Image
  elt('.images__select-btn').addEventListener('click', (e) => {
    stopE(e);
    let path = elt('.images__image--selected').getAttribute('path');
    if (elt('images__select-btn').getAttribute('outputMainImage')) {
      setAttr(elt('.edit__feature-image-output'), 'value', path);
      setAttr(elt('.edit__feature-image-output'), 'src', '/images/' + path);
    } else {
      elt('.edit__post-body').value = `${elt('.edit__post-body').value} ![${elt('.images__selected-title').value}](/images/${path})`;
    }
    disableElt('.images__select-btn');
    toggleClass(elt('.images'), 'images--hidden');
  });

  // Preview Button
  elt('.edit__preview-btn').addEventListener('click', (e) => {
    stopE(e);
    serverRequest('/marked', elt('.edit__post-body').value, (htmlString) => {
      setHTML(elt('.edit__post-body-output'), JSON.parse(htmlString).marked);
      toggleElts(elt('.edit__post-body-output'), elt('.edit__post-body'), isHidden(elt('.edit__post-body-output')));
    });
  });

  // Output body
  elt('.edit__post-body-output').addEventListener('click', (e) => {
    toggleElts(elt('.edit__post-body-output'), elt('.edit__post-body'), isHidden(elt('.edit__post-body-output')));
  });

  // Selected Title
  elt('.images__selected-title').addEventListener('focusout', (e) => {
    serverRequest('/image', JSON.stringify({
      imagetitle: elt('.images__selected-title').value,
      imageurl: getAttr(elt('.images__image--selected'), 'path')
    }), (title) => {
      setEltValue(elt('.images__selected-title'), title);
    });
  });

  // Clear Image btn
  elt('.edit__clear-image-btn').addEventListener('click', (e) => {
    stopE(e);
    setAttr(elt('.edit__feature-image-input'), 'value', '');
    setAttr(elt('.edit__feature-image-output'), 'src', '');
  });
})();
