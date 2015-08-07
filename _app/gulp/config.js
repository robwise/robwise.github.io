var gutil = require('gulp-util');

module.exports = {
  drafts:     !!gutil.env.drafts      // pass --drafts flag to serve drafts
};
