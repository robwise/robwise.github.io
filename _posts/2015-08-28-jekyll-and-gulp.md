---
title:  "Integrating Gulp into your Jekyll Workflow"
tags: 
    - jekyll
    - gulp
    - devops
    - github
---

This is a walk-through demonstrating how to integrate [Gulp.JS][gulp] into your [Jekyll][jekyll] site's workflow. This is especially geared towards sites deployed on [GitHub Pages][github-pages] because I will show how to use Gulp without sacrificing GitHub's Jekyll integration support.

## Why Use Gulp for a Jekyll Site?
There were a couple of development niceties that I was missing with vanilla Jekyll:

+ minification/uglification of my JavaScript files
+ ability to easily switch to using the ES2015 syntax in the future
+ [BrowserSync][browser-sync] (sort of like [LiveReload][livereload] or running `jekyll serve --watch` and then manually refreshing, but faster)
+ image optimization/resizing
+ styles autoprefixing

Once set up correctly, the workflow is exactly the same for simple things like publishing a new post&mdash;put the Markdown file in the `_posts` folder and push to GitHub.

## GitHub Pages & Jekyll Support
GitHub Pages offers an excellent service. They host your site for free and use Jekyll on their back end. That means a user can can simply push their Jekyll project source repo to GitHub in order to deploy it (it's sort of like deploying on [Heroku][heroku] in that way). Users can even write new posts in their browser using GitHub's Markdown editor to be automatically deployed as soon as they hit save&mdash;all without ever even touching local files.

The problem is that GitHub Pages won't run any build tools like Gulp. Many bloggers have resorted to building the site locally and then pushing the generated static files to their repos. Their actual source files are either in a different branch or a different repo entirely. However, GitHub Pages requires the production files to be on the default branch, so visitors to the repo will initially only see the generated static files.

That's sort of a pain&mdash;it requires maintaining two different sets of files and people might not know to they have to change branches to see the source code.

There are [some scripts][deploy-to-github-repo] for automating this process if this approach still doesn't seem so bad to you. It's unfortunately really the only option right now if you also want to use [Jekyll plugins][jekyll-plugins] not supported by GitHub Pages, [which is almost all of them][list-of-github-plugins]. I find all of these solutions to be pretty ugly, so I chose to use a build tool while still having GitHub Pages build my site from source.

## App Files vs. Jekyll Files
In my workflow, Gulp handles building the assets (images, scripts, styles), and Jekyll handles building the HTML and just copies the generated Gulp files as static files.

GitHub Pages requires that the source files, what I will call the **Jekyll files**, be in the root directory of the repo. Ultimately, everything that GitHub Pages needs to build the site with Jekyll will need to be present here. 

The trick is that only some of these files are the original source files, while others are generated output resulting from running files through Gulp. Any files that need to be run through Gulp before they become Jekyll files are what I will call the **app files**.

### Non-Gulp-Generated Jekyll Files
Anything that can be fed directly to Jekyll without needing to be generated/modified by Gulp should be placed in the root directory:

+ `_posts/`
+ `_layouts/`
+ `_includes/`
+ `_drafts/`
+ Jekyll pages

### App Files
The app files are all put in a folder that is hidden from Jekyll (which is accomplished by excluding them in the Jekyll `_config.yml` file). I called my folder `_app`, but it's up to you. In here, I have things like:

+ `images/`: these require optimization and resizing
+ `scripts/`: these require concatenation and uglification
+ `styles/`: these require Sass compilation, auto-prefixing, and minification
+ `localhost_config.yml`: a Jekyll config file that overrides some of the values that need to be different in development than what GitHub Pages will use


### Gulp-Generated Files
`main.js`, `main.css`, and the `images` folder are generated output from Gulp. Jekyll will simply copy these files over to the static `_site` directory. As you will see later, we also explicitly tell Gulp to put a copy of these generated files in the `_site` directory for the benefit of BrowserSync.

#### Site Structure

```
.
├── _app/
|   ├── images/
|   |   └── cat.jpg
|   ├── scripts/
|   |   ├── animateThis.js
|   |   └── animateThat.js
|   ├── styles/
|   |   ├── _variables.scss
|   |   └── main.scss
|   └── localhost_config.yml
├── _drafts/
|   └── on-simplicity-in-technology.markdown
├── _includes/
|   ├── footer.html
|   └── header.html
├── _layouts/
|   ├── default.html
|   └── post.html
├── _posts/
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
├── _data/
|   └── members.yml
├── _site/
├── images/
|   └── cat.jpg
├── node_modules/
|   └── ...
├── _config.yml
├── .gitignore
├── .jekyll-metadata
├── Gemfile
├── gulpfile.js
├── package.json
├── main.js
├── main.css
├── index.html
└── feed.xml
```

### Jekyll Configs
As I listed above, we actually have two configs. The first is the main Jekyll config that goes in the root directory. This is what GitHub will use to build your site and also where almost all of your config options should go. 

#### config.yml
```yaml
url: "https://mysite.github.io" # the base hostname & protocol for your site
baseurl: ""                     # the subpath of your site, e.g. /blog/
#... 
title: My Site
disqus_shortname: 'your-shortname' # ignore this if not using Disqus
keep_files: []
exclude: ["_app",
          "Gemfile",
          "Gemfile.lock",
          "gulpfile.js",
          "node_modules",
          "package.json"] # Don't forget that Jekyll automatically 
                          # excludes files with a dot prefix
```

The second config file is inside that special `_app` directory (or whatever you chose to call it) and overrides values in the main config. Things like absolute links will not work properly otherwise (especially important if you are not hosting your site at the root of your domain, since sourcing assets with URLs relative to the root won't work). I also chose to use a different [Disqus][disqus] shortname for development, which is recommended in their [specs][disqus-developer-recommendations].

#### \_app/localhost\_config.yml

```yaml
url: "" # blank in development

development: true # optional, you can use in liquid tag conditionals
disqus_shortname: 'your-shortname-dev' # ignore this if not using Disqus
```

When we run Jekyll's build process, we can specify which config files we want it to use. If we specify multiple config files, Jekyll will merge the configurations, defaulting to the last specified config if there are conflicts.

### Gulpfile
Our gulpfile defines the tasks so that all we need to do at the command line to build the application is run `gulp build` or `gulp serve`. I'm using variables for my paths, but they are pretty self-explanatory once you understand the naming scheme:

+ `jekyllDir` is the root directory because GitHub forces Jekyll to use it as the source
+ `siteDir` is the `_site` directory that Jekyll outputs
+ `appDir` is the `_app` directory that is excluded from Jekyll

In the interest of brevity I did not include the require statements or any cleaning tasks for those files output by Gulp into the Jekyll (a.k.a. root) directory, but they are pretty straightforward Gulp stuff.

#### config

```js
var config = {
  drafts:     !!gutil.env.drafts      // pass --drafts flag to serve drafts
};
```

#### build:styles

```js
// Uses Sass compiler to process styles, adds vendor prefixes, minifies,
// and then outputs file to appropriate location(s)
gulp.task('build:styles', function() {
  return sass(paths.appSassFiles + '/main.scss', {
    style: 'compressed',
    trace: true // outputs better errors
  }).pipe(autoprefixer({browsers: ['last 2 versions', 'ie >= 10']}))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.jekyllDir))
    .pipe(gulp.dest(paths.siteDir))
    .pipe(browserSync.stream())
    .on('error', gutil.log);
});
```

#### build:images

```js
// Creates optimized versions of images, 
// then outputs to appropriate location(s)
gulp.task('build:images', function() {
  return gulp.src(paths.appImageFilesGlob)
    .pipe(imagmin())
    .pipe(gulp.dest(paths.jekyllImageFiles))
    .pipe(gulp.dest(paths.siteImageFiles))
    .pipe(browserSync.stream())
    .pipe(size({showFiles: true}))
    .on('error', gutil.log);
})
```

#### build:scripts

```js
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
```

#### build:jekyll

```js
// Runs Jekyll build
gulp.task('build:jekyll', function() {
  var shellCommand = 'bundle exec jekyll build --config _config.yml,_app/localhost_config.yml';
  if (config.drafts) { shellCommand += ' --drafts'; };

  return gulp.src(paths.jekyllDir)
    .pipe(run(shellCommand))
    .on('error', gutil.log);
});
```

#### build

```js
// Builds site
// Optionally pass the --drafts flag to enable including drafts
gulp.task('build', function(cb) {
  runSequence(['build:scripts', 'build:images', 'build:styles', 'build:fonts'],
              'build:jekyll',
              cb);
});
```


#### build:jekyll:watch, build:scripts:watch

```js
/* Sass and image file changes can be streamed directly to BrowserSync without 
reloading the entire page. Other changes, such as changing JavaScript or 
needing to run jekyll build require reloading the page, which BrowserSync
recommends doing by setting up special watch tasks.*/
// Special tasks for building and then reloading BrowserSync
gulp.task('build:jekyll:watch', ['build:jekyll'], function(cb) {
  browserSync.reload();
  cb();
});
gulp.task('build:scripts:watch', ['build:scripts'], function(cb) {
  browserSync.reload();
  cb();
});
```

#### serve

```js
// Static Server + watching files
// WARNING: passing anything besides hard-coded literal paths with globs doesn't
//          seem to work with the gulp.watch()
gulp.task('serve', ['build'], function() {

  browserSync.init({
    server: paths.siteDir,
    ghostMode: false, // do not mirror clicks, reloads, etc. (performance optimization)
    logFileChanges: true,
    open: false       // do not open the browser (annoying)
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
```

## Recap

So that's it&mdash;build your site by running `gulp build`. Run a local BrowserSync server by running `gulp serve`. All files are in the same branch of the same repo, and you can still simply add new Markdown files to your `_posts` folder and expect GitHub Pages to handle the rest. I admit that the folder organization is sort of hacky/ugly, and therefore this is somewhat of a trade-off, but perhaps there are some who will find this useful.

[browser-sync]: http://www.browsersync.io/docs/gulp/
[deploy-to-github-repo]: https://github.com/X1011/git-directory-deploy
[disqus-developer-recommendations]: https://help.disqus.com/customer/portal/articles/1053796-best-practices-for-staging-development-and-preview-sites 
[disqus]: https://disqus.com/
[github-pages]: https://pages.github.com/ 
[gulp]: http://gulpjs.com/
[heroku]: https://www.heroku.com/
[jekyll-plugins]: http://jekyllrb.com/docs/plugins/
[jekyll]: http://jekyllrb.com/
[list-of-github-plugins]: https://help.github.com/articles/using-jekyll-plugins-with-github-pages/
[livereload]: http://livereload.com/
[markdown]: http://daringfireball.net/projects/markdown/

