# REACT WITHOUT ES6

### Why?

아직 ES6를 사용하지 않는다면 `create-react-class`모듈을 사용할 수 있다.



## createReactClass()

ES6 class의 API와의 몇몇 차이점을 제외하고는 비슷하다.

다음은 컴포넌트 정의 코드이다.

**[예시] ES6**

```react
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

**[예시] `createReactClass()`**

```react
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Hello, {this.props.name}</h1>;
  }
});
```



## Props 기본값 선언

**ES6 - `defaultProps` 사용**

```react
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};
```

**`createReactClass()` -  `getDefaultProps()` 사용** 

```react
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Mary'
    };
  },

  // ...

});
```



## 초기 State 정의

**ES6 - `this.state`에 할당**

```react
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

**`createReactClass()` -  `getInitialState` 제공** 

```react
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```



## 자동 바인딩

**ES6 - `.bind(this)` 사용**

반복되는 코드는 많아지더라도 큰 규모의 애플리케이션에서는 class를 사용하는 경우에 성능이  좋아진다.

```react
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
    // `this.handleClick`이 바인딩 되었기 때문에, 이를 이벤트 핸들러로 사용할 수 있습니다.
    return (
      <button onClick={this.handleClick}>
        Say hello
      </button>
    );
  }
}
```

**`createReactClass()`** 

```react
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



## Mixins

> 주의: mixin은 ES6에서 별도의 지원이 없기 때문에 참고만 하고 사용하지 않는 것을 추천한다.

관계 없는 컴포넌트들이 유사한 기능을 공유할 수도 있다. 이러한 [횡단 관심사](https://ko.wikipedia.org/wiki/횡단_관심사)를 해결하기 위해 `createReactClass`의 `mixins`을 사용할 수 있다.

시간 간격을 두고 반복적으로 스스로 내용을 갱신하는 컴포넌트를 만들 때 `setInterval()`을 사용한다. 이 때, 메모리를 절약하기 위해서 컴포넌트를 더 이상 사용하지 않을 때 없애는 것이 중요하다. 

생명주기 메서드를 이용하는 간단한 mixin을 통해 컴포넌트가 파괴될 때 자동으로 정리되도록 만들 수 있다.

```react
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // mixin을 사용
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // mixin에서 메서드를 호출
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React has been running for {this.state.seconds} seconds.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

 mixin에서 정의된 생명주기 메서드들은 mixin이 나열된 순서대로 작동되며 그 뒤에 컴포넌트의 메서드가 호출된다.

