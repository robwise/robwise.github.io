var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var concat       = require('gulp-concat');
var del          = require('del');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var jshint       = require('gulp-jshint');
var minifycss    = require('gulp-minify-css');
var notify       = require('gulp-notify');
var rename       = require('gulp-rename');
var responsive   = require('gulp-responsive'); // requires sharp and vips (brew)
var run          = require('gulp-run');
var runSequence  = require('run-sequence');
var sass         = require('gulp-ruby-sass');
var size         = require('gulp-size');
var uglify       = require('gulp-uglify');

var config       = require('./_app/gulp/config');
var paths        = require('./_app/gulp/paths');

// Uses Sass compiler to process styles, adds vendor prefixes, minifies,
// and then outputs file to appropriate location(s)
gulp.task('build:styles', function() {
  return sass(paths.appSassFiles + '/main.scss', {
    style: 'compressed',
    trace: true,
    loadPath: [paths.appSassFiles,
               paths.bowerComponentsDir + 'bourbon/app/assets/stylesheets',
               paths.bowerComponentsDir + 'neat/app/assets/stylesheets',
               paths.bowerComponentsDir + 'font-awesome/scss']
  }).pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 10']}))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.jekyllDir))
    .pipe(gulp.dest(paths.siteDir))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

gulp.task('clean:styles', function(cb) {
  del([paths.jekyllDir + 'main.css', paths.siteDir + 'main.css'], cb);
});

// Concatenates and uglifies JS files and outputs result to
// the appropriate location(s).
gulp.task('build:scripts', function() {
  return gulp.src(paths.appJsFilesGlob)
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.jekyllDir))
    .pipe(gulp.dest(paths.siteDir))
    .on('error', gutil.log);
});

gulp.task('clean:scripts', function(cb) {
  del([paths.jekyllDir + 'main.js', paths.siteDir + 'main.js'], cb);
});

// Creates optimized versions of files with different qualities, sizes, and
// formats, then outputs to appropriate location(s)
gulp.task('build:images', function() {
  var imageConfigs = [];
  var addToImageConfigs = function(srcFilename, srcFileExt, widths, formats, quality, scale) {
    for (var i = widths.length - 1; i >= 0; i--) {
      for (var j = formats.length - 1; j >= 0; j--) {
        var imageConfig = {
          name: srcFilename + '.' + srcFileExt,
          width: widths[i] * scale,
          format: formats[j],
          quality: quality,
          rename: (srcFilename + '_' + widths[i] + '.' + formats[j]),
          progressive: true
        };
        imageConfigs.push(imageConfig);
      }
    }
  };

  addToImageConfigs('hero-cropped', 'jpg', [320, 640, 800, 1024, 1440], ['jpg'], '60', 1.1);
  addToImageConfigs('FrontendMastersScott-closeup', 'jpg', [400, 800], ['jpg', 'webp'], '95', 1);
  addToImageConfigs('FrontendMastersScott-fullshot', 'jpg', [400, 800, 1600], ['jpg', 'webp'], '95', 1);
  addToImageConfigs('FrontendMastersClassroom', 'jpg', [400, 800, 1500], ['jpg', 'webp'], '95', 1);
  addToImageConfigs('AngularComponents', 'png', [250, 490], ['png'], '100', 1);

  return gulp.src(paths.appImageFilesGlob)
    .pipe(responsive(imageConfigs, {errorOnUnusedImage: false, progressive: true}))
    .pipe(gulp.dest(paths.jekyllImageFiles))
    .pipe(gulp.dest(paths.siteImageFiles))
    .pipe(browserSync.stream())
    .pipe(size({showFiles: true}));
});

gulp.task('clean:images', function(cb) {
  del([paths.jekyllImageFiles, paths.siteImageFiles], cb);
});

// Places all fonts in appropriate location(s)
gulp.task('build:fonts', ['fontello:fonts']);

gulp.task('clean:fonts', function(cb) {
  del([paths.jekyllFontFiles, paths.siteFontFiles], cb);
});

// Runs Jekyll build
gulp.task('build:jekyll', function() {
  var shellCommand = 'bundle exec jekyll build --config _config.yml,_app/localhost_config.yml';
  if (config.drafts) { shellCommand += ' --drafts'; };

  return gulp.src(paths.jekyllDir)
    .pipe(run(shellCommand))
    .on('error', gutil.log);
});

// Only deletes what's in the site folder
gulp.task('clean:jekyll', function(cb) {
  del([paths.siteDir], cb);
});

gulp.task('clean', ['clean:jekyll',
                    'clean:fonts',
                    'clean:images',
                    'clean:scripts',
                    'clean:styles']);

// Builds site
// Optionally pass the --drafts flag to enable including drafts
gulp.task('build', function(cb) {
  runSequence('clean',
              ['build:scripts', 'build:images', 'build:styles', 'build:fonts'],
              'build:jekyll',
              cb);
});

// Default Task: builds site
gulp.task('default', ['build']);

// Special tasksfor building and then reloading BrowserSync
gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
  browserSync.reload();
  cb();
});

gulp.task('build:scripts:watch', ['build:scripts'], function(cb) {
  browserSync.reload();
  cb();
});

// Static Server + watching files
// WARNING: passing anything besides hard-coded literal paths with globs doesn't
//          seem to work with the gulp.watch()
gulp.task('serve', ['build'], function() {

  browserSync.init({
    server: paths.siteDir,
    ghostMode: false, // do not mirror clicks, reloads, etc. (performance)
    logFileChanges: true,
    open: false       // do not open the browser
  });

  // Watch site settings
  gulp.watch(['_config.yml', '_app/localhost_config.yml'], ['build:jekyll:watch']);

  // Watch app .scss files, changes are piped to browserSync
  gulp.watch('_app/styles/**/*.scss', ['build:styles']);

  // Watch app .js files
  gulp.watch('_app/scripts/**/*.js', ['build:scripts:watch']);

  // Watch Jekyll posts
  gulp.watch('_posts/**/*.+(md|markdown|MD)', ['build:jekyll:watch']);

  // Watch Jekyll drafts if --drafts flag was passed
  if (config.drafts) {
    gulp.watch('_drafts/*.+(md|markdown|MD)', ['build:jekyll:watch']);
  }

  // Watch Jekyll html files
  gulp.watch(['**/*.html', '!_site/**/*.*'], ['build:jekyll:watch']);

  // Watch Jekyll RSS feed XML file
  gulp.watch('feed.xml', ['build:jekyll:watch']);

  // Watch Jekyll data files
  gulp.watch('_data/**.*+(yml|yaml|csv|json)', ['build:jekyll:watch']);

  // Watch Jekyll favicon.ico
  gulp.watch('favicon.ico', ['build:jekyll:watch']);
});

// Updates Bower packages
gulp.task('update:bower', function() {
  return gulp.src('')
    .pipe(run('bower install'))
    .pipe(run('bower prune'))
    .pipe(run('bower update'))
    .pipe(notify({ message: 'Bower Update Complete' }))
    .on('error', gutil.log);
});

// Updates Ruby gems
gulp.task('update:bundle', function() {
  return gulp.src('')
    .pipe(run('bundle install'))
    .pipe(run('bundle update'))
    .pipe(notify({ message: 'Bundle Update Complete' }))
    .on('error', gutil.log);
});

// Copies the normalize.css bower package to proper directory and renames it
// so that Sass can include it as a partial
gulp.task('normalize-css', function() {
  return gulp.src(paths.bowerComponentsDir + 'normalize.css/normalize.css')
    .pipe(rename('_reset.scss'))
    .pipe(gulp.dest(paths.appSassFiles + '/base'))
    .on('error', gutil.log);
});

// Places Fontello CSS files in proper location
gulp.task('fontello:css', function() {
  return gulp.src(paths.appVendorFiles + '/fontello*/css/fontello.css')
    .pipe(rename('_fontello.scss')) // so can be imported as a Sass partial
    .pipe(gulp.dest(paths.appSassFiles + '/base'))
    .on('error', gutil.log);
});

// Places Fontello fonts in proper location
gulp.task('fontello:fonts', function() {
  return gulp.src(paths.appVendorFiles + '/fontello*/font/**.*')
    .pipe(rename(function(path) {path.dirname = '';}))
    .pipe(gulp.dest(paths.jekyllFontFiles))
    .pipe(gulp.dest(paths.siteFontFiles))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});

// Places files downloaded from Fontello font generator website into proper
// locations
// Note: make sure to delete old Fontello folder before running this so
// that only the newly downloaded folder matches the glob
gulp.task('fontello', ['fontello:css', 'fontello:fonts']);

// Updates Bower packages and Ruby gems, runs post-update operations, and re-builds
gulp.task('update', ['update:bower', 'update:bundle'], function(cb) {
  runSequence('normalize-css', 'build', cb);
});
