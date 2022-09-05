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

//Compile scss to css
function style(){
    return gulp
        //1. Where is my scss file
        .src(devDir+'/assets/sass/**/*.scss')

        //2. sourceMap scss
        .pipe(sourcemaps.init())

        //3. pass that file through sass compilier
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))

        //4. auto prefix
        .pipe(autoprefixer({
            cascade: false
        }))

        //5. source map css
        .pipe(sourcemaps.write('.'))

        //6. Where do I save the compiled CSS?
        .pipe(gulp.dest(buildDir+'/assets/css'))

        //7. stream changes to all browser
        .pipe(browserSync.stream());
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



