---
title: 'Quick Tip: Import CSS from Node Modules Using Webpack and CSS-Loader'
tags:
  - quick-tip
  - webpack
  - css-loader
  - css
---

Here's a quick tip for importing CSS directly from your `node_modules` folder when using webpack and the CSS Loader. This is superior to just copy-and-pasting the CSS code because it ensures that project will always be in sync with your version of the library, you don't have to remember to update the styles manually, and it's a lot less work!

## Use ~
```css
@import "~some-package/some-stylesheet";

div {
  background-image: url("~some-package/some-image.png");
}
```
For more info, check out the [CSS Loader Options][css-loader] docs.

## Don't forget :global if using CSS Modules
If you are using [CSS Modules](), make sure to use the `:global` selector so that the classnames are not inadvertently hashed.

```css
:global {
  @import "~some-package/some-stylesheet";
}
```

For more info, check out the [CSS Modules Exceptions][css-modules] docs.


[css-loader]: https://github.com/webpack-contrib/css-loader#options
[css-modules]: https://github.com/css-modules/css-modules#exceptions
