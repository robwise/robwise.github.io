---
title: Using Flow Annotations in Your Redux Reducers
tags:
  - javascript
  - react
  - redux
  - flow
---

Facebook's [Flow][flow] type checker can be a wonderful ally for JavaScript development, but I found that in order to use it in my [Redux][redux] reducers, I needed to switch to what the Redux docs refer to as an "object mapping" style of writing reducers. This is as opposed to the normal `switch` style that is more commonly seen. You can find more information about the two styles in the [reducing boilerplate][redux-reducing-boilerplate] section of the docs (towards the bottom).

## Flow is Hindered by Reducers Written as Switch Statements
 I don't have anything against the `switch` syntax in general, but writing your reducers this way makes it hard to use Flow effectively. Because our actions can potentially come with many different types of payloads, or no payloads at all, we have to effectively make a kitchen sink of annotations:

```js
/* loosely based on Redux's todos example */
function todoReducer(
  state: ?{
    id: number,
    text: string,
    completed: boolean,
    error: ?string,
  },
  action: {
    type: string,
    id: ?number,
    text: ?string,
    completed: ?boolean,
    error: ?string,
  },
) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false,
      };
    case 'TOGGLE_TODO':
      if (state.id !== action.id) {
        return state;
      }

      return Object.assign({}, state, {
        completed: !state.completed
      });
    default:
      return state;
  }
}
```

When an action is dispatched in Redux, it is dispatched to all reducers, so it is quite possible to receive actions in a reducer that have nothing to do with that reducer. Even if the action _does_ have to do with the reducer, different actions implicitly come with different payloads attached to them. All of this means we are forced to make heavy use of [maybe types][flow-maybe-types], and the result is a bunch of very loose annotations that hardly check anything at all.

## Using Flow with the Object-Mapping Reducer Style
Curiously, the Redux docs hint that Redux's use of switch statements may have caused developers to turn elsewhere:

><p>It’s unfortunate that many still choose [a] Flux framework based on whether it uses switch statements in the documentation.</p>
> <cite>- ["Reducing Boilerplate" Redux Documentation][redux-reducing-boilerplate] (retrieved 4/15/2016)</cite>

I can only speculate that Abramov (Redux's creator) has received some pushback for Redux's use of switch statements. Sometimes switch statements can be a code smell indicating one should instead be using polymorphism, but I'm not going to delve into that whole debate. The need to use Flow annotations gives us a completely different reason to avoid the switch syntax.

Instead of using a switch statement to determine what our action's `type` is, we define **handlers**, or functions that handle each different action type. The trick is we use the action's `type` as the name of its handler function. Then when our reducer function receives the action, instead of feeding the action type into a switch statement, we use the `type` to call the appropriate handler function. As usual, we still need to ensure that we return the unchanged state in the case that we received an action for which we don't have a handler (previously handled by the `default` case of the switch).

### createReducer
You can make a quick `createReducer` function to help set all of this up (this is loosely based on the example out of the Redux docs):

```js
function createReducer(initialState: ?{}, handlers: {}) {
  return function reducer(state: ?{} = initialState, action: {type: string}) {
    return handlers.hasOwnProperty(action.type) ? handlers[action.type](state, action) : state;
  };
}
```

### Example
 Refactoring the todos example from above using our new `createReducer` function gives us this:

```js
const initialState = undefined;

const handlers = {
  ADD_TODO(state: void, action: {id: number, text: string}) {
    return {
      id: action.id,
      text: action.text,
      completed: false,
    };
  },
  TOGGLE_TODO(state: {id: number, completed: boolean}, action: {id: number}) {
    if (state.id !== action.id) {
      return state;
    }

    return Object.assign({}, state, {
      completed: !state.completed;
    });
  },
};

const todosReducer = createReducer(initialState, handlers);
```

Now our Flow annotations are specific and relating to exactly what the given handler needs. We are going to receive an error if we get an `ADD_TODO` action that doesn't have any `text` property, and we are going to receive an error if we accidentally pass an `id` as a string in `TOGGLE_TODO` (in which case our guard clause would silently short-circuit the handler, leaving us to wonder why our `todo`'s completion status isn't getting updated).

### Dynamic Handler Function Names
If for some reason you want to use action names dynamically or are importing them from somewhere else instead of using simple strings, that's no problem as you can simply wrap the action type's value in brackets like this:

```js
const handlers = {
  // calling a property
  [actionTypes.addTodo](state: void, action: {id: number, text: string}) {
    // ...
  },
  // executing a function, it all works
  [getToggleTodoActionType()](state: {id: number, completed: boolean}, action: {id: number}) {
    // ...
  },
};
```

[babel-plugin-typecheck]: https://github.com/codemix/babel-plugin-typecheck
[flow]: http://flowtype.org/
[flow-maybe-types]: http://flowtype.org/docs/nullable-types.html
[redux]: http://redux.js.org
[redux-reducing-boilerplate]: http://redux.js.org/docs/recipes/ReducingBoilerplate.html
