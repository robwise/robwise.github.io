---
title: Testing React-Select with Capybara and Poltergeist
tags:
  - react
  - javascript
  - capybara
  - ruby
  - react-select
  - testing
---

The [react-select][react-select] library is great for creating all sorts of select and autosuggest components. However, it's actually rather complex under the hood and can be a little tricky to test via Rails Capybara tests. Here I present a [Poltergeist][poltergeist]-specific solution to the problem.

There are two complicating factors:

1. it's difficult to get the select component to respond to your input
2. the web driver insists that there is actually an overlapping `<div>` obscuring the input (if Poltergeist detects that you are trying to send keys to something that is obscured by an overlapping element, it will fail)

This solution employs Poltergeist's `native.send_keys` in combination with setting the z-index of the overlapping `<div>` to overcome these obstacles.

I created a tiny helper that is reusable for any tests involving interacting with a react-select component. I put my team's helper in a feature helpers file that we automatically include during our feature tests.

#### feature_helpers.rb
```ruby
def search_react_select_for(text)
  find(".Select").trigger("click")

  fix_overlap = %{ $('.Select-placeholder').css('z-index', -99999) }
  page.execute_script(fix_overlap)

  find(".Select .Select-input input").native.send_keys(text)
end

def click_autosuggest_option(node_type, text)
  find(node_type, text: text, visible: :all, match: :first).click
end
```

An easy way to get the `node_type` in the `click_autosuggest_option` helper is to just customize your react-select renderer so that it adds a custom class or id for you to reference in your tests. For example:

#### SelectUser.jsx
```js
const optionRenderer = (option) => (
  <div id={option.id} className="user-option">
    {option.firstName}
  </div>
);

//...

return <Select optionRenderer={optionRenderer} />;
```

Now you can write Capybara tests like this:

#### select_user_spec.rb
```ruby
scenario "user searches for john", :js do
  user = create(:user, first_name: "john")

  search_react_select_for("john")
  click_autosuggest_option(".user-option", "john") # here we're matching using the class name

  # expectation goes here
end
```

Because Capybara auto-waits when you call `find` (and have the `:js` metatag), asynchronous calls are no problem. Just **make sure to specify `:js` meta tag** for your tests. I hope this helps!

[react-select]: https://github.com/JedWatson/react-select
[react-on-rails]: https://github.com/shakacode/react_on_rails
[poltergeist]: https://github.com/teampoltergeist/poltergeist
