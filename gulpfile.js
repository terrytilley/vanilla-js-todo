var gulp          = require('gulp');
var sass          = require('gulp-sass');
var watch         = require('gulp-watch');
var concat        = require('gulp-concat');
var jshint        = require('gulp-jshint');
var uglify        = require('gulp-uglify');
var plumber       = require('gulp-plumber');
var cleanCSS      = require('gulp-clean-css');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync').create();

// --------------------------------------------------------------------
// Settings
// --------------------------------------------------------------------
var src = {
  sass:     "./assets/sass/**/*",
  sassFile: "./assets/sass/app.scss",
  js:       "./assets/js/**/*.js",
  html:     "./**/*.html"
};

var output = {
  css:    "./assets/css",
  js:     "./assets/js",
  html:   "./**/*.html",
  root:   "./",
  minCSS: "app.min.css",
  minJS:  "app.min.js"
};

// --------------------------------------------------------------------
// Error Handler
// --------------------------------------------------------------------
var onError = function(err) {
  console.log(err);
  this.emit('end');
};

// --------------------------------------------------------------------
// Task: Sass
// --------------------------------------------------------------------
gulp.task('sass', function() {
  return gulp.src(src.sassFile)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(autoprefixer('last 15 versions'))
    .pipe(concat(output.minCSS))
    .pipe(gulp.dest(output.css))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.css))
    .pipe(browserSync.reload({ stream: true }));
});

// --------------------------------------------------------------------
// Task: JS
// --------------------------------------------------------------------
gulp.task('js', function() {
  return gulp.src([src.js, "!./assets/js/app.min.js"])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(concat(output.minJS))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.js))
    .pipe(browserSync.reload({ stream: true }));
});

// --------------------------------------------------------------------
// Task: HTML
// --------------------------------------------------------------------
gulp.task('html', function() {
  return gulp.src(src.html)
    .pipe(gulp.dest(output.root))
    .pipe(browserSync.reload({ stream: true }));
});

// --------------------------------------------------------------------
// Task: Serve
// --------------------------------------------------------------------
gulp.task('serve', ['sass', 'js'], function() {
  browserSync.init({
    server: output.root,
    notify: false
  });
  gulp.watch(src.js, ['js']);
  gulp.watch(src.sass, ['sass']);
  gulp.watch(output.html).on('change', browserSync.reload);
});

// --------------------------------------------------------------------
// Task: Default
// --------------------------------------------------------------------
gulp.task('default', ['serve']);
