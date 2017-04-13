var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var del = require('del');

var js = [
    '!node_modules/**/*.*',
    './**/*.js'
];

gulp.task('lint', ['clean'], function () {
    gulp.src(js)
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

gulp.task('watch', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    });
});