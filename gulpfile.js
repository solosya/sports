var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gp_rename = require("gulp-rename");
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCss = require("gulp-clean-css");
var hasher = require('gulp-hasher');
var buster = require('gulp-cache-buster');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('styles', function (callback) {
    runSequence('sass', 'vendor', 'minify-css', 'cache', callback);
});

gulp.task('scripts', function (callback) {
    runSequence('vendor_scripts', 'user_scripts', 'uglify-js', 'cacheJS', callback);
});

gulp.task('cache', function () {
    var debug = true;
    return gulp.src('layouts/main.twig')
        .pipe(buster({
            tokenRegExp: /\/((.*?)\.min\.css)\?v=[0-9a-z]+/g,
            assetRoot: __dirname,
            hashes: hasher.hashes,
            env: 'production'
        }))
        .pipe(gulp.dest('layouts/'));
});

gulp.task('cacheJS', function () {
    var debug = true;
    console.log(hasher.hashes);
    return gulp.src('layouts/partials/_javascript.twig')
        .pipe(buster({
            tokenRegExp: /\/((.*?)\.min\.js)\?v=[0-9a-z]+/g,
            assetRoot: __dirname,
            hashes: hasher.hashes,
            env: 'production'
        }))
        .pipe(gulp.dest('layouts/'));
});


gulp.task('minify-css', function () {
    return gulp.src([
        './static/deploy/vendor.css',
        './static/deploy/main.css'
    ])
        .pipe(gp_rename({suffix: '.min'}))
        .pipe(minifyCss())
        .pipe(gulp.dest('./static/deploy'))
        .pipe(hasher());
});

gulp.task('uglify-js', function () {
    return gulp.src([
        './static/deploy/vendor.js',
        './static/deploy/main.js'
    ])
        .pipe(gp_rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./static/deploy'))
        .pipe(hasher());
});


gulp.task('vendor', function () {
    return gulp.src([
        './static/development/js/plugins/jquery.fancybox/source/jquery.fancybox.css',
        './static/development/js/plugins/jquery.noty-2.3.8/demo/animate.css',
        './static/development/js/sdk/media-player/mediaelementplayer.css'
    ]) // path to your file
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/deploy'));
});


gulp.task('sass', function () {
    return gulp.src(['./static/css/main.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'nested' // Options: nested, expanded, compact, compressed
        }).on('error', sass.logError))
        //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 10', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/deploy'));
});


gulp.task('vendor_scripts', function () {
    return gulp.src([
        './bower_components/jquery/dist/jquery.js',
        './bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',

        './static/development/js/plugins/slick.js',
        './static/development/js/plugins/jquery-ui/jquery-ui-1.10.1.custom.min.js',
        './static/development/js/plugins/bootstrap-modalmanager.js',
        './static/development/js/plugins/bootstrap-modal.js',
        './static/development/js/plugins/jquery.noty-2.3.8/js/noty/packaged/jquery.noty.packaged.min.js',
        './static/development/js/plugins/jquery.fancybox/source/jquery.fancybox.js',
        './static/development/js/plugins/bootbox.min.js',
        './static/development/js/plugins/jquery.validate/jquery.validate.min.js',
        './static/development/js/plugins/waypoint/lib/jquery.waypoints.min.js',
        './static/development/js/plugins/handlebars-v4.0.5.js',
        './static/development/js/plugins/jquery.lazyload.min.js',
        './static/development/js/plugins/jquery.dotdotdot.min.js',
        './static/development/js/plugins/owl.carousel.min.js',

        './static/development/js/sdk/cloudinary/jquery.cloudinary.js',
        './static/development/js/sdk/common.js',
        './static/development/js/sdk/blog.js',
        './static/development/js/sdk/article.js',
        './static/development/js/sdk/search.js',
        './static/development/js/sdk/disqus.js',
        './static/development/js/sdk/video-player.js',
        './static/development/js/sdk/user-articles.js',
        './static/development/js/sdk/follow.js',
        './static/development/js/sdk/login.js',
        './static/development/js/sdk/image.js',
        './static/development/js/sdk/social-share.js',
        './static/development/js/sdk/yii/yii.js',
        './static/development/js/sdk/yii/yii.captcha.js',
        './static/development/js/sdk/uploadfile.js',
        './static/development/js/sdk/media-player/mediaelement-and-player.min.js',

        './node_modules/objectFitPolyfill/dist/objectFitPolyfill.min.js'

    ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/deploy'));
});


gulp.task('user_scripts', function () {
    return gulp.src(['./static/development/js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/deploy'));
});

gulp.task('watch', function () {
    gulp.watch('./static/css/**/**/*.scss', ['styles']);
    gulp.watch('./static/development/js/**/*.js', ['scripts']);
});

gulp.task('default', ['scripts', 'styles']);