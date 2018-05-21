'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sassGlob = require('gulp-sass-glob');
const groupMediaQueries = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-cleancss');

const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const pug = require('gulp-pug');
const del = require('del');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const paths =  {
  src: './src/',              // paths.src
  build: './build/'           // paths.build
};

function styles() {
  return gulp.src(paths.src + 'scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(groupMediaQueries())
    .pipe(autoprefixer({browsers: ['last 2 versions', '>1%', 'ie 8', 'ie 9', 'Opera 12.1']}))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(paths.build + 'css/'))
    .pipe(cleanCSS())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.build + 'css/'));
}

function scripts() {
  return gulp.src(paths.src + '**/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(uglify())
    .pipe(concat('script.min.js'))
    .pipe(gulp.dest(paths.build + 'js/'))
}

function pugs() {
  let locals = require('./src/data/info.json');
  return gulp.src(paths.src + '**.pug')
    .pipe(pug({
      locals : locals,
      pretty: true
    }))
    .pipe(gulp.dest(paths.build));
}

function moveImg() {
  return gulp.src(paths.src + '**/*.{png,jpg}')
    .pipe(gulp.dest(paths.build + 'img/'));
}

function clean() {
  return del('build/')
}

function watch() {
  gulp.watch(paths.src + '**/**/*.scss', styles);
  gulp.watch(paths.src + '**/*.js', scripts);
  gulp.watch(paths.src + '**/*.pug', pugs);
  gulp.watch(paths.src + '**/*.json', pugs);
  gulp.watch(paths.src + '**/*.{png,jpg}', moveImg);
}

function serve() {
  browserSync.init({
    server: {
      baseDir: paths.build
    }
  });
  browserSync.watch(paths.build + '**/*.*', browserSync.reload);
}

exports.styles = styles;
exports.scripts = scripts;
exports.pugs = pugs;
exports.moveImg = moveImg;
exports.clean = clean;
exports.watch = watch;

gulp.task('build', gulp.series(
  clean,
  gulp.parallel(styles, scripts, pugs, moveImg)
));

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(styles, scripts, pugs, moveImg),
  gulp.parallel(watch, serve)
));
