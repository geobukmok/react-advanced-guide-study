# JSX 이해하기 (JSX In Depth)

> 근본적으로, JSX는 `React.createElement(component, props, ...children)` 함수에 대한 문법적 설탕을 제공할 뿐이다.

JSX 문법으로 작성한 다음 코드는

```jsx
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```

아래와 같이 `React.createElement` 메서드를 통해 컴파일된다.

```js
React.createElement(MyButton, { color: 'blue', shadowSize: 2 }, 'Click Me');
```

## React Element의 타입 지정하기

JSX 태그의 첫 부분(like `MyButton`)은 **React element의 타입**을 결정한다.

### React가 스코프 내에 존재해야 한다

앞서 JSX는 `React.createElement` 메서드를 통해 컴파일된다고 언급했다. 따라서 React 라이브러리가 JSX 코드의 스코프 내에 존재해야 한다.

단, JavaScript 번들러를 사용하지 않고 `<script>` 태그를 통해 React를 불러왔다면 React는 전역 변수로 존재하기 때문에 별도로 불러올 필요가 없다.

```jsx
import React from 'react'; // React import
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

### 사용자 정의 컴포넌트는 반드시 대문자로 시작한다

**JSX 태그의 첫 부분이 대문자로 시작하면 사용자 정의 컴포넌트로, 소문자로 시작하면 html 태그로 인식한다.** 사용자 정의 컴포넌트의 경우 같은 이름을 가진 변수를 직접 참조하기 때문에 반드시 스코프 내에 존재해야 한다. 즉 같은 파일 내에 정의했거나 import한 컴포넌트를 가리키게 된다.

```jsx
import React from 'react';

// 잘못된 사용법: 컴포넌트이므로 대문자화 (hello -> Hello)
function hello(props) {
  // 올바른 사용법: <div>는 유효한 HTML 태그
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // 잘못된 사용법: React는 <hello />가 대문자가 아니기 때문에 HTML 태그로 인식하게 됨
  // <hello /> -> <Hello />
  return <hello toWhat="World" />;
}
```

### Dot Notation이 사용 가능하다

JSX 태그에는 dot notation도 사용 가능하다. 하나의 모듈에서 복수의 React 컴포넌트들을 export 하는 경우 사용할 수 있다.

```jsx
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  },
};

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### 런타임에 타입 선택하기

**React element 타입에는 표현식을 사용할 수 없다.**

아래 코드와 같이 런타임에 prop에 따라 다른 컴포넌트를 render해야 하는 경우, 표현식 대신 대문자로 시작하는 변수에 할당한 후 사용할 수 있다.

```jsx
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // 잘못된 사용법: JSX 타입은 표현식으로 사용할 수 없음
  return <components[props.storyType] story={props.story} />;
  // 올바른 사용법
  const SpecificStory = components[props.storyType]; // 대문자로 시작하는 변수에 할당
  return <SpecificStory story={props.story} />;
}
```

## Props in JSX

- JavaScript 표현식을 `{}` 안에 넣어서 prop으로 사용할 수 있다. 단, 표현식만 넣을 수 있고 문(statement, like `if`, `for`)은 넣을 수 없고 따로 분리해야 한다.
- 문자열 리터럴을 prop으로 넘겨줄 수 있다. 단, prop으로 넘겨줄 때 그 값은 HTML 이스케이프 처리가 되지 않는다.

  ```jsx
  // 아래 표현은 동일한 표현
  <MyComponent message="&lt;3" />
  <MyComponent message={'<3'} />
  ```

- prop에 어떤 값도 넘기지 않을 경우, 기본값은 `true`이다.

  ```jsx
  // 아래 표현은 동일한 표현
  <MyTextBox autocomplete />
  <MyTextBox autocomplete={true} />
  ```

- spread 연산자를 이용하여 props로 객체를 그대로 넘겨줄 수 있다.

  ```jsx
  const Button = (props) => {
    const { kind, ...other } = props; // 특정 prop은 사용하고 나머지만 그대로 넘겨줄 수 있다
    const className = kind === 'primary' ? 'PrimaryButton' : 'SecondaryButton';
    return <button className={className} {...other} />;
  };

  const App = () => {
    return (
      <div>
        <Button kind="primary" onClick={() => console.log('clicked!')}>
          Hello World!
        </Button>
      </div>
    );
  };
  ```

## Children in JSX

JSX에서 태그 사이의 내용은 `props.children`이라는 특수한 prop으로 넘겨진다. `props.children`으로는,

- 문자열 리터럴을 넣을 수 있다.

  ```jsx
  <MyComponent>Hello world!</MyComponent>
  ```

- JSX element를 넣을 수 있다. 배열 형식으로도 넣을 수 있다. (React 컴포넌트는 element로 이루어진 배열을 반환할 수 있다 : `key` 지정 필수)

  ```jsx
  <MyContainer>
    <MyFirstComponent />
    <MySecondComponent />
  </MyContainer>
  ```

- `{}`에 감싸서 JavaScript 표현식을 넣을 수 있다.

  ```jsx
  function Item(props) {
    return <li>{props.message}</li>;
  }

  function TodoList() {
    const todos = ['finish doc', 'submit pr', 'nag dan to review'];
    // 배열을 렌더링할 때 유용하게 사용된다.
    return (
      <ul>
        {todos.map((message) => (
          <Item key={message} message={message} />
        ))}
      </ul>
    );
  }
  ```

### boolean, null, undefined는 무시된다

boolean, null, undefined 값은 유효한 자식이지만 렌더링되지 않는다. 아래 JSX 표현식들은 동일하게 렌더링된다.

```jsx
<div />

<div></div>

<div>{true}</div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>
```

이를 이용하여 React element를 조건부 렌더링할 수 있다.

```jsx
// showHeader가 true일 때만 Header 컴포넌트가 렌더링된다.
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

단, `0`과 같은 [falsy 값](https://developer.mozilla.org/ko/docs/Glossary/Falsy)들은 React가 렌더링 한다.

```jsx
// 아래의 경우 props.messages가 빈 배열일 때 0을 출력하게 된다.
<div>{props.messages.length && <MessageList messages={props.messages} />}</div>;
// 따라서 && 앞의 표현식이 언제나 진리값이 되도록 코드를 고쳐야 한다.
<div>{props.messages.length > 0 && <MessageList messages={props.messages} />}</div>;
```

---

이번 문서는 JSX와 관련된 기본 설명들을 위키처럼 나열해놓은 느낌이다. 머릿속에 구멍들을 꽉꽉 채운 느낌!!
