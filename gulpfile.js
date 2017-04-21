var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps')
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var del = require('del');

var public = './public/'
var src = './src/'
var paths = {
    cssPub: public + 'css',
    jsPub: public + 'js',
    sassSrc: src + 'sass/**/*.scss',
    jsSrc: src + 'js/**/*.js',
    views: './views',
    allJs: [
        './**/*.js',
        '!node_modules/**/*.*',
        '!gulpfile.js',
        '!public/**/*.*'
    ]
}

gulp.task('lint', ['clean'], function () {
    gulp.src(paths.allJs)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jshint.reporter('gulp-jshint-html-reporter', {
            filename: __dirname + '/tests/jshint-output.html',
            createMissingFolders: true
        }));
});

gulp.task('clean', function () {
    del('tests');
});

gulp.task('build', ['min-css', 'min-js']);

gulp.task('sass', function () {
    return gulp.src(paths.sassSrc)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.cssPub));
});

gulp.task('min-css', ['sass'], function () {
    return gulp.src(paths.cssPub + '/app.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.cssPub));
});

gulp.task('min-js', function () {
    return gulp.src(paths.jsSrc)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(paths.jsPub));
});

gulp.task('watch', function () {
    gulp.watch(paths.sassSrc, ['min-css']);
    gulp.watch(paths.jsSrc, ['min-js']);

    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    });
});