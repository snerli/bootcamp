define(['jquery'], function() {

  function successFn(xhr) {
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState === 4 && xhr.status !== 200) {
        console.log("error occurred");
        console.dir(xhr);
      }
      if (xhr.readyState === 4 && xhr.status === 200) {
        var parser = new DOMParser();
        console.log(parser.parseFromString(xhr.responseText, "application/xml"));
      }
    });
  };

  return {

  upl: function(selector) {
    var selectorElem = $("<div>");
    var label = $("<label>Select File:</label>");
    var uploadButton = $("<input type='file' multiple id='uploadFile'> <button id='upButton' type='button'>Upload</button>");
    var breakLine = $("<br>");
    var uploadProgress = $("<progress id='uploadProgress' value='0' max='0'></progress>");
    var form = $("<form>");

    selectorElem.append(label);
    selectorElem.append(uploadButton);
    selectorElem.append(breakLine);
    selectorElem.append(uploadProgress);

    var newSel = $(selector).append(selectorElem);

    $("body").append(newSel);

    console.dir(newSel);

    var uploadButton = document.getElementById("upButton");
    uploadButton.addEventListener("click", function(e) {
      var fileInput = document.getElementById("uploadFile");
      var fd = new FormData();
      for (var x=0; x<fileInput.files.length; x++) {
        fd.append("file-" + x, fileInput.files[x]);
      }
      var xhr = new XMLHttpRequest();
      successFn(xhr);
      console.dir(xhr);

      xhr.upload.addEventListener("progress", function(e) {
        var uploadProgress = document.getElementById("uploadProgress");
        uploadProgress.setAttribute("max", e.total);
        uploadProgress.setAttribute("value", e.loaded);
      });

      document.addEventListener("progress", function(e) {
        console.log("doc");
      });

      window.addEventListener("progress", function(e) {
        console.log("doc");
      });

      xhr.open("POST", "/api/upload");
      xhr.send(fd);
    });

  }

};
  console.log("Hello");
  //createElem("body");

});
