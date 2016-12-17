(function () {
  var previewBtn = document.querySelector('.edit__preview-button');
  var postBody = document.querySelector('.edit__post-body');
  var outputBody = document.querySelector('.edit__post-body-output');

  previewBtn.addEventListener('click', function (e) {
    e.preventDefault();
    requestMarked(postBody.value, function (htmlString) {
      outputBody.innerHTML = JSON.parse(htmlString).marked;
      toggleElts(outputBody, postBody);
    });
  });

  outputBody.addEventListener('click', function (e) {
    toggleElts(outputBody, postBody);
  });

  function toggleElts (elt1, elt2) {
    if (elt1.style.display != 'block') {
      elt1.style.display = 'block';
      elt2.style.display = 'none';
    } else {
      elt2.style.display = 'block';
      elt1.style.display = 'none';
    }
  }

  // Make Request
  function requestMarked (value, cb) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      cb(xhr.responseText);
    });

    xhr.open('post', '/marked');
    xhr.send(value);
  }
})();
