/* Import Custom Library */
const { toggleClass,
 disableElt,
enableElt,
clearHTML,
setHTML,
displayElt,
hideElt,
setAttr,
createRawElt,
isHidden,
elt,
onClick,
stopE,
stealClass,
setEltValue,
toggleElts,
getReq,
postReq,
retrieveFile } = require('../helpers/dom-helpers.js');

/** Dom Elements **/

// Buttons
const featureImgBtn = elt('.edit__feature-image-btn');
const addImgBtn = elt('.edit__add-image-btn');
const backBtn = elt('.images__back-btn');
const uploadBtn = elt('.images__upload-btn');
const selectBtn = elt('.images__select-btn');
const previewBtn = elt('.edit__preview-btn');
const clearImgbtn = elt('.edit__clear-image-btn');

// Feature Image
const featureImgInputElt = elt('.edit__feature-image-input');
const featureImgOutputElt = elt('.edit__feature-image-output');

// Gallery
const overlayElt = elt('.images');
const galleryElt = elt('.images__gallery');
const titleElt = elt('.images__selected-title');

// Post Body
const postBodyElt = elt('.edit__post-body');
const postBodyOutputElt = elt('.edit__post-body-output');

/** Helpers **/

// enableTitleElt
const setTitleElt = (image) => {
  getReq(`/images?imageurl=${image}`, (data) => {
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

// Image Button
featureImgBtn.addEventListener('click', (e) => {
  stopE(e);
  setAttr(selectBtn, 'outputMainImage', 'true');
  toggleClass(overlayElt, 'images--hidden');
  clearHTML(galleryElt);
  buildGallery();
});

// Add Image Button
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
    postReq(`/addimage?name=${file.name}`, file.raw, (response) => {
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
    setAttr(featureImgInputElt, 'value', path);
    setAttr(featureImgOutputElt, 'src', `/images/${path}`);
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
  postReq('/images', JSON.stringify({
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
  setAttr(featureImgOutputElt, 'src', '');
});
