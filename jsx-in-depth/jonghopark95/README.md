# JSX In Depth

> JSX는 React.createElement(component, props, ...children) 함수의 syntactic sugar 역할을 한다.



React.createElement는 다음과 같은 선언 형식을 가지고 있다.

```tsx
 function createElement(
        type: "input",
        props?: InputHTMLAttributes<HTMLInputElement> & ClassAttributes<HTMLInputElement> | null,
        ...children: ReactNode[]): DetailedReactHTMLElement<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
    function createElement<P extends HTMLAttributes<T>, T extends HTMLElement>(
        type: keyof ReactHTML,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): DetailedReactHTMLElement<P, T>;
    function createElement<P extends SVGAttributes<T>, T extends SVGElement>(
        type: keyof ReactSVG,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): ReactSVGElement;
    function createElement<P extends DOMAttributes<T>, T extends Element>(
        type: string,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): DOMElement<P, T>;

    // Custom components

    function createElement<P extends {}>(
        type: FunctionComponent<P>,
        props?: Attributes & P | null,
        ...children: ReactNode[]): FunctionComponentElement<P>;
    function createElement<P extends {}>(
        type: ClassType<P, ClassicComponent<P, ComponentState>, ClassicComponentClass<P>>,
        props?: ClassAttributes<ClassicComponent<P, ComponentState>> & P | null,
        ...children: ReactNode[]): CElement<P, ClassicComponent<P, ComponentState>>;
    function createElement<P extends {}, T extends Component<P, ComponentState>, C extends ComponentClass<P>>(
        type: ClassType<P, T, C>,
        props?: ClassAttributes<T> & P | null,
        ...children: ReactNode[]): CElement<P, T>;
    function createElement<P extends {}>(
        type: FunctionComponent<P> | ComponentClass<P> | string,
        props?: Attributes & P | null,
        ...children: ReactNode[]): ReactElement<P>;

```

모든 오버라이딩 함수들이 인자로 type, props, children을 받는다. 



### React Element Type 구체적으로 지정하기

JSX tag의 가장 첫번째 부분은 React element type을 지정한다.

즉, 위의 선언부의 첫번째 인자로 type을 받듯이 JSX tag는 type을 지정하는 것이다.

이 태그들은 같은 이름을 가진 변수를 직접적으로 참조하므로, <Foo />를 사용한다면 Foo가 스코프 내에 반드시 선언되어 있어야 한다.



> **JSX를 사용하기 위해선 Scope 내에 React가 반드시 있어야 한다.**

JSX는 React.createElement를 호출하도록 컴파일 되므로, React가 반드시 JSX 코드 스코프 내에 포함되어 있어야 한다.

```jsx
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  return <CustomButton color="red" />;
}
```



위의 코드에서, React를 직접적으로 참조하는 부분은 없지만 React를 import 해주어야 한다.



> **JSX Type에서 Dot Notation 사용하기**

JSX에서 dot-notation을 사용하여 React Component를 나타낼 수 있다.

요건 하나의 모듈에서 여러 개의 리액트 컴포넌트를 export 해야 할 필요가 있을 때 편리하다.

예를 들면, 다음과 같이 쓸 수 있다.

```jsx
const Alphabet = {
  A: () => <p>A</p>,
  B: () => <p>B</p>,
  C: () => <p>C</p>
};

...
 
render(){
  <>
	  <Alphabet.A />
    <Alphabet.B />
    <Alphabet.C />
  </>
}
```



> **유저가 정의한 컴포넌트들은 반드시 첫 글자가 대문자로 시작해야 한다.**

element type이 lowercase로 시작한다면, 이건 <div>, <span> 같은 내장된 컴포넌트를 나타낸다. 

아래와 같이 <hello></hello> 를 사용하게 되면, react는 해당 태그를 ReactHTML interface에서 찾을 것이고, 이는 ReactHTML 태그에 존재하지 않으므로 에러를 내뱉을 것이다.

```jsx
function HelloWorld() {
  // Wrong! React thinks <hello /> is an HTML tag because it's not capitalized:
  return <hello toWhat="World" />;
}
```



> **Runtime에 타입 선택하기**

React Element Type으로 표현식을 사용할 수 없다. 

아래의 예를 보면, Element Type으로 Object key expression을 사용하였다. 이건 React Element Type 이라 볼 수 없다. 이는 식별자에 할당하고, 이를 태그에 붙이는 방식으로 해결할 수 있다.

```jsx
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Wrong! JSX type can't be an expression.
  return <components[props.storyType] story={props.story} />;
}

function Story(props) {
	const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```



### Props in JSX

JSX에는 많은 방식의 props 제공 방식이 있다.



> **Props에 JS Expression 넘기기**

다음과 같이 JS expression을 bracket으로 감싸는 방식으로 props로 넘길 수 있다.

```jsx
<MyComponent foo={1 + 2 + 3 + 4} /> // => foo will be 10!!
```



> **String Literals**

props로 string literal을 넘길 수 있다. 

이 때, string literal은 HTML-unescaped이다. 즉, '<3' 같은 문자를 literal 하게 넘기는 것이다.

아래 두개는 같은 JSX 표현식이다.

```jsx
<MyComponent message="&lt;3" />
<MyComponent message={'<3'} />
```



> **Props Default 값은 "True"이다.**

props의 값에 아무것도 넘기지 않으면 디폴트 값으로 true가 적용된다.

아래 JSX 표현식은 서로 같은 의미이다.

```jsx
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```



일반적으로, 리액트 팀에선 props에 값을 넘기지 않는 것을 권장하지 않는데, 이는 ES6 object shorthand와 의미가 혼용될 수 있기 때문이다. (e.g. { foo } => {foo : foo} ) 이를 인지하고 주의깊게 사용해야 할 것이다.



> **Spread Attributes**

object에 넘겨줘야 할 props를 가지고 있고, 이를 JSX로 넘겨줘야 한다면 spread operator로 넘겨줄 수 있다.



다음 예제를 살펴보자.

```jsx
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

위 예제는 kind를 props 로부터 분리하여 가공한 후 props로 넘겨주고, 나머지 props는 spread operator로 넘겨주고 있다.

spread attribute는 매우 유용하지만 원하지 않는 props나, 유효하지 않은 HTML attribute까지 넘길 수 있으므로 주의깊게 사용해야 한다.



### Children in JSX



JSX에선 태그들 사이에 특별한 prop을 넘겨주는데, 바로 props.children 이다.

children으로 넘겨주는 여러가지 방법이 있다.



> **String Literals**

JSX 태그들 사이에 string literal을 넣어주면 props.children 으로 넘어간다. 

이 때, string은 unescaped 된다. 

`This is valid HTML &amp; JSX at the same time.` 이 문장을 넘겨주면 다음과 같이 unescaped 된다.

![스크린샷 2021-10-31 오후 7.31.13](/Users/parkjongho/Library/Application Support/typora-user-images/스크린샷 2021-10-31 오후 7.31.13.png)



또, JSX는 글 사이의 공백을 제거한다. 따라서 다음 JSX 들은 같은 것들을 렌더링한다.

```jsx
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```



> **JSX Children**

JSX 요소들을 children으로 넘겨줄 수도 있다.

```jsx
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```



> **JS Expressions as Children**

JS 표현식을 `bracket {}` 에 묶는 형태로 children에 넘겨줄 수 있다.

```jsx
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



> **Functions as Children**

Chlidren은 단순히 render 하는 역할이 아닌, 함수로서 사용할 수도 있다.

다음 예시를 보자.

```jsx
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
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

위 예제에서, Repeat에 children으로 `      {(index) => <div key={index}>This is item {index} in the list</div>}` 를 받고 있다.

Repeat 컴포넌트에서는 이 children에 index를 넣어주고, numTimes 만큼 순회하여 아이템을 넣어준다. 

이는 다음과 같이 렌더링된다.

![스크린샷 2021-10-31 오후 11.34.58](/Users/jonghopark/Library/Application Support/typora-user-images/스크린샷 2021-10-31 오후 11.34.58.png)



일반적인 케이스는 아니지만, 이런 식으로 children을 활용할 수 있다는 정도로 이해하자.



> **Booleans, Null, and Undefined는 무시되어진다.**

Booleans, null, undefined 도 유효한 children이다. 그러나, 이들은 렌더링되지 않는다.

다음 JSX 표현식은 모두 같은 표현식이다.

```jsx
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```



주의할 점은, 0과 같은 falsy 값들을 렌더링한다는 점이다.

아래 예제를 보자.

```jsx
export default function App() {
  const messages = [];

  return <div className="App">{messages.length && <p>HIHI</p>}</div>;
}
```

App 컴포넌트는 `<div className="App"></div>` 을 렌더링한다고 생각하기 쉽다.

놀랍게도, 다음과 같이 출력한다.

![ 스크린샷 2021-10-31 오후 11.39.58](/Users/jonghopark/Library/Application Support/typora-user-images/스크린샷 2021-10-31 오후 11.39.58.png)이를 고치려면 && 이전에 오는 값이 boolean 으로만 오도록 해야 한다.

![스크린샷 2021-10-31 오후 11.41.00](/Users/jonghopark/Library/Application Support/typora-user-images/스크린샷 2021-10-31 오후 11.41.00.png)