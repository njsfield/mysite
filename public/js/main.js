/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	// Fetches base sass file to build style.css file to /public
	__webpack_require__(3);
	// Fetches base js file to build app.js file to /public

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/* Import Custom Library */
	var _require = __webpack_require__(2),
	    toggleClass = _require.toggleClass,
	    disableElt = _require.disableElt,
	    enableElt = _require.enableElt,
	    clearHTML = _require.clearHTML,
	    setHTML = _require.setHTML,
	    displayElt = _require.displayElt,
	    hideElt = _require.hideElt,
	    setAttr = _require.setAttr,
	    createRawElt = _require.createRawElt,
	    isHidden = _require.isHidden,
	    elt = _require.elt,
	    onClick = _require.onClick,
	    stopE = _require.stopE,
	    stealClass = _require.stealClass,
	    setEltValue = _require.setEltValue,
	    toggleElts = _require.toggleElts,
	    getReq = _require.getReq,
	    postReq = _require.postReq,
	    retrieveFile = _require.retrieveFile;

	// Sanitize URI


	var _require2 = __webpack_require__(7),
	    sanitizeURI = _require2.sanitizeURI;

	/** Dom Elements **/

	// Buttons


	var featureImgBtn = elt('.edit__feature-image-btn');
	var addImgBtn = elt('.edit__add-image-btn');
	var backBtn = elt('.images__back-btn');
	var uploadBtn = elt('.images__upload-btn');
	var selectBtn = elt('.images__select-btn');
	var previewBtn = elt('.edit__preview-btn');
	var clearImgbtn = elt('.edit__clear-image-btn');

	// Feature Image
	var featureImgInputElt = elt('.edit__feature-image-input');
	var featureImgOutputElt = elt('.edit__feature-image-output');

	// Gallery
	var overlayElt = elt('.images');
	var galleryElt = elt('.images__gallery');
	var titleElt = elt('.images__selected-title');

	// Post Body
	var postBodyElt = elt('.edit__post-body');
	var postBodyOutputElt = elt('.edit__post-body-output');

	/** Helpers **/

	// enableTitleElt
	var setTitleElt = function setTitleElt(image) {
	  getReq('/images?imageurl=' + image, function (data) {
	    if (data) {
	      setEltValue(titleElt, JSON.parse(data).imagetitle);
	      displayElt(titleElt);
	    }
	  });
	};

	// Delete Elt
	var deleteImg = function deleteImg(image, cb) {
	  var payload = JSON.stringify({ item: 'image', imageurl: image });
	  postReq('/delete', payload, function (data) {
	    cb();
	  });
	};

	// Build Images
	var buildGallery = function buildGallery(fromGallery) {
	  var selectedClass = 'images__image--selected';
	  getReq('/images', function (raw) {
	    var images = JSON.parse(raw).images;
	    images.forEach(function (image) {
	      var imageElt = createRawElt('<span class="images__image" style="background-image: url(/images/' + image + ')" path="' + image + '"></span>');
	      onClick(imageElt, function () {
	        stealClass(imageElt, selectedClass);
	        enableElt(selectBtn);
	        setTitleElt(image);
	      });
	      var deleteElt = createRawElt('<span class="images__delete" path="' + image + '"></span>');
	      onClick(deleteElt, function () {
	        deleteImg(image, function () {
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
	featureImgBtn.addEventListener('click', function (e) {
	  stopE(e);
	  setAttr(selectBtn, 'outputMainImage', 'true');
	  toggleClass(overlayElt, 'images--hidden');
	  clearHTML(galleryElt);
	  buildGallery();
	});

	// Add Image Button
	addImgBtn.addEventListener('click', function (e) {
	  stopE(e);
	  setAttr(selectBtn, 'outputMainImage', '');
	  toggleClass(overlayElt, 'images--hidden');
	  clearHTML(galleryElt);
	  buildGallery();
	});

	// Back Button
	backBtn.addEventListener('click', function (e) {
	  stopE(e);
	  toggleClass(overlayElt, 'images--hidden');
	});

	// Upload Button
	uploadBtn.addEventListener('change', function (e) {
	  retrieveFile(e, function (file) {
	    var name = sanitizeURI(file.name);
	    postReq('/addimage?name=' + name, file.raw, function (response) {
	      clearHTML(galleryElt);
	      buildGallery();
	      uploadBtn.value = '';
	    });
	  });
	}, false);

	// Select Image
	selectBtn.addEventListener('click', function (e) {
	  stopE(e);
	  var path = elt('.images__image--selected').getAttribute('path');
	  if (selectBtn.getAttribute('outputMainImage')) {
	    setAttr(featureImgInputElt, 'value', path);
	    setAttr(featureImgOutputElt, 'src', '/images/' + path);
	  } else {
	    postBodyElt.value = postBodyElt.value + ' ![' + titleElt.value + '](/images/' + path + ')';
	  }
	  disableElt(selectBtn);
	  toggleClass(overlayElt, 'images--hidden');
	});

	// Preview Button
	previewBtn.addEventListener('click', function (e) {
	  stopE(e);
	  postReq('/marked', postBodyElt.value, function (htmlString) {
	    setHTML(postBodyOutputElt, JSON.parse(htmlString).marked);
	    toggleElts(postBodyOutputElt, postBodyElt, isHidden(postBodyOutputElt));
	  });
	});

	// Output body
	postBodyOutputElt.addEventListener('click', function (e) {
	  toggleElts(postBodyOutputElt, postBodyElt, isHidden(postBodyOutputElt));
	});

	// Selected Title
	titleElt.addEventListener('focusout', function (e) {
	  postReq('/images', JSON.stringify({
	    imagetitle: titleElt.value,
	    imageurl: elt('.images__image--selected').getAttribute('path')
	  }), function (title) {
	    setEltValue(titleElt, title);
	  });
	});

	// Clear Image btn
	clearImgbtn.addEventListener('click', function (e) {
	  stopE(e);
	  setAttr(featureImgInputElt, 'value', '');
	  setAttr(featureImgOutputElt, 'src', '');
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var toggleClass = function toggleClass(elt, className) {
	  return [].concat(_toConsumableArray(elt.classList)).includes(className) ? removeClass(elt, className) : addClass(elt, className);
	};

	// Toggle Disabled
	var disableElt = function disableElt(elt) {
	  elt.disabled = true;
	};

	// Toggle Disabled
	var enableElt = function enableElt(elt) {
	  elt.disabled = false;
	};

	// clearHTML
	var clearHTML = function clearHTML(elt) {
	  elt.innerHTML = '';
	};

	// setHTML
	var setHTML = function setHTML(elt, html) {
	  elt.innerHTML = html;
	};

	// Display elt
	var displayElt = function displayElt(elt) {
	  elt.style.display = 'block';
	};

	// Hide elt
	var hideElt = function hideElt(elt) {
	  elt.style.display = 'none';
	};

	// Set className
	var addClass = function addClass(elt, className) {
	  elt.classList.add(className);
	};

	// remove className
	var removeClass = function removeClass(elt, className) {
	  elt.classList.remove(className);
	};

	// set Attribute
	var setAttr = function setAttr(elt, attr, val) {
	  elt.setAttribute(attr, val);
	};

	// Create raw elt from str
	var createRawElt = function createRawElt(str) {
	  var elt = document.createElement('span');
	  elt.innerHTML = str;
	  return elt.children[0];
	};

	// Check if hidden
	var isHidden = function isHidden(elt) {
	  return elt.style.display === 'none';
	};

	// querySelector
	var elt = function elt(_elt) {
	  return document.querySelector(_elt);
	};

	// on Click
	var onClick = function onClick(elt, func) {
	  elt.addEventListener('click', func);
	};

	// for Each Elt
	var forEachElt = function forEachElt(elts, func) {
	  Array.prototype.forEach.call(elts, func);
	};

	// get parent Elt
	var parentElt = function parentElt(elt) {
	  return elt.parentElement;
	};

	// prevent event default
	var stopE = function stopE(e) {
	  return e.preventDefault();
	};

	// stealClass
	var stealClass = function stealClass(elt, className) {
	  forEachElt(parentElt(elt).children, function (child) {
	    return removeClass(child, className);
	  });
	  addClass(elt, className);
	};

	// set value
	var setEltValue = function setEltValue(elt, value) {
	  elt.value = value;
	};

	// Elt toggle
	var toggleElts = function toggleElts(elt1, elt2, bool) {
	  bool ? displayElt(elt1) : displayElt(elt2);
	  bool ? hideElt(elt2) : hideElt(elt1);
	};

	// get Request
	var getReq = function getReq(path, cb) {
	  var xhr = new XMLHttpRequest();
	  xhr.addEventListener('load', function (data) {
	    cb(xhr.responseText);
	  });
	  xhr.open('get', path);
	  xhr.send();
	};

	// post Request
	var postReq = function postReq(path, payload, cb) {
	  var xhr = new XMLHttpRequest();
	  xhr.addEventListener('load', function (data) {
	    cb(xhr.responseText);
	  });
	  xhr.addEventListener('error', function (error) {
	    cb(error);
	  });
	  xhr.open('post', path);
	  xhr.send(payload);
	};

	// Retrieve File
	var retrieveFile = function retrieveFile(evt, cb) {
	  var files = evt.target.files;
	  var f = files[0];
	  var reader = new FileReader();
	  reader.onload = function (raw) {
	    var result = raw.target.result;
	    cb({ name: f.name, raw: result });
	  };
	  reader.readAsDataURL(f);
	};

	module.exports = {
	  toggleClass: toggleClass,
	  disableElt: disableElt,
	  enableElt: enableElt,
	  clearHTML: clearHTML,
	  setHTML: setHTML,
	  displayElt: displayElt,
	  hideElt: hideElt,
	  addClass: addClass,
	  removeClass: removeClass,
	  setAttr: setAttr,
	  createRawElt: createRawElt,
	  isHidden: isHidden,
	  elt: elt,
	  onClick: onClick,
	  forEachElt: forEachElt,
	  parentElt: parentElt,
	  stopE: stopE,
	  stealClass: stealClass,
	  setEltValue: setEltValue,
	  toggleElts: toggleElts,
	  getReq: getReq,
	  postReq: postReq,
	  retrieveFile: retrieveFile
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	'use strict';

	// Convert URIs. E.G 'Welcome To "My Site"' becomes 'welcome-to-%22my-site%22'
	var sanitizeURI = function sanitizeURI(uri) {
	  return encodeURIComponent(uri.toLowerCase().replace(/\s/g, '-'));
	};

	// Takes uri, query function (e.g. getImages), a key to check, and calls back an incremented (if necessary) uri
	var prepareURIForDb = function prepareURIForDb(uri, queryFunc, key, cb) {
	  queryFunc(function (err, data) {
	    if (err) cb(err);
	    data = data ? data.map(function (data) {
	      return data[key];
	    }) : [];
	    // Check URI function
	    var existingURI = function existingURI(currentUri) {
	      return data.indexOf(currentUri) > -1;
	    };
	    // While found, increments URI (e.g. 'image1.jpg' or 'New Post2')
	    while (existingURI(uri)) {
	      if (/\d(?=\.)|(\d$)/.test(uri)) {
	        uri = uri.replace(/\d(?=\.)|(\d$)/, function (match) {
	          return '' + ++match;
	        });
	      } else if (/\./.test(uri)) {
	        uri = uri.replace(/\./, '1.');
	      } else {
	        uri = uri + '1';
	      }
	    }
	    cb(null, uri);
	  });
	};

	module.exports = {
	  sanitizeURI: sanitizeURI,
	  prepareURIForDb: prepareURIForDb
	};

/***/ }
/******/ ]);