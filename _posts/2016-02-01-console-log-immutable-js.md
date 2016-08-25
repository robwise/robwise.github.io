---
title: Console Logging Immutable.js Objects
tags:
  - javascript
  - react
  - immutable-js
  - debugging
---

Using [Immutable.js][immutable-js] to keep your React stores in an immutable state is a very good idea. However, if you like to debug via printing to the console, you may be frustrated by the resulting deeply nested and strange-looking output when logging an Immutable.js object to the console. Here are two quick ways to improve the output.

## Method 1: JSON.stringify
Fortunately, Immutable.js has implemented the `toJSON()` method, which is automatically called under-the-hood by the native `JSON.stringify` method ([docs here](json-stringify)). Add the additional arguments shown below to get a nice indented output with two spaces per indent:

```js
console.log(JSON.stringify(myImmutableObj, null, 2));
```

## Method 2: .toJS()
Simply turn your entire state into a normal JS object. This is possible via the `.toJS()` method that is built into the Immutable.js library ([docs here](immutable-to-js)). The advantage to this method is that if you are using something like Chrome's dev tools and you have a large number of properties in your object, you won't get blasted with hundreds of lines of text. Instead, properties will be rolled-up so that you can drill down to only the data that is of interest to you.

```js
console.log(myImmutableObj.toJS());
```

[immutable-js]: http://facebook.github.io/immutable-js/
[json-stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[immutable-to-js]: http://facebook.github.io/immutable-js/docs/#/Map/toJS
