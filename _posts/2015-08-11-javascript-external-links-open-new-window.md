---
title: Use JavaScript to Make External Links Open in a New Window
tags:
    - javascript
    - jquery
    - jekyll
    - markdown
    - ux
---

This is a quick post showing how to use JavaScript to make links to external websites open in a new window (or tab) instead of in the current window. This is useful for [Jekyll][jekyll] blogs because the Markdown converters don't do this for you. I included two versions: one that uses straight JavaScript, and one that requires [jQuery][jquery] but is shorter.

Both versions work basically the same way: grab all anchor tags (`<a href="#">`) that are linking to somewhere other than your development environment or a page on your site and then attribute `target="_blank"` to those tags. Because this is JavaScript, users with JavaScript disabled will still experience the old behavior, but otherwise won't be adversely affected.

I wrote a regex that should work for most slugs, just replace the string in the `website` variable with your own and make sure to escape any backslashes. You can reference mine for an example of what I mean&mdash;I escaped the period with a backslash (which is normal for regexes), but because it's JS I also need to escape *that* backslash.

## Straight JavaScript

This version does not require any jQuery (or any other libraries):

```js
// Works like jQuery's $(document).ready.
// Supports IE8+. Courtesy of http://youmightnotneedjquery.com/
function ready(fn) {
  if (document.readyState != 'loading') {
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState != 'loading')
        fn();
    });
  }
}

ready(function() {

  // REPLACE THIS WITH YOUR OWN SITE. ESCAPE ANY BACKSLASHES.
  var website = 'robwise\\.github\\.io';
 
  var internalLinkRegex = new RegExp('^((((http:\\/\\/|https:\\/\\/)(www\\.)?)?'
                                     + website
                                     + ')|(localhost:\\d{4})|(\\/.*))(\\/.*)?$', '');

  var anchorEls = document.querySelectorAll('a');
  var anchorElsLength = anchorEls.length;

  for (i = 0; i < anchorElsLength; i++) {
    var anchorEl = anchorEls[i];
    var href = anchorEl.getAttribute('href');

    if (!internalLinkRegex.test(href)) {
      anchorEl.setAttribute('target', '_blank');
    }
  }
});
```

## jQuery
This version requires jQuery in order to work, but if you're using jQuery on your site anyway, it avoids reinventing the wheel:

```js
$(document).ready(function() {

  // REPLACE THIS WITH YOUR OWN SITE. ESCAPE ANY BACKSLASHES.
  var website = 'robwise\\.github\\.io';
  
  var internalLinkRegex = new RegExp('^((((http:\\/\\/|https:\\/\\/)(www\\.)?)?'
                                     + website
                                     + ')|(localhost:\\d{4})|(\\/.*))(\\/.*)?$', '');

  $('a').filter(function() {
    var href = $(this).attr('href');
    return !internalLinkRegex.test(href);
  })
  .each(function() {
    $(this).attr('target', '_blank');
  });

});
```


## Disclaimer
Not everyone may agree with doing this. Shortcut-savvy users can simply hold down <kbd>command</kbd>/<kbd>ctrl</kbd> when clicking a link to ensure they open links in a new window. If they purposely want to navigate in the same window, they simply don't hold down the shortcut. 

However, because we are forcing a new window with JavaScript, there isn't a way *not* to open a new window, so you're effectively removing the user's ability to choose.

I admit I am biased because, personally, I almost always want to open external links in a new tab. I find it very annoying when I click a link and then get lead away from what I was reading.

[jquery]: http://jquery.com
[jekyll]: http://jekyllrb.com
