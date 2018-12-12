---
title: Aborting Fetch Requests in React
date: '2018-02-22 02:09'
tags:
  - javascript
  - react
  - whatwg-fetch
  - ajax
---

This method can really be applied to any framework, but I'm going to explain how to do this within the context of React. It's generally a good idea to cancel your Ajax requests if you no longer actually care about the response, but it's only recently become possible with fetch thanks to  [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort).

## Why Abort?
In my case, I had a table where you could hover over any row and see a tooltip. This tooltip needed to load its information on the fly. Because a user is constantly hovering and unhovering, it was very common that my component would call `setState` after it had unmounted. This would happen when my component mounted, started the Ajax request, unmounted, and then tried to call `setState` when the Ajax request finally resolved. This would throw something similar to the following error:

> Error: Can only update a mounted or mounting component. This usually means you called setState() on an unmounted component. This is a no-op. Please check the code for the undefined component.

Dan Abramov [recommends cancelling the request](https://github.com/facebook/react/issues/2787#issuecomment-304485634) so that the `then` never fires. [Axios](https://github.com/axios/axios) has support for this out of the box, but if you're using the [WHATWG-Fetch standard](https://fetch.spec.whatwg.org/) (via its [polyfill](https://github.com/github/fetch)), you will need to do a bit more work. Apparently, this has been a very long-requested feature, but there was a bunch of [back and forth](https://developers.google.com/web/updates/2017/09/abortable-fetch#the_history) on it during the proposal phase. Browsers are only just now adding support (the latest Firefox has it implemented at the time I'm writing this, see: [Chrome](https://bugs.chromium.org/p/chromium/issues/detail?id=750599), [Safari](https://bugs.webkit.org/show_bug.cgi?id=174980)).

## Polyfill
The way you cancel a fetch request is using a new API called `AbortController`. You will most likely want to use [this polyfill](https://github.com/mo/abortcontroller-polyfill) until browser support gets a little better. Note that this doesn't actually truly implement `AbortController` but rather throws an error when you try to cancel. This error looks exactly like what the un-polyfilled `AbortController` throws, so at the end of the day, the effect is basically the same.

## Implementation

```js
class MyComponent extends React.Component {
  state = { data: null };

  componentDidMount = () =>
    fetch
      .get('http://www.example.com', { signal: this.abortController.signal })
      .then(data => this.setState({ data }))
      .catch(error => {
        if (error.name === 'AbortError') return; // expected, this is the abort, so just return
        throw error; // must be some other error, handle however you normally would
      });

  componentWillUnmount = () => this.abortController.abort();

  abortController = new window.AbortController();

  render = () => <div>{this.state.data ? this.state.data : 'loading'}</div>;
}
```

## Explanation
Here we give fetch a `signal` option in the second, "options" argument. This is the AbortController's signal.

Then, in `componentWillUnmount`, I call the controller's `abort` method. Note that I'm aborting in `componentWillUnmount` simply because that's when I want to abort in this example (to prevent that pesky setState error), but you can abort from anywhere you want.

The other key piece is to catch the error that is thrown. When you call the AbortController's `abort` method, the fetch Promise is going to throw an error with the name `AbortError`. Since this is actually expected, we can safely ignore it. Make sure to re-throw if it's not an AbortError, however, so you don't swallow other errors accidentally.

## Thanks to Jake Archibald
This post was inspired by Jake Archibald's post [here](https://developers.google.com/web/updates/2017/09/abortable-fetch).
