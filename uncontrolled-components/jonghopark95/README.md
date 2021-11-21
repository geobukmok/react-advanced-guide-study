# Uncontrolled Components



### Uncontrolled Component



HTML에서는 `<input>, <textarea>, <select>` 태그와 같은 폼 엘리먼트는 사용자 입력을 기반으로 자신의 state를 관리하고 업데이트한다.

React에서는, form data가 React Component에 의해 다루어지는 controlled component를 권장한다.



그러나, DOM 내부에서도 어쨌든 사용자 입력을 가지고 있기 때문에, 따로 state를 두지 않고 입력값을 가져오는 방법도 있다.

이를 Uncontrolled Component라 일컫는다.



이 방법은 useRef를 사용해서 DOM의 ref를 지칭하고, submit 시 해당 ref의 값을 가져오는 방법이다.



```jsx
import { useRef } from "react";
import "./styles.css";

export default function App() {
  const inputRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <form onSubmit={onSubmit}>
        <input type="text" ref={inputRef} />
      </form>
    </div>
  );
}
```



Uncontrolled Component는 DOM 내에서 source of truth를 유지하고 있기 때문에, 좀 더 쉽게 핸들링할 수도 있다.

input의 개수가 적을 경우엔 uncontrolled component를 사용하면 보다 더 빠른 개발을 할 수도 있다.



그러나, uncontrolled component는 다음과 같은 단점이 있다.

* 즉각적인 field validation을 수행할 수 없다.
* 조건적인 submit button disabling을 할 수 없다.
* 강제 input formatting을 할 수 없다.
* 하나의 데이터를 위한 여러개의 input을 관리할 수 없다.
* dynamic input을 할 수 없다.



대부분의 경우, controlled component를 사용하는 것이 좋을 것이다.



### Default Values

리액트 렌더링 생명주기에서 form Element의 value 속성은 DOM 의 value를 overriding 한다.

Uncontrolled component 에서, 우리는 리액트가 initial value를 특정하지만, 업데이트는 uncontrolled 하게 하고 싶은 경우가 있을 것이다.

이런 경우, value 대신 defaultValue 를 사용하면 된다.

```jsx
<form onSubmit={onSubmit}>
  <input type="text" ref={inputRef} defaultValue="hi" />
</form>
```



비슷하게, `<input type="checkbox"> , <input type="radio">` 는 defaultChecked를 지원한다.



### File Input Tag

리액트에서 `<input type="file">` 은 항상 uncontrolled component 이다.

이는 유저가 선택할 value는 오로지 유저에 의해 결정되며, 프로그래밍 적으로 결정되는 요소가 아니기 때문이다.

파일을 사용할 땐 File API를 사용하면 된다.

```jsx
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

```
