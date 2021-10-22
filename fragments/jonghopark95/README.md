# Fragments
> Fragments는 DOM에 별도의 노드를 추가하지 않고 여러 자식을 그룹화할 수 있는 React 문법입니다.

## Fragment가 나오기 이전...

React v16.0 버전 이전엔, 하위 children 을 컴포넌트로 묶어주려면 div나 span을 사용했어야 했습니다.

```js
const BeforeFragments = () => {
  return (
    <>
      <p>Hi!!</p>
      <p>I am Jongho Park.</p>
    </>
  );
}
```

[React v16.0](https://ko.reactjs.org/blog/2017/09/26/react-v16.0.html#new-render-return-types-fragments-and-strings) 버전에 들어서면서 fragments 라는 개념이 등장했습니다. 이 방법은 component의 render 메소드 내에 children으로 묶어진 배열을 반환하는 것이었습니다.

```js
const FragmentsAsArray = () => {
  return [
    <p key="paragraph-1">Hi!!</p>,
    <p key="paragraph-2">I am Jongho Park.</p>
  ];
}
```

이는 아직도 지원하는 문법이예요!! 실제로 react의 타입 선언 부를 보시면 Fragment가 다음과 같이 표기되어있습니다.
```js
type ReactFragment = {} | ReactNodeArray;
```

이 방법의 문제는, 각 child 마다 key를 붙여줘야 key warning이 나지 않는다는 점이었어요.

[React v16.2.0](https://ko.reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html) 버전부터 우리가 익히 아는 <></> 문법이 등장했답니다.

```js
const Fragments = () => (
  <>
    <p key="paragraph-1">Hi!!</p>,
    <p key="paragraph-2">I am Jongho Park.</p>
  </>
)
```


이제 우린 간단하게 <></>을 사용하면 children을 묶은 Component를 만들 수 있답니다!

그러나 Array의 map method를 사용하여 순회하며 컴포넌트를 뿌려준다면 key prop이 필요하겠죠! 이런 경우엔 React.Fragment를 명시적으로 표기하여 처리하면 됩니다 :)

```js
const Fragments = (props) => (
  <div>
    {props.items.map(item => (
        <React.Fragment key={item.id}>
            <p key="paragraph-1">Hi!!</p>,
            <p key="paragraph-2">I am Jongho Park.</p>
        </React.Fragment>
        ))
    }
  </div>
)
```

---

## 질문

뜬금없지만... Fragment가 어떻게 작성되었는지 궁금해 타고타고 들어가봤어요

https://github.com/facebook/react/blob/main/packages/react/src/React.js

https://github.com/facebook/react/blob/main/packages/shared/ReactSymbols.js

```js
// react/src/React.js
import { REACT_FRAGMENT_TYPE, ... } from "shared/ReactSymbols";

export{ REACT_FRAGMENT_TYPE as Fragment , ... };


// shared/ReactSymbols.js
export let REACT_FRAGMENT_TYPE = 0xeacb;

```

아무리봐도... 못찾겠어요...!
그럼 React.Fragment는 0xeacb인건가...?
코드 디깅 해보신분들 팁좀 알려주십쇼...
