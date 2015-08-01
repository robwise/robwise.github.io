var gutil = require('gulp-util');

module.exports = {
  production: !!gutil.env.production, // pass --production flag to enable
  drafts:     !!gutil.env.drafts      // pass --drafts flag to serve drafts
};
