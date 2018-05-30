const gulp = require('gulp')
const gulpif = require('gulp-if')
const nodemon = require('gulp-nodemon')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const del = require('del')
const bower = require('bower')
const concat = require('gulp-concat')
const imagemin = require('gulp-imagemin')
const concatCss = require('gulp-concat-css')
const ngAnnotate = require('gulp-ng-annotate')
const browserSync = require('browser-sync').create()
const templateCache = require('gulp-angular-templatecache')
const argv = require('yargs').argv
const eslint = require('gulp-eslint')
const eslintReporter = require('eslint-html-reporter')
const path = require('path')
const fs = require('fs')

// config and paths
const lib = './bower_components'
const public = './server/public'
const src = './client/src'
const dist = `${public}/build`
const paths = {
  js: {
    lib: [
      `${lib}/jquery/dist/jquery.js`,
      `${lib}/materialize/dist/js/materialize.js`,
      `${lib}/angular/angular.js`,
      `${lib}/angular-ui-router/release/angular-ui-router.js`,
      `${lib}/angular-materialize/src/angular-materialize.js`,
      `${lib}/angular-sanitize/angular-sanitize.js`,
      `${lib}/showdown/dist/showdown.js`,
      `${lib}/ng-showdown/dist/ng-showdown.js`,
      `${lib}/moment/min/moment.min.js`,
      `${lib}/angular-jwt/dist/angular-jwt.js`,
      `${lib}/angular-materializecss-autocomplete/angular-materializecss-autocomplete.js`,
      `${lib}/simplemde/dist/simplemde.min.js`,
      `${lib}/angular-recaptcha/release/angular-recaptcha.min.js`
    ],
    custom: `${src}/js/**/*.js`,
    dist: `${dist}/js/`
  },
  css: {
    lib: [
      `${lib}/materialize/dist/css/materialize.css`,
      `${lib}/font-awesome/css/font-awesome.css`,
      `${lib}/simplemde/dist/simplemde.min.css`
    ],
    sass: `${src}/sass/**/*.scss`,
    dist: `${dist}/css/`
  },
  fonts: {
    all: [
      `${src}/fonts/**/*.*`,
      `${lib}/materialize/dist/fonts/**/*.*`,
      `${lib}/font-awesome/fonts/**/*.*`
    ],
    dist: `${dist}/fonts/`
  },
  images: {
    all: `${src}/images/*`,
    dist: `${dist}/images/`
  },
  app: {
    templates: `${src}/app/**/*.html`,
    js: [
      `${src}/app/app.module.js`,
      `${dist}/app/templates.js`,
      `${src}/app/**/*.js`
    ],
    dist: `${dist}/app/`
  },
  clean: [dist, './tests'],
  lint: {
    server: ['./server/**/*.js']
  }
}

gulp.task('clean', () => {
  return del(paths.clean)
})

gulp.task('clean:tests', () => {
  return del('./tests')
})

// bower install
gulp.task('bower', done => {
  bower.commands
    .install()
    .on('log', data => {
      console.log('bower:', data.message)
    })
    .on('end', () => {
      return done()
    })
})

const lint = () => {
  const testDir = './tests/'
  const reportFile = path.join(__dirname, testDir, 'eslint-report.html')
  const eslintConfig = path.join(__dirname, '.eslintrc.json')
  return gulp
    .src(paths.lint.server)
    .pipe(eslint(eslintConfig))
    .pipe(eslint.format())
    .pipe(
      eslint.format(eslintReporter, results => {
        if (!fs.existsSync(testDir)) {
          fs.mkdirSync(testDir)
        }
        fs.writeFileSync(path.join(reportFile), results)
      })
    )
    .pipe(gulpif(argv.fail, eslint.failAfterError()))
}
lint.displayName = 'eslint'
gulp.task(lint)

gulp.task('lint', gulp.series('clean:tests', 'eslint'))

/**
 * JS Tasks
 */

// Custom JS Min & Concat
const jsCustom = () => {
  return gulp
    .src(paths.js.custom)
    .pipe(sourcemaps.init())
    .pipe(concat('custom.js'))
    .pipe(gulp.dest(paths.js.dist))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.js.dist))
}
jsCustom.displayName = 'js-custom'
gulp.task(jsCustom)

// Lib JS Min & Concat
const jsLib = () => {
  return gulp
    .src(paths.js.lib)
    .pipe(sourcemaps.init())
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(paths.js.dist))
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.js.dist))
}
jsLib.displayName = 'js-lib'
gulp.task(jsLib)

const sassTask = () => {
  return gulp
    .src(paths.css.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.css.dist))
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(
      rename({
        extname: '.min.css'
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.css.dist))
}
sassTask.displayName = 'sass'
gulp.task(sassTask)

// Lib CSS Min & Concat
const cssLib = () => {
  return gulp
    .src(paths.css.lib)
    .pipe(sourcemaps.init())
    .pipe(
      concatCss('lib.css', {
        rebaseUrls: false
      })
    )
    .pipe(gulp.dest(paths.css.dist))
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(rename('lib.min.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.css.dist))
}
cssLib.displayName = 'css-lib'
gulp.task(cssLib)

// Copy fonts to dist
gulp.task('fonts', () => {
  return gulp.src(paths.fonts.all).pipe(gulp.dest(paths.fonts.dist))
})

// Optimize images
gulp.task('images', () => {
  return gulp
    .src(paths.images.all)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dist))
})

/**
 * Angular.js Tasks
 */

// Angular.js Templates
gulp.task('templates', () => {
  return gulp
    .src(paths.app.templates)
    .pipe(
      templateCache({
        module: 'app'
      })
    )
    .pipe(gulp.dest(paths.app.dist))
})

// Angular.js Min & Concat
const jsApp = () => {
  return gulp
    .src(paths.app.js)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(paths.app.dist))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(
      rename({
        extname: '.min.js'
      })
    )
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.app.dist))
}
jsApp.displayName = 'js-app'
gulp.task(jsApp)

// All Angular.js Tasks
gulp.task('app', gulp.series('templates', 'js-app'))

// All JS Tasks
gulp.task('js', gulp.parallel('js-custom', 'js-lib', 'app'))

// All CSS Tasks
gulp.task('css', gulp.parallel('sass', 'css-lib'))

gulp.task(
  'build',
  gulp.series('bower', gulp.parallel('js', 'css', 'fonts', 'images'))
)

gulp.task('serve', () => {
  gulp.watch(paths.css.sass, gulp.parallel('sass'))
  gulp.watch(paths.js.custom, gulp.parallel('js-custom'))
  gulp.watch(paths.app.js, gulp.series('js-app'))
  gulp.watch(paths.app.templates, gulp.series('templates', 'js-app'))

  nodemon({
    script: 'server/server.js',
    ext: 'js handlebars',
    env: {
      NODE_ENV: 'development'
    },
    ignore: [
      'server/public/',
      'node_modules/',
      'client/',
      'server/public/',
      'gulpfile.js'
    ]
  })

  browserSync.init(null, {
    ui: {
      port: 5001
    },
    proxy: 'http://localhost:5000',
    files: [
      'server/public/build/fonts/**/*.*',
      'server/public/build/**/*.min.*',
      '!server/public/build/maps/**/*.*'
    ],
    port: 7000
  })
})
