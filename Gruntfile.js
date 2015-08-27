module.exports = function(grunt) {

  "use strict";

  var
    path = require("path"),
    sassFolder = path.join("assets", "sass"),
    wwwFolder = path.join("app", "www"),
    cssFolder = path.join(wwwFolder, "css"),

    libsFolder = path.join(wwwFolder, "libs"),
    jsFolder = path.join(wwwFolder, "js"),
    appJSFolder = path.join(jsFolder, "app"),


    cssMinFiles = {},
    cssCompressFiles = {},
    sassFiles = {},

    jsFiles = {},
    jsMinifyFiles = {},
    jsCompressFiles = {};

  sassFiles[path.join(cssFolder, "site.css")] =
    path.join(sassFolder, "site.scss");

  cssMinFiles[path.join(cssFolder, "site.min.css")] =
    path.join(cssFolder, "site.css");

  cssCompressFiles[path.join(cssFolder, "site.min.gz.css")] =
    path.join(cssFolder, "site.min.css");

    jsFiles[path.join(jsFolder, "site.js")] = [
      path.join(libsFolder, "jquery", "dist", "jquery.js"),
      path.join(appJSFolder, "init.js"),
      path.join(appJSFolder, "app.js")
    ];

    jsMinifyFiles[path.join(jsFolder, "site.min.js")] =
      path.join(jsFolder, "site.js");

    jsCompressFiles[path.join(jsFolder, "site.min.gz.js")] =
      path.join(jsFolder, "site.min.js");

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
    uglify: {
			combine: {
        options: {
          compress: false,
          beautify: {
            beautify: true,
            indent_level: 2,
            comments: true
          },
          mangle: false,
        },
				files: jsFiles
			},
      minify: {
        options: {
          compress: {
            drop_debugger: true,
            unsafe: true,
            drop_console: false
          },
          beautify: false,
          mangle: {},
          screwIE8: true
        },
        files: jsMinifyFiles
      }
		},
    compress: {
      css: {
        options: {
          mode: 'gzip' // all browsers read gzip files
        },
        files: cssCompressFiles
      },
      js: {
        options: {
          mode: 'gzip'
       },
       files: jsCompressFiles
     }
   },
    watch: {
      css: {
        files: path.join(sassFolder, "**", "*.scss"), // "app/www/css/**/*.css" ** = all sub folders
        tasks: ["sass", "cssmin", "compress:css"]
      },
      js: {
				files: [
					path.join(jsFolder, "**", "*.js"),
					"!" + path.join(jsFolder, "*.min.js")],
				tasks: ["uglify:combine","compress:js"]
			}
    }
  });

  // load up the tasks
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // web-server task instead of default -
  grunt.registerTask("web-server", "start a web server", function() {

    var
      http = require("http"), // allows you to link to c++ binary, pass in func
      express = require("express"), // middleware, setup routing, handles url parameters, data that is posted on the body
      multer = require("multer"),
      app = express(), // returning a func object. Invokes express()
      webServerConfig = grunt.config("webServer"); // var o = {a: "b"} o["a"]

    app.use("/api", multer({
      dest: "./app/uploads",
      rename: function(fieldName, fileName) {
        return fileName;
      }
    }));

    app.use("/api/upload", function(req, res) {
      //res.json({
      //  message: "Upload Successfull"
      //});

      // comment the above part if you want the index_file_upload_button to work and use the statement
      // commented below
      res.send("<?xml version=\"1.0\"?>\n<message>Uploaded!</message>");
    });

    app.use("/api/widgets", function(req, res) {
      res.json([
        {id: 1, name: "widget 1"},
        {id: 2, name: "widget 2"},
        {id: 3, name: "widget 3"},
        {id: 4, name: "widget 4"}
      ]);
    });

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

    app.use("/js", express.static(jsFolder, {
			setHeaders: function(res, filePath) {
				res.setHeader("Content-Type", "text/javascript");
				if (/.gz.js$/.test(filePath)) {
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
  grunt.registerTask("default", "start development environment", ["sass", "cssmin", "uglify", "compress", "web-server", "watch"]);
};
