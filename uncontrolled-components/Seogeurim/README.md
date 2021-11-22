# Uncontrolled Components

대부분의 경우 폼을 구현하는데 제어 컴포넌트를 사용하는 것이 좋다.

- 제어 컴포넌트 (controlled components) : 폼 데이터가 React 컴포넌트에서 다뤄짐
- 비제어 컴포넌트 (uncontrolled components) : 폼 데이터가 DOM 자체에서 다뤄짐

제어 컴포넌트는 모든 state 업데이트에 대한 이벤트 핸들러를 작성하는 반면, 비제어 컴포넌트는 `ref`를 사용하여 DOM에서 폼 값을 가져올 수 있다.

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

비제어 컴포넌트를 사용할 경우 DOM에 신뢰 가능한 출처를 유지하므로 React와 non-React 코드를 통합하는 것이 쉬울 수 있다는 장점이 있다. 하지만 공식 문서에서는 일반적으로 제어 컴포넌트를 사용하는 것을 권장하고 있다.

## Default Values

비제어 컴포넌트를 사용하면 React 초깃값을 지정하는 것 이후의 업데이트는 제어하지 않는 것이 좋다. 이런 경우에는 `value` 어트리뷰트 대신 `defaultValue`를 지정할 수 있다. `defaultValue`는 컴포넌트 마운트 이후 값이 변경되더라도 DOM이 업데이트되지 않는다.

```jsx
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

- input type `checkbox`와 `radio`는 `defaultChecked` 지원
- `<select>`와 `<textarea>`는 `defaultValue` 지원

## The file input Tag

React에서 `<input type="file" />`은 프로그래밍적으로 값을 설정 할 수 없고 사용자만이 값을 설정할 수 있기 때문에 항상 비제어 컴포넌트이다.

다음 코드와 같이 구현할 수 있다.

```jsx
class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${this.fileInput.current.files[0].name}`);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={this.fileInput} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

ReactDOM.render(<FileInput />, document.getElementById('root'));
```
