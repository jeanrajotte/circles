/*
gulpfile.js

*/

var isDist = false;
var CSS_SRC_MAIN = '';

// define build tasks 
// var browserSync = require('browser-sync');
// var reload = browserSync.reload;
// var clean = require('gulp-clean');
// var concat = require('gulp-concat');
// var connect = require('gulp-connect');
// var flatten = require('gulp-flatten');
// var fs = require('fs');
// var gulp = require('gulp');
// var gutil = require('gulp-util');
// var inject = require('gulp-inject');
// var jshint = require('gulp-jshint');
// var karma = require('karma'); // not a gulp plugin!
// var less = require('less');
// var map = require('map-stream');
// var minifyCSS = require('gulp-minify-css');
// var mkdirp = require('mkdirp');
// var path = require('path');
// var rename = require('gulp-rename');
// var replace = require('gulp-replace');
// var runSequence = require('run-sequence');
// var sort = require('gulp-sort');
// var sourcemaps = require('gulp-sourcemaps');
// var transform = require('vinyl-transform');
// var uglify = require('gulp-uglify');
// var wiredep = require('wiredep');

// JS cleanliness 
gulp.task('lint', function() {
  return gulp.src(['app/**/*.js', '!app/bower_components/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// DIST ONLY: minify ALL scripts
gulp.task('js', ['lint'], function() {
  // bower first
  return gulp.src(wiredep()
      .js
      .concat([
        'app/app.js', // then the app
        'app/modules/**/*.js' // then the modules
      ]))
    .pipe(concat('app.js'))
    .pipe(replace('$logProvider.debugEnabled(true)', '$logProvider.debugEnabled(false)'))
    .pipe(replace('Session.dev = true;', 'Session.dev = false;'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

// DIST ONLY: copy modules HTML to dist (for now)...
// make this sync (wait until it's all done before moving on)
gulp.task('modules', function() {
  return gulp.src(['app/modules/**/*.html'])
    .pipe(gulp.dest('dist/modules/'));
});

// DIST ONLY: move assets to dist
gulp.task('assets', ['fonts', 'images', 'dependentimages'], function(cb) {
  gutil.log('Assets copied');
  cb();
});
// make this sync (wait until it's all done before moving on)
gulp.task('fonts', function() {
  return gulp.src(['app/bower_components/fontawesome/fonts/*'])
    .pipe(gulp.dest('fonts/'));
});
gulp.task('images', function() {
  return gulp.src(['app/images/**/*'])
    .pipe(gulp.dest('dist/images/'));
});
gulp.task('dependentimages', function() {
  return gulp.src(['app/bower_components/*/*.{png,gif,jpg}'])
    .pipe(flatten())
    .pipe(gulp.dest('dist/css/'));
});

// DIST ONLY: wipe slate clean
gulp.task('clean', function() {
  return gulp.src('./dist')
    .pipe(clean({
      force: true
    }));
});

// inject bower & app components in index.html and karma.conf.js
gulp.task('indexhtml', function() {
  // in dev, put bower & app files into index.html
  // ensure order is consistent
  return gulp.src('index.dev.html')
    .pipe(rename('index.html'))
    .pipe(wiredep.stream())
    .pipe(inject(gulp.src(['app/modules/**/*.js'], {
        read: false
      })
      .pipe(sort()), {
        name: 'app',
        relative: true
      }))
    .pipe(gulp.dest('.'));
});
gulp.task('karmaconf', function() {
  return gulp.src('karma.conf.dev.js')
    .pipe(rename('karma.conf.js'))
    .pipe(wiredep.stream())
    .pipe(gulp.dest('.'));
});
gulp.task('inject', ['indexhtml', 'karmaconf'], function(cb) {
  if (isDist) {
    return gulp.src('index.dev.html')
      .pipe(rename('index.html'))
      .pipe(gulp.dest('dist/'));
  }
  cb();
});

// unit testing IS NOT ASYNC like the other tasks...
gulp.task('utest', ['lint', 'inject'], function(cb) {
  karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, function(exitCode) {
    if (exitCode !== 0) {
      gutil.log(gutil.colors.bgRed('UNIT TEST(S) FAILED!'));
      if (isDist) {
        process.exit(exitCode);
      }
    }
    cb();
  });
});

// DEV: do things when sources change
gulp.task('watch', function() {
  gulp.watch(['app/modules/**/*.js', 'app/app.js', 'tests/**/*.js'], {
    interval: 1000
  }, ['utest']);

  gulp.watch(['app/bower_components/**/*', 'app/modules/**/*.js', 'index.dev.html'], {
    interval: 1000
  }, ['inject']);

});

//////// DIST
gulp.task('setdist', function() {
  isDist = true;
});

gulp.task('dist', function() {
  return runSequence('setdist',
    'clean',
    'inject', 'js', 'assets', 'modules',
    'utest'
  );
});

gulp.task('distserve', ['setdist', 'serve']);

//////// DEV (default)
gulp.task('kick', function() {
  return runSequence('inject', 'utest');
});

gulp.task('default', ['kick', 'watch']);

/////////// utilities
function fname(file, cb) {
  console.log(file.path);
  cb(null, file);
}

function fnames(vinyl) {
  vinyl.pipe(map(fname));
}

///// scratch pad to try ideas and understand syntax
gulp.task('play', function() {
  // mkdirp('/not/yet/exist/');
  // gulp.src(['app/modules/**/*.js'], {
  //     read: false
  //   })
  //   .pipe(sort())
  //   .pipe(map(fname));

  gulp.src(['app/less/skin.default.less', 'app/less/skinables.less'])
    .pipe(concat('_.less'))
    .pipe(gulp.dest('app/less'))
    .pipe(map(function(file, cb) {
      // console.log(file);
      var lessText = fs.readFileSync(file.path, {
        encoding: 'utf8'
      });
      less.render(lessText, {
          paths: ['app/less'],
          sourceMap: {
            sourceMapFileInline: true
          }
        })
        .then(function(output) {
            // console.log('allo');
            var fname = 'app/less/_.css';
            fs.writeFile(fname, output.css, function(err) {
              if (err) throw err;
              gutil.log('Written ' + fname);
            });
            cb(null, file);
          },
          function(error) {
            // console.log(error);
            gutil.log(gutil.colors.bgRed(error.message));
            gutil.log('line ' + error.line + ', column ' + error.column + ' in ' + inFile);
            if (isDist) {
              process.exit(1);
            }
          });
    }));

});

