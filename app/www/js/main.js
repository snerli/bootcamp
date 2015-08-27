requirejs.config({

  paths: {
    jquery: "../libs/jquery/dist/jquery"
  },

  config: {
    "app-amd/i18n": {
      locale: 'fr-fr'
    }
  },

  shim: {
    jquery: {
      exports: '$'
    }
  }

});


// path below is relative to main.js
//requirejs(['app-amd/app']);
requirejs(['app-amd/fileUpload'], function(fileUploader) {
  fileUploader.upl("#hey");
});
