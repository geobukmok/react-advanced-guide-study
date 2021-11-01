# REACT JSX

### Why?

근본적으로 JSX는 `React.createElement(component, props, ...children)`함수를 문법적으로 쉽게 사용할 수 있게 한다.

[예시] 

```react
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```

```react
<MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```



## React Element의 타입 지정하기

JSX 태그는 React element의 타입을 결정하고, 대문자로 시작해야 한다. 

### React가 스코프 내에 존재해야 한다

```react
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  return <CustomButton color="red" />;
}
```

### 점 표기법 사용

하나의 모듈에서 여러개의 React 컴포넌트들을 export 하는 경우에 편리하게 사용할 수 있다.

```react
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;}
```

### 사용자 정의 컴포넌트는 반드시 대문자로 시작해야한다

소문자로 시작하는 경우에는 `<div>`등과 같이 내장 컴포넌트와 같이 문자열 형태로 `React.createElement`에 전달된다.

소문자로 시작하는 컴포넌트를 사용하려면 대문자로 시작하는 변수에 할당한 뒤 사용하면 된다. 

### 실행 중에 타입 선택하기

> [코드 출처](https://codesandbox.io/s/n7pn970lvm?file=/src/index.js:0-985)

설계를 추상화함으로써 협업에 용이하고, 확장 가능하고 유연한 코드를 작성할 수 있다.

**[예시] index.js**

```react
import React from "react";
import ReactDOM from "react-dom";
import { PhotoStory, VideoStory } from "./stories";
import "./styles.css";

const components = {
  photo: PhotoStory,
  video: VideoStory
};

const metaData = {
  photo: { name: "photoName", type: "photo" },
  video: { name: "videoName", type: "video" }
};

function Story(props) {
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}

function App() {
  return (
    <div className="App">
      {Object.keys(metaData).map(item => (
        <Story storyType={metaData[item].type} />
      ))}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

**[예시] stories.js**

```react
import React from "react";

export const PhotoStory = props => <p>Photo Story</p>;
export const VideoStory = props => <p>Video Story</p>;
```



## JSX 안에서의 prop 사용

### JavaScript 표현식을 Props에 사용하기

표현식을 prop으로 넘길 수 있다.

`if`와 `for`은 표현식이 아니므로 JSX 밖의 주변 코드에서 사용한다.

### 문자열 리터럴

두 코드는 같다.

```react
<MyComponent message="hello world" />
```

```react
<MyComponent message={'hello world'} />
```

### Props의 기본값은 “True”

두 코드는 같다.

```react
<MyTextBox autocomplete />
```

```react
<MyTextBox autocomplete={true} />
```

### 속성 펼치기

`...`를 전개연산자로 사용해서 전체 객체를 그대로 넘겨줄 수 있다.

두 컴포넌트는 같다.

```react
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;}
```



## JSX에서 자식 다루기

태그 사이의 자식은 `props.children`로 넘겨진다.

### 문자열 리터럴

JSX는 이스케이프 처리를 해주지만, HTML은 이스케이프 처리 되지 않는다.

```react
<div>This is valid HTML &amp; JSX at the same time.</div>
```

### JSX를 자식으로 사용하기

React 컴포넌트는 element로 이루어진 배열을 반환할 수 있다.

```react
render() {
  // 리스트 아이템들을 추가적인 엘리먼트로 둘러쌀 필요 없습니다!
  return [
    // key 지정을 잊지 마세요 :)
    <li key="A">First item</li>,
    <li key="B">Second item</li>,
    <li key="C">Third item</li>,
  ];
}
```

### JavaScript 표현식을 자식으로 사용하기

두 코드는 동일하다.

```react
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

리스트 렌더링 할 때 유용하게 사용할 수 있다.

```react
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['finish doc', 'submit pr', 'nag dan to review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

### 함수를 자식으로 사용하기

```react
// 자식 콜백인 numTimes를 호출하여 반복되는 컴포넌트를 생성합니다.
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

### boolean, null, undefined

`true`, `false`, `null`, `undefined`는 참조는 할 수 있지만 렌더링되지는 않는다.

```react
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

조건부 렌더링할때 유용하게 사용한다.

```react
<div>
  {showHeader && <Header />}
   <Content />
</div>
```

단, 숫자 0과 빈 배열의 경우에는 false가 아니라 렌더링하기 때문에 주의해야한다. [참고](https://developer.mozilla.org/ko/docs/Glossary/Falsy)
