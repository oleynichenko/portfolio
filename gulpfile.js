var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var run = require("run-sequence");
var del = require("del");
var pug = require("gulp-pug");

gulp.task("pug", function() {
  gulp.src("src/pug/*.pug")
    .pipe(pug())
    .pipe(gulp.dest("src"));
});

gulp.task("style", function() {
  gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 1 version",
        "last 2 Chrome versions",
        "last 2 Firefox versions",
        "last 2 Opera versions",
        "last 2 Edge versions" 
      ]})
    ]))
    .pipe(gulp.dest("src/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("src/css"))
    .pipe(server.stream());
});

gulp.task("serve", ["run-src"], function() {
  server.init({
    server: "src",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.scss", ["style"]);
  gulp.watch("src/pug/**/*.pug", ["pug"]);
  gulp.watch("src/*.html").on("change", server.reload);
});

gulp.task("run-src", function(fn) {
  run("pug", "style", fn);
});

// сборка

gulp.task("style-build", function() {
  gulp.src("build/css/style.css")
    .pipe(postcss([
      mqpacker({
        sort: true
        })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"));
});

gulp.task("images", function() {
  gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
       imagemin.optipng({optimizationLevel: 3}),
       imagemin.jpegtran({progressive: true})
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("copy", function() {
 return gulp.src([
   "src/fonts/**/*.{woff,woff2}",
   "src/img/**",
   "src/js/**",
   "src/css/**",
   // "src/*.html", "!library-demo.html"
   "src/*.html"
   ], {
   base: "src"
   })
 .pipe(gulp.dest("build"));
});


gulp.task("clean", function() {
  return del("build");
});

gulp.task("run-build", function(fn) {
  run("clean", "copy", "style-build", "images", "generate-favicon", "inject-favicon-markups", fn);
});

// Копирование для Портфолио

gulp.task("copy-portfolio", function() {
 return gulp.src([
   "build/**/*.*"
   ])
 .pipe(gulp.dest("../oleynichenko.github.io"));
});

gulp.task("clean-portfolio", function() {
  return del(["../oleynichenko.github.io/**",
   "!../oleynichenko.github.io",
   "!../oleynichenko.github.io/device",
   "!../oleynichenko.github.io/device/**",
   "!../oleynichenko.github.io/barbershop/",
   "!../oleynichenko.github.io/barbershop/**"], {force: true});
});

gulp.task("build-portfolio", function(fn) {
  run("clean-portfolio", "copy-portfolio", fn);
});

//favicon
var realFavicon = require ('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function(done) {
	realFavicon.generateFavicon({
		masterPicture: 'build/img/favicon.png',
		dest: 'build/img/icons',
		iconsPath: 'img/icons',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#414040',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			},
			safariPinnedTab: {
				pictureAspect: 'blackAndWhite',
				threshold: 57.8125,
				themeColor: '#414040'
			}
		},
		settings: {
			compression: 3,
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, function() {
		done();
	});
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function() {
	return gulp.src([ "build/*.html" ])
		.pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
		.pipe(gulp.dest('build'));
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function(done) {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
});


