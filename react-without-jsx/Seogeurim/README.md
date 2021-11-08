# React Without JSX

React를 사용할 때 JSX가 필수적인 것이 아니다. JSX는 `React.createElement(component, props, ...children)` 메서드에 대한 문법적 설탕에 지나지 않는다. 빌드 환경에서 컴파일 설정을 하고 싶지 않다면 JSX를 사용하는 것이 더 편리할 수 있다.

예를 들어 아래와 같이 JSX로 작성된 코드는

```jsx
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(<Hello toWhat="World" />, document.getElementById('root'));
```

`React.createElement()` 메서드를 통해 JS로 작성할 수 있다.

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, { toWhat: 'World' }, null),
  document.getElementById('root')
);
```

`React.createElement` 코드를 타이핑하는 것이 힘들다면, 다음과 같이 변수에 할당하여 짧게 쓸 수 있다.

```js
const e = React.createElement;

ReactDOM.render(e('div', null, 'Hello World'), document.getElementById('root'));
```
