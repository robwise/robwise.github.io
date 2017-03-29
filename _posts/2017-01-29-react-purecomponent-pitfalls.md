---
title: "React PureComponent Pitfalls"
canonical: https://blog.shakacode.com/react-purecomponent-pitfalls-d057882f4b6e
tags:
- react
- javascript
- performance
- pure-component
---

Unnecessary re-renders can slow down your app, especially when rendering large collections where updates to the collection occur frequently. The React docs sometimes refer to these as “wasted” renders. Using React’s PureComponent class can be a excellent way to solve these problems, but you need to be careful that you avoid undermining its effectiveness.

## What are unnecessary re-renders and why do they happen?
Unnecessary re-renders are when React goes through the trouble of calling your component’s `render` method, but it turns out that nothing has changed. In other words, React could have just done nothing and gotten the same result. This re-rendering wastes memory and time.

Once a component mounts, re-renders typically happen for two reasons:

1. The component’s props or state have changed.
1. The component’s parent is re-rendering.

If either of these happens, but they don’t change what the component (or its children) render, you’ve got an unnecessary re-render.

## Preventing re-renders with PureComponent
It’s a good idea to write components so that the `render` method returns the same result given the same props and state. There are several reasons for doing this, but the relevant reason, in this case is that it allows us to use the [PureComponent][pure-component] class from React.

*Note: In order to use PureComponent, you must ensure that you never mutate your state or props.*

```js
class MyClass extends React.PureComponent {
  // ...
}
```

React calls the `shouldComponentUpdate` method to determine whether or not it should re-render your component. PureComponent modifies the implementation of this method to tell React not to re-render if the component’s state and props have not changed.

PureComponent prevents re-renders if the props and state don’t change, but it doesn’t know which props and state are necessary and which aren’t. If the state or props change, but the output of the render method is the same, you still have an unnecessary re-render.

## Potential Pitfalls when Using PureComponent

### Failing to re-render due to mutating props or state
This is explained pretty well in the [React docs][react-docs], so I will only briefly mention it here, but you must be careful to never mutate your props or state. PureComponent only does a shallow comparison, so if you mutate a prop, PureComponent will not realize that the prop changed and will not re-render when it actually should.

### Unnecessary re-renders due to passing entire collection to each item
One of the ways you can undermine the ability of PureComponent to do its job is by passing the entire collection as a prop to each item in the collection:

```js
class List extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div>
        {items.map(item =>
          <Item
            key={item.index}
            index={item.index}
            items={items}
          />
        )}
      </div>
    );
  }
}

class Item extends React.PureComponent {
  render() {
    const { index, items } = this.props;
    return (
      <div>{items[index].description}</div>
    );
  }
}
```

Notice how you pass the entire `items` collection into each `Item` component. If any single item changes, then when the parent, `List`, re-renders, *all* child `Item` components will re-render. PureComponent can’t know whether the props that changed are relevant; all it knows is that the `items` collection given to it in the props has changed.

You can fix this by refactoring so that you only pass down the data that `Item` really needs, and nothing more:

```js
class List extends React.Component {
  render() {
    const { items } = this.props;
    return (
      <div>
        {items.map(item =>
          <Item
            key={item.index}
            description={items[index].description}
          />
        )}
      </div>
    );
  }
}

class Item extends React.PureComponent {
  render() {
    return (
      <div>{this.props.description}</div>
    );
  }
}
```

## Unnecessary re-rendering due to passing irrelevant props
This pitfall is very similar to the case above. Sometimes it’s easy to use the ES6 spread operator to quickly pass down all of a component’s props to its child:

```js
class Parent extends React.Component {
  render() {
    return <Child {...this.props} />
  }
}
```

However, if some of these props aren’t being used and they change, the child will be re-rendered unnecessarily. You can manually refactor this to only pass down the props the child needs, or you can use [this HOC][recompose-hoc] from recompose that will cause the pure component to only receive props that are defined in that component’s prop types. I encourage you to check out this library as there are lots of other great HOCs. I especially like this approach because it also allows me to use the terser SFC syntax which I much prefer (although it still uses a class under the hood):

```js
const Person = (props) => <div>{props.firstName}</div>;
Person.propTypes = { firstName: React.PropTypes.string.isRequired };
export default onlyUpdateForPropTypes(Person);
```

### Unnecessary re-rendering due to passing dynamically-generated functions
Sometimes you may want to pass down a function from a parent to a child. However, if you want to benefit from using PureComponent, you must be careful not to define this function inside of the parent’s `render` method or inside of an SFC. If you do, then every time the parent re-renders it will be creating a brand new function in memory, and PureComponent will consider your child component’s props to have changed.

```js
const Parent = () => {
  const clickHandler = () => console.log('hello world');
  return <PureChildComponent onClick={clickHandler} />;
};
```

# Premature Optimization
Remember that you only need to bother with PureComponent if you are noticing performance problems and have determined that it’s unnecessary re-renders causing them (a great way to determine this is to use React’s [performance tools][performance-tools]). I rarely actually need to use PureComponent, especially because my team uses Redux which comes with its own performance optimizations to `shouldComponentUpdate`. But, it can be incredibly useful in certain cases.

[pure-component]: https://facebook.github.io/react/docs/react-api.html#react.purecomponent
[recompose-hoc]: https://github.com/acdlite/recompose/blob/master/docs/API.md#onlyupdateforproptypes
[react-docs]: https://facebook.github.io/react/docs/optimizing-performance.html#examples
[performance-tools]: https://facebook.github.io/react/docs/perf.html#printwasted
