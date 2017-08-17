const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps')
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');
const bower = require('bower');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const concatCss = require('gulp-concat-css');
const ngAnnotate = require('gulp-ng-annotate');
const browserSync = require('browser-sync').create();
const templateCache = require('gulp-angular-templatecache');
const argv = require('yargs').argv;
const eslint = require('gulp-eslint');
const eslintReporter = require('eslint-html-reporter');
const path = require('path');
const fs = require('fs')


// config and paths
const bowerFolder = './bower_components/';
const public = './public'
const src = './src'
const dist = `${public}/build`;
var paths = {
    js: {
        lib: [
            bowerFolder + 'jquery/dist/jquery.js',
            bowerFolder + 'materialize/dist/js/materialize.js',
            bowerFolder + 'angular/angular.js',
            bowerFolder + 'angular-ui-router/release/angular-ui-router.js',
            bowerFolder + 'angular-materialize/src/angular-materialize.js',
            bowerFolder + 'angular-sanitize/angular-sanitize.js',
            bowerFolder + 'showdown/dist/showdown.js',
            bowerFolder + 'ng-showdown/dist/ng-showdown.js',
            bowerFolder + 'moment/min/moment.min.js',
            bowerFolder + 'angular-jwt/dist/angular-jwt.js',
            bowerFolder + 'angular-materializecss-autocomplete/angular-materializecss-autocomplete.js'
        ],
        custom: './src/js/**/*.js',
        dist: `${dist}/js/`
    },
    css: {
        lib: [
            bowerFolder + 'materialize/dist/css/materialize.css',
            bowerFolder + 'font-awesome/css/font-awesome.css'
        ],
        sass: './src/sass/**/*.scss',
        dist: `${dist}/css/`
    },
    fonts: {
        all: [
            './src/fonts/**/*.*',
            bowerFolder + 'materialize/dist/fonts/**/*.*',
            bowerFolder + 'font-awesome/fonts/**/*.*',
        ],
        dist: `${dist}/fonts/`
    },
    images: {
        all: './src/images/*',
        dist: `${dist}/images/`
    },
    app: {
        templates: './src/app/**/*.html',
        js: [
            `${src}/app/app.module.js`,
            `${dist}/app/templates.js`,
            `${src}/app/**/*.js`
        ],
        dist: `${dist}/app/`
    },
    clean: [dist, './tests'],
    lint: {
        server: [
            './api/**/*.js',
            './config/**/*.js',
            './lib/**/*.js',
            './server.js'
        ]
    }
}

gulp.task('lint', ['clean:tests'], function () {
    const testDir = './tests/';
    const reportFile = path.join(__dirname, testDir, 'eslint-report.html');
    const eslintConfig = path.join(__dirname, '.eslintrc.json');
    if (argv.fail) {
        return gulp.src(paths.lint.server)
            .pipe(eslint(eslintConfig))
            .pipe(eslint.format())
            .pipe(eslint.format(eslintReporter, function (results) {
                if (!fs.existsSync(testDir)) {
                    fs.mkdirSync(testDir);
                }
                fs.writeFileSync(path.join(reportFile), results);
            }))
            .pipe(eslint.failAfterError());
    }
    return gulp.src(paths.lint.server)
        .pipe(eslint(eslintConfig))
        .pipe(eslint.format(eslintReporter, function (results) {
            if (!fs.existsSync(testDir)) {
                fs.mkdirSync(testDir);
            }
            fs.writeFileSync(path.join(reportFile), results);
        }))
        .pipe(eslint.format());
});

gulp.task('clean', function () {
    return del(dist);
});
gulp.task('clean:tests', function () {
    return del('./tests');
});

gulp.task('build', ['js', 'css', 'fonts', 'images']);

// All JS Tasks
gulp.task('js', ['js-min', 'js-min-lib', 'app-min']);

// All CSS Tasks
gulp.task('css', ['sass-min', 'css-min-lib']);


/**
 * JS Tasks
 */

// Custom JS Min - Depends on Custom JS Concat
gulp.task('js-min', ['js-con'], () => {
    return gulp.src(paths.js.dist + 'custom.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename('custom.min.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js.dist));
});

// Custom JS Concat
gulp.task('js-con', () => {
    return gulp.src(paths.js.custom)
        .pipe(sourcemaps.init())
        .pipe(concat('custom.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js.dist));
});

// Lib JS Min - Depends on Lib JS Concat
gulp.task('js-min-lib', ['js-con-lib'], () => {
    return gulp.src(paths.js.dist + 'lib.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename('lib.min.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js.dist));
});

// Lib JS Concat
gulp.task('js-con-lib', ['bower'], () => {
    return gulp.src(paths.js.lib)
        .pipe(sourcemaps.init())
        .pipe(concat('lib.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js.dist));
});


gulp.task('sass-con', function () {
    return gulp.src(paths.css.sass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.css.dist));
});

gulp.task('sass-min', ['sass-con'], function () {
    return gulp.src(paths.css.dist + '/app.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.css.dist));
});

// Lib CSS Min - Depends on Lib CSS Concat
gulp.task('css-min-lib', ['css-con-lib'], () => {
    return gulp.src(paths.css.dist + 'lib.css')
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename('lib.min.css'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.css.dist));
});

// Lib CSS Concat
gulp.task('css-con-lib', ['bower'], () => {
    return gulp.src(paths.css.lib)
        .pipe(sourcemaps.init())
        .pipe(concatCss('lib.css', {
            rebaseUrls: false
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.css.dist));
});


// Copy fonts to dist
gulp.task('fonts', () => {
    return gulp.src(paths.fonts.all)
        .pipe(gulp.dest(paths.fonts.dist));
})

// Optimize images
gulp.task('images', () => {
    gulp.src(paths.images.all)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dist))
});

/**
 * Angular.js Tasks
 */

// Angular.js Templates
gulp.task('templates', () => {
    return gulp.src(paths.app.templates)
        .pipe(templateCache({
            module: 'app'
        }))
        .pipe(gulp.dest(paths.app.dist));
});

// Custom App.JS Min - Depends on Custom App.JS Concat
gulp.task('app-min', ['app-con'], () => {
    return gulp.src(paths.app.dist + 'app.js')
        .pipe(sourcemaps.init())
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.app.dist));
});

// Custom App.JS Concat
gulp.task('app-con', ['templates'], () => {
    return gulp.src(paths.app.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.app.dist));
});

// bower install
gulp.task('bower', () => {
    return bower.commands
        .install()
        .on('log', function (data) {
            console.log('bower:', data.message);
        });
});

gulp.task('watch', function () {
    gulp.watch(paths.css.sass, ['sass-min']);
    gulp.watch(paths.js.custom, ['js-min']);
    gulp.watch(paths.app.js, ['app-min']);
    gulp.watch(paths.app.templates, ['app-min']);

    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    });
});

gulp.task('serve', ['watch'], function () {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: ['public/**/*.*'],
        port: 7000,
        reloadDelay: 3000
    });
});
