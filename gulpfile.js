const del = require('del');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

//Import sass - Build scss to css
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

//Import ejs - Build ejs to html
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

//dirname
const devDir = './dev/';
const buildDir = './public';


// Clean assets
function clean() {
    return del([buildDir+"/assets/"]);
}

//Css

function style() {
    return gulp
      .src(devDir + "/assets/css/**/*.css")
      .pipe(gulp.dest(buildDir + "/assets/css"));
  }

//JS
function scripts(){
    return gulp
        .src(devDir+'/assets/js/**/*.js')
        .pipe(gulp.dest(buildDir+'/assets/js'));
}

//Images
function images(){
    return gulp
        .src(devDir+'/assets/img/**/*.+(jpg|jpeg|png|gif|svg)')
        .pipe(gulp.dest(buildDir+ "/assets/img"));
}

//Compile ejs to html
function ejsTemplate(){
    return gulp
        .src(devDir+'/ejs/**/*.ejs')
        .pipe(ejs({ title: 'gulp-ejs' }))
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest('./public'))
}

function watch(){
    browserSync.init({
        server: {
            baseDir: buildDir
        },
        port: 8080
    });
    gulp.watch(devDir+'/assets/sass/**/*.scss',style);
    gulp.watch(devDir+'/ejs/**/*.ejs',ejsTemplate);
    gulp.watch(buildDir+'/*.html').on('change', browserSync.reload);
    gulp.watch(devDir+'/assets/js/**/*.js', scripts);
    gulp.watch(devDir+'/assets/img/*', images);
}

exports.build = gulp.series(clean, gulp.parallel(style, scripts, images, ejsTemplate));
exports.watch = watch;



