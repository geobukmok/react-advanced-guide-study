# [react] ES6 없이 사용하는 React

> 굳이 사용하지 않을 이유가 있나..?

보통의 React App을 개발하는 경우, **ES6** 이상의 문법을 사용하여 개발을 하게 됩니다. 그러나 ES6를 사용하지 않는다면, `create-react-class` 모듈을 사용할 수도 있습니다.

- ES6 class를 사용한 클래스 컴포넌트

  ```jsx
  class Greeting extends React.Component {
    render() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  }
  ```

- `create-react-class`를 사용한 클래스 컴포넌트

  ```jsx
  var createReactClass = require('create-react-class');
  var Greeting = createReactClass({
    render: function() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  });
  ```

  - ~~var 너무 오랜만에..~~

ES6 class의 API는 몇몇 차이점을 제외하고는 `createReactClass()`와 비슷합니다.

<br>

## defaultProps

함수와 class를 통해 `defaultProps`를 컴포넌트 자체 속성으로 정의할 수 있습니다.

```jsx
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'jiyong'
}
```

<br>

그러나 만약 `create-react-class`를 사용한다면 인자로 넘겨지는 객채 내에 **getDefaultProps** 메서드를 정의해야 합니다.

```jsx
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'jiyong'
    }
  }
})
```

<br>

---

<br>

## 초기 State 정의

`create-react-class` 를 사용할 때는 초기 state를 반환하는 **getInitialState**메서드를 제공해야만 합니다.

```jsx
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

<br>

---

<br>

## 바인딩

ES6 class로 선언된 React 컴포넌트에서 메서드는 일반적인 ES6 class 일 때와 비슷합니다. 따라서 **this를 자동적으로 바인딩하지 않습니다.** 그래서 `.bind(this)` 를 사용해주어야 합니다.

```jsx
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // 이 부분이 중요합니다!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }
  render() {
    <button onClick={this.handleClick}>
      Say hello
    </button>
  }
}
```

<br>

하지만 `create-react-class` 를 사용하는 경우, 모든 메서드를 알아서 바인딩하기 때문에 위와 같은 과정이 필요없습니다.

```jsx
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Hello!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
});
```

<br>

---

<br>

## Mixins

추천드리지 않는 방법입니다..