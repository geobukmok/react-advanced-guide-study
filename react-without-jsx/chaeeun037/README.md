# REACT WITHOUT JSX

### Why?

빌드 환경에서 babel compile 옵션 등 컴파일 설정을 별도로 하고싶지 않을 때 JSX 없이 javascript 코드로 React를 사용하는 것이 편리하다.

(개인적으로 쓸데없는듯 하다.)



## javascript로 변환

> JSX는 `React.createElement(component, props, ...children)`를 편하게 호출하기 위해 사용한다.

**JSX** 

```react
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

**javascript로 변환**

```react
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```



`React.createElement`를 짧은 변수에 할당하면 편리하게 사용할 수 있다.

```react
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

