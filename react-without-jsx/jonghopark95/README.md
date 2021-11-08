# React Without JSX



> JSX는 React를 사용하는데에 있어 필수 불가결한 요소가 아니다. JSX를 사용하지 않는 것은 build 환경에서 compile 세팅을 하기 싫을 때 특히 편리하다.



JSX Element 는 단지 `React.createElement(component, props, ...children)` 을 호출하기 위한 syntactic sugar 이다.

따라서, JSX로 할 수 있는 모든 것은 JS 문법을 사용해 해결할 수 있다.



```jsx
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



윗 문장은 JSX를 사용하지 않으면 다음과 같이 작성할 수 있다.

```jsx
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



**즉 Component는 string, React.Component의 subclass, 또는 평범한 함수로서 제공되어질 수 있다.**



React.createElement를 타이핑하는 패턴이 지겹다면 짧은 변수에 할당하여 사용하는 방법이 있다.

```jsx
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```