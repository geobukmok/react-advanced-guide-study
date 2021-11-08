# React Without ES6

JavaScript의 class 문법은 ES6 문법이다. React 컴포넌트를 정의할 때 이 class 문법을 사용한다면 다음과 같다.

```jsx
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

하지만 아직 ES6를 사용하지 않는다면 `create-react-class` 모듈을 사용하여 다음과 같이 표현할 수 있다.

```jsx
var createReactClass = require('create-react-class');

var Greeting = createReactClass({
  render: function () {
    return <h1>Hello, {this.props.name}</h1>;
  },
});
```

`createReactClass()`는 ES6 class와 유사하지만 몇가지 다른 점이 있는데, 그 점에 대해 알아본다.

## Declaring Default Props

컴포넌트의 property로 정의하던 `defaultProps`는,

```jsx
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary',
};
```

`createReactClass()`에서는 `getDefaultProps` 메서드로 정의해주어야 한다.

```jsx
var Greeting = createReactClass({
  getDefaultProps: function () {
    return {
      name: 'Mary',
    };
  },

  // ...
});
```

## Setting the Initial State

ES6 class에서는 Initial state를 constructor에서 `this.state`에 할당하였지만,

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialCount };
  }
  // ...
}
```

`createReactClass()`에서는 `getInitialState` 메서드로 정의해주어야 한다.

```jsx
var Counter = createReactClass({
  getInitialState: function () {
    return { count: this.props.initialCount };
  },
  // ...
});
```

## Autobinding

ES6 class로 선언된 React 컴포넌트에서 메서드는 `this`를 컴포넌트 인스턴스에 자동으로 바인딩하지 않는다. 따라서 constructor에서 `.bind(this)`를 통해 바인딩 처리를 해줘야 한다.

```jsx
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: 'Hello!' };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    return <button onClick={this.handleClick}>Say hello</button>;
  }
}
```

하지만 `createReactClass()`에서는 모든 메서드를 바인딩하기 때문에 그럴 필요가 없다.

```jsx
var SayHello = createReactClass({
  getInitialState: function () {
    return { message: 'Hello!' };
  },

  handleClick: function () {
    alert(this.state.message);
  },

  render: function () {
    return <button onClick={this.handleClick}>Say hello</button>;
  },
});
```

즉 ES6 class를 사용해 이벤트 핸들러를 만드는 경우에 boilerplate 코드가 좀 더 많아진다. 하지만 규모가 커질수록 class를 사용하는 것이 약간 더 좋은 성능을 보인다. 이 boilerplate 코드가 마음에 안 든다면 화살표 함수를 사용하는 방법도 있다.
