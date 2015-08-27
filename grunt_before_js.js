module.exports = function(grunt) {

  "use strict";

  var
    path = require("path"),
    sassFolder = path.join("assets", "sass"),
    wwwFolder = path.join("app", "www"),
    cssFolder = path.join(wwwFolder, "css"),
    cssMinFiles = {},
    cssCompressFiles = {},
    sassFiles = {};

  sassFiles[path.join(cssFolder, "site.css")] =
    path.join(sassFolder, "site.scss");

  cssMinFiles[path.join(cssFolder, "site.min.css")] =
    path.join(cssFolder, "site.css");

  cssCompressFiles[path.join(cssFolder, "site.min.gz.css")] =
    path.join(cssFolder, "site.min.css");

  grunt.initConfig({
    webServer: {
      port: 8089,
      rootFolder: wwwFolder
    },
    sass: {
      main: {
        options: {
          sourcemap: "none"
        },
        files: sassFiles
      }
    },
    cssmin: {
      main: {
        options: {
          keepSepcialComments:0, // not keep special comments, sourceMap - used by people to map minified file (or the preprocessed file) to the original source code
          sourceMap: false
        },
        files: cssMinFiles
      }
    },
    compress: {
      css: {
        options: {
          mode: 'gzip' // all browsers read gzip files
        },
        files: cssCompressFiles
      }
    },
    watch: {
      css: {
        files: path.join(sassFolder, "**", "*.scss"), // "app/www/css/**/*.css" ** = all sub folders
        tasks: ["sass", "cssmin", "compress:css"]
      }
    }
  });

  // load up the tasks
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-cssmin");

  // web-server task instead of default -
  grunt.registerTask("web-server", "start a web server", function() {

    var
      http = require("http"), // allows you to link to c++ binary, pass in func
      express = require("express"), // middleware, setup routing, handles url parameters, data that is posted on the body
      app = express(), // returning a func object. Invokes express()
      webServerConfig = grunt.config("webServer"); // var o = {a: "b"} o["a"]

    //this.async();
    // there can be only one async task running at a time
    // not needed because we are using watch which is async

    //setup route webserver, this handler will process the request
    app.use("/css", express.static(path.join(webServerConfig.rootFolder, "css"), {
      setHeaders: function(res, filePath) {
        res.setHeader("Content-Type", "text/css");
        if(/.gz.css$/.test(filePath)) {
          res.setHeader("Content-Encoding", "gzip");
        }
      }
    }));

    // If not first parameter provided, then it means it is default
    // If /css, then process the above request, then if everything else, then process
    // it the way as mentioned below
    app.use(express.static(webServerConfig.rootFolder));

    http.createServer(app).listen(webServerConfig.port, function() {
      console.log("web server running on port" + webServerConfig.port);
    });
  });

  // run a bunch of additional tasks in the below line (in the same order mentioned)
  grunt.registerTask("default", "start development environment", ["sass", "cssmin", "compress", "web-server", "watch"]);
};
