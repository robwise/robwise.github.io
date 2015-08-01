var paths = {};

// Directory locations
paths.appDir             = '_app/';  // The files Gulp will work on
paths.jekyllDir          = '';       // The files Jekyll will work on
paths.siteDir            = '_site/'; // The resulting static site
paths.bowerComponentsDir = paths.appDir + 'bower_components/';

// Folder naming conventions
paths.postFolderName   = '_posts';
paths.draftFolderName  = '_drafts';
paths.imageFolderName  = 'images';
paths.fontFolderName   = 'font';
paths.vendorFolderName = 'vendor';
paths.scriptFolderName = 'scripts';
paths.stylesFolderName = 'styles';

// App files locations
paths.appSassFiles   = paths.appDir  + paths.stylesFolderName;
paths.appJsFiles     = paths.appDir  + paths.scriptFolderName;
paths.appImageFiles  = paths.appDir  + paths.imageFolderName;
paths.appFontFiles   = paths.appDir  + paths.fontFolderName;
paths.appVendorFiles = paths.appDir  + paths.vendorFolderName;

// Jekyll files locations
paths.jekyllPostFiles  = paths.jekyllDir + paths.postFolderName;
paths.jekyllDraftFiles = paths.jekyllDir + paths.draftFolderName;
paths.jekyllImageFiles = paths.jekyllDir + paths.imageFolderName;
paths.jekyllFontFiles  = paths.jekyllDir + paths.fontFolderName;

// Site files locations
paths.siteImageFiles   = paths.siteDir   + paths.imageFolderName;
paths.siteFontFiles    = paths.siteDir   + paths.fontFolderName;

// Glob patterns by file type
paths.sassPattern        = '/**/*.scss';
paths.jsPattern          = '/**/*.js';
paths.imagePattern       = '/**/*.+(jpg|JPG|jpeg|JPEG|png|PNG|svg|SVG|gif|GIF|webp|WEBP|tif|TIF)';
paths.markdownPattern    = '/**/*.+(md|MD|markdown|MARKDOWN)';
paths.htmlPattern        = '/**/*.html';
paths.xmlPattern         = '/**/*.xml';

// App files globs
paths.appSassFilesGlob     = paths.appSassFiles     + paths.sassPattern;
paths.appJsFilesGlob       = paths.appJsFiles       + paths.jsPattern;
paths.appImageFilesGlob    = paths.appImageFiles    + paths.imagePattern;

// Jekyll files globs
paths.jekyllPostFilesGlob  = paths.jekyllPostFiles  + paths.markdownPattern;
paths.jekyllDraftFilesGlob = paths.jekyllDraftFiles + paths.markdownPattern;
paths.jekyllHtmlFilesGlob  = paths.jekyllDir        + paths.htmlPattern;
paths.jekyllXmlFilesGlob   = paths.jekyllDir        + paths.xmlPattern;

// Site files globs
paths.siteHtmlFilesGlob    = paths.siteDir + paths.htmlPattern;

// One-offs
paths.tota11y              = paths.vendorFilesApp  + '/tota11y.min.js';

module.exports = paths;
