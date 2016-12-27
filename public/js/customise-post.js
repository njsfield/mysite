(function () {
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
  const setAttr = (elt, attr, val) => { elt.setAttribute(attr, val); };

  // Create raw elt from str
  const createRawElt = (str) => {
    let elt = document.createElement('span');
    elt.innerHTML = str;
    return elt.children[0];
  };

  // Check if hidden
  const isHidden = (elt) => elt.style.display === 'none';

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

  // get Request
  const getReq = (path, cb) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (data) => {
      cb(xhr.responseText);
    });
    xhr.open('get', path);
    xhr.send();
  };

  // post Request
  const postReq = (path, payload, cb) => {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (data) => {
      cb(xhr.responseText);
    });
    xhr.open('post', path);
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

  // Buttons

  const featureImgBtn = elt('.edit__feature-image-btn');
  const addImgBtn = elt('.edit__add-image-btn');
  const backBtn = elt('.images__back-btn');
  const uploadBtn = elt('.images__upload-btn');
  const selectBtn = elt('.images__select-btn');
  const previewBtn = elt('.edit__preview-btn');
  const clearImgbtn = elt('.edit__clear-image-btn');

  const featureImgInputElt = elt('.edit__feature-image-input');
  const featureImgOutpuElt = elt('.edit__feature-image-output');
  const overlayElt = elt('.images');
  const galleryElt = elt('.images__gallery');
  const titleElt = elt('.images__selected-title');

  const postBodyElt = elt('.edit__post-body');
  const postBodyOutputElt = elt('.edit__post-body-output');

  // enableTitleElt
  const setTitleElt = (image) => {
    getReq(`/image?imageurl=${image}`, (data) => {
      if (data) {
        setEltValue(titleElt, JSON.parse(data).imagetitle);
        displayElt(titleElt);
      }
    });
  };

  // Delete Elt
  const deleteImg = (image, cb) => {
    let payload = JSON.stringify({item: 'image', imageurl: image});
    postReq('/delete', payload, (data) => {
      cb();
    });
  };

  // Build Images
  const buildGallery = (fromGallery) => {
    let selectedClass = 'images__image--selected';
    getReq('/images', (raw) => {
      let images = JSON.parse(raw).images;
      images.forEach((image) => {
        let imageElt = createRawElt(`<span class="images__image" style="background-image: url(/images/${image})" path="${image}"></span>`);
        onClick(imageElt, () => {
          stealClass(imageElt, selectedClass);
          enableElt(selectBtn);
          setTitleElt(image);
        });
        let deleteElt = createRawElt(`<span class="images__delete" path="${image}"></span>`);
        onClick(deleteElt, () => {
          deleteImg(image, () => {
            hideElt(titleElt);
            clearHTML(galleryElt);
            buildGallery();
          });
        });
        imageElt.appendChild(deleteElt);
        galleryElt.appendChild(imageElt);
      });
    });
  };

  /** Events **/

  // Image Button on click
  featureImgBtn.addEventListener('click', (e) => {
    stopE(e);
    setAttr(selectBtn, 'outputMainImage', 'true');
    toggleClass(overlayElt, 'images--hidden');
    clearHTML(galleryElt);
    buildGallery();
  });

  // Add Image Button on click
  addImgBtn.addEventListener('click', (e) => {
    stopE(e);
    setAttr(selectBtn, 'outputMainImage', '');
    toggleClass(overlayElt, 'images--hidden');
    clearHTML(galleryElt);
    buildGallery();
  });

  // Back Button
  backBtn.addEventListener('click', (e) => {
    stopE(e);
    toggleClass(overlayElt, 'images--hidden');
  });

  // Upload Button
  uploadBtn.addEventListener('change', (e) => {
    retrieveFile(e, (file) => {
      postReq(`/images?name=${file.name}`, file.raw, () => {
        clearHTML(galleryElt);
        buildGallery();
      });
    });
  }, false);

  // Select Image
  selectBtn.addEventListener('click', (e) => {
    stopE(e);
    let path = elt('.images__image--selected').getAttribute('path');
    if (selectBtn.getAttribute('outputMainImage')) {
      setAttr(featureImgOutpuElt, 'value', path);
      setAttr(featureImgOutpuElt, 'src', `/images/${path}`);
    } else {
      postBodyElt.value = `${postBodyElt.value} ![${titleElt.value}](/images/${path})`;
    }
    disableElt(selectBtn);
    toggleClass(overlayElt, 'images--hidden');
  });

  // Preview Button
  previewBtn.addEventListener('click', (e) => {
    stopE(e);
    postReq('/marked', postBodyElt.value, (htmlString) => {
      setHTML(postBodyOutputElt, JSON.parse(htmlString).marked);
      toggleElts(postBodyOutputElt, postBodyElt, isHidden(postBodyOutputElt));
    });
  });

  // Output body
  postBodyOutputElt.addEventListener('click', (e) => {
    toggleElts(postBodyOutputElt, postBodyElt, isHidden(postBodyOutputElt));
  });

  // Selected Title
  titleElt.addEventListener('focusout', (e) => {
    postReq('/image', JSON.stringify({
      imagetitle: titleElt.value,
      imageurl: elt('.images__image--selected').getAttribute('path')
    }), (title) => {
      setEltValue(titleElt, title);
    });
  });

  // Clear Image btn
  clearImgbtn.addEventListener('click', (e) => {
    stopE(e);
    setAttr(featureImgInputElt, 'value', '');
    setAttr(featureImgOutpuElt, 'src', '');
  });
})();
