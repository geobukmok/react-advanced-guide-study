# React Without ES6



### create-react-class



React Component를 작성할 때, 함수형 컴포넌트를 작성하지 않는다면 JS Class를 사용해 컴포넌트를 작성한다.

그러나, Class는 ES6에 나온 문법이고, 모종의 이유로 ES6로 작성하길 꺼리는 상황이 올 수가 있다.

그럴 땐, create-react-class 패키지를 사용하면 된다.



```jsx
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```



몇가지 예외 사항을 제외하곤 createReactClass는 ES6 class API 와 비슷하다. 이를 살펴보겠다.



### 차이점 1.  Default Props 선언하기

class Component는 해당 컴포넌트 내부에서 default Props 속성을 가지고 있다.

createReactClass()는 getDefaultProps() 에 object를 넘겨줘야 한다.

```jsx
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```



```jsx
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```





### 차이점 2. 초기 State 세팅하기

ES6 Class에선, constructor 내부에 this.state를 통해 초기 상태를 정의할 수 있다.

createReactClass()는 getInitialState 메소드에 넘겨줘야 한다.

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

```jsx
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```





### 차이점 3. Autobinding

ES6 클래스로 React component를 선언하는 경우, 메소드는 일반적인 ES6 클래스 문법을 따라가게 된다.

클래스는 instance에 자동적으로 this를 바인딩 하지 않으므로, constructor에 .bind() 문법을 명시적으로 사용해줘야 한다.

```jsx
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
    // This line is important!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Because `this.handleClick` is bound, we can use it as an event handler.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```



만약 위 문법이 마음에 들지 않는다면, [experimental Class Property](https://babeljs.io/docs/plugins/transform-class-properties/) 를 사용해 정의할 수 있다. 즉, arrow function을 사용해 바인딩하는 것이다.

```jsx
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Hello!'};
  }
  // WARNING: this syntax is experimental!
  // Using an arrow here binds the method:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```



이 문법은 실험적이라는 점을 꼭 생각하고 사용해야 한다.



이와는 별개로, createReactClass()는 자동적으로 바인딩이 된다.

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



정리하자면, binding을 하기 위해선 다음과 같이 해야 한다.

* constructor와 함께 method를 바인딩한다.
* arrow function을 사용해라. `onClick={(e) => this.handleClick(e)}`
* createReactClass() 를 사용해라.



### Mixins

> ES6는 mixin을 지원하지 않는 상태로 출시되었으므로, React에선 ES6 class를 사용할 경우 이를 지원하지 않는다.
>
> 따라서, 이를 코드에 포함시키는 것을 권장하지 않는다.



만약 완전히 다른 컴포넌트가 기능적으로 비슷한 일을 할 때, createReactClass는 mixin을 사용해 이를 해결할 수 있다. 