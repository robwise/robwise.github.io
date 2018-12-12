---
title: Testing Optimistically-Updating UI with Capybara
tags:
  - rails
  - react
  - js
  - ruby
  - capybara
  - testing
---

It's part of Capybara's philosophy to write tests from the perspective of the user. When we interact with the page, we determine whether or not the system is behaving correctly by looking at what was rendered in response (just like a user would), and not by checking database counts or anything else under-the-hood that a user wouldn't know about. Optimistically-updating UI, however, instantly responds to user interactions without waiting for the Ajax request to complete. This makes testing difficult because assertions will immediately pass, and the test suite will attempt to move on to the next example or next action.

RSpec is running the same Rails process for all the tests (assuming you haven't parallelized your test suite), and your Rails controllers have no concept of which test you are running or from which test a request originated. This means that if your assertions pass quickly enough, RSpec will move on to the next test before an Ajax request can even get to the controller. The request doesn't disappear, however&mdash;it doesn't have any concept of what your test suite is doing.

This can cause some very strange errors. If you are using [DatabaseCleaner](https://github.com/DatabaseCleaner/database_cleaner) you will sometimes see a `PG:Deadlock` error. DatabaseCleaner uses a database-wide transaction for the duration of each test and then rolls back this transaction afterward to return the database to a pristine state. Sometimes requests will come in during this transaction rollback and your controllers will try to initiate some type of CRUD operation that collides with the rollback and you get the deadlock error. If you aren't using DatabaseCleaner, your errors will be even more subtle, as you may intermittently be leaking state from one example to another.

## Solution for jQuery
This [Thoughtbot article](https://robots.thoughtbot.com/automatically-wait-for-ajax-with-capybara) demonstrates a great way to solve this problem if you are using [jQuery](https://github.com/jquery/jquery). Essentially, the jQuery object on the window is aware at all times whether there are pending Ajax requests in the works. By ensuring that there are no such pending requests, the tester can force Capybara to wait until all requests are complete.

## Solution if not using jQuery
But what if we aren't using jQuery? There are many lighter-weight Ajax libraries out there, such as [WHATWG fetch](https://github.com/github/fetch), that don't have this pending requests functionality.

Below, you can see how we can write our own implementation by making a wrapper function that we always use for our Ajax requests. I am using ES6 here as well as the [lodash](https://github.com/lodash/lodash) library for creating a unique id.

*Brief Aside:* I'm a huge fan of lodash, so I want to help get the word out: if you are put off by the notion of including all of lodash just for a couple of functions, [John-David Dalton](https://twitter.com/jdalton) (creator of lodash) has [modularized each method](https://www.npmjs.com/browse/keyword/lodash-modularized) into its own micro-package!

#### createAjaxRequestTracker
```js
import _ from 'lodash';

const pendingAjaxRequestUuids = new Set();
const bodyEl = document.body;
const ATTRIBUTE_NAME = 'data-pending_ajax_requests';

const updateBodyAttribute =
  () => bodyEl.setAttribute(ATTRIBUTE_NAME, !_.isEmpty(pendingAjaxRequestUuids));

export default function createAjaxRequestTracker() {
  const requestUuid = _.uniqueId();

  return {
    start() {
      pendingAjaxRequestUuids.add(requestUuid);
      updateBodyAttribute();
    },

    end() {
      pendingAjaxRequestUuids.delete(requestUuid);
      updateBodyAttribute();
    },
  };
}
```

Then we create a wrapper around our Ajax request function that uses this tracker. Here I show an example of a wrapper for the [WHATWG fetch](https://github.com/github/fetch) library:

#### trackedFetch
```js
export default function trackedFetch(reqUrl, reqParams) {
  ajaxRequestTracker.start();

  return fetch(reqUrl, reqParams)
    .then(res => {
      ajaxRequestTracker.end();
      return res;
    })
    .catch(err => {
      ajaxRequestTracker.end();
      throw err;
    })
    ;
}
```

Lastly, back in Ruby now, we define a method in our feature helpers to look for this data attribute on the body tag with a value of `false`. If its value is currently `true`, Capybara will automatically wait its `default_max_wait_time` for the value to change back to `false`.

Simply place a call to this method anywhere you in your test to essentially "pause" Capybara until all Ajax requests on the page are completed.

#### wait_for_ajax
```ruby
def wait_for_ajax
  expect(page).to have_css('body[data-pending_ajax_requests="false"]')
end
```

Don't forget you need the RSpec `js` meta tag for your example or Capybara won't auto-wait! I've found that this has drastically cut down on intermittent test failures.
