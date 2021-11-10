# Ref 와 DOM

Ref는 render 메서드에서 생성된 DOM 노드나 React 엘리먼트에 직접 접근하는 방법을 제공합니다.

일반적인 React의 데이터 플로우에서 `props`는 부모 컴포넌트가 자식과 상호작용 할 수 있는 유일한 수단입니다. 자식을 수정하려면 **새로운 props**를 전달하여 자식을 다시 렌더링 해야합니다.

그러나, 일반적인 데이터 플로우에서 벗어나 직접적으로 자식을 수정해야 하는 경우도 가끔씩 있습니다. 수정할 자식은 **React 컴포넌트의 인스턴스** 일 수 도 있고 **DOM 앨리먼트** 일 수도 있습니다.

Ref의 바람직한 사용 사례는 다음과 같습니다.

- 포커스, 텍스트 선택 영역, 혹은 미디어의 재생을 관리할 때.

- 애니메이션을 직접적으로 실행 시킬때 => **구체인 예시 정리하기**

- **서드 파티 DOM 라이브러리**를 React 와 같이 사용할 때

  - 개인적으로 D3js와 함께 쓰는 방법을 익히고 싶습니다.

## Ref 생성하기

Ref는 `React.createRef()`를 통해 생성되고 `ref`어트리뷰트를 통해 React Element에 부착됩니다. 보통 컴포넌트의 인스턴스가 생성될 때 Ref를 프로퍼티로서 추가하고, 그럼으로서 **컴포넌트의 인스턴스의 어느 곳에서도 Ref에 접근할 수 있게 합니다.**

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef}></div>;
  }
}
```

## Ref에 접근하기

`render` 메서드 안에서 ref가 엘리먼트에게 전달되었을 때, 그 노드를 향한 참조는 ref의 `current`어트리뷰터에 담기게 됩니다.

```js
const node = this.myRef.current;
```

ref의 값은 노드 유형에 따라 다릅니다.

- `ref`어트리뷰트가 **HTML 엘리멘트**에 쓰였다면, 생성자에서 `React.createRef()`로 생성된 `ref`는 자신을 전달받은 **DOM 엘리먼트**를 `current`프로퍼티의 값으로서 받습니다.

- `ref` 어트리뷰트가 **커스텀 클래스 컴포넌트**에 쓰였다면, `ref`객체에 마운트된 컴포넌트의 인스턴스를 `current`프로퍼티의 값으로서 받습니다.
- **함수 컴포넌트는 인스턴스가 없기 때문에 함수 컴포넌트에 ref 어트리뷰트를 사용할 수 없습니다**.

커스텀 컴포넌트에서 ref를 써서도 안되고 거의 쓸일도 없습니다. 대부분 DOM 엘리먼트에 직접 접근할 이유가 있을 때 사용하게 됩니다.

```jsx
class CustomTextInput extends React.Component {}
const CustomTextInput = () => {
  const textInput = useRef();

  const focusTextInput = () => {
    textInput.current.focus();
  };
  return (
    <div>
      <input type="text" ref={this.textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
};
```

컴포넌트가 마운트 될 때 React는 `current` 프로퍼티에 DOM 엘리먼트를 대입하고, 컴포넌트의 마운트가 해제될 때 `current` 프로퍼티를 다시 null 로 돌려놓습니다.

> 이 부분이 중요합니다. 마운트가 해제될 때 current를 null로 처리해줌으로써 DOM 인스턴스도 GC에 의해 정리되게 될 것입니다.

`ref`를 수정하는 작업은 `componentDidMount`또는 `componentDidUpdate`와 같은 생명주기 메서드가 호출 되기전에 이뤄집니다.

## 콜백 ref

React는 ref가 설정되고 해제되는 상황을 세세하게 다룰 수 있는 "콜백 ref"이라 불리는 ref를 설정하기 위한 또 다른 방법을 제공합니다.

#### DOM element에 ref 어트리뷰트에 함수를 넘길 수 있는 것 아시나요?

ref값이 아닌 함수를 전달 할 수 있습니다. 전달된 함수는 다른 곳에 저장되고 접근될 수 있는 React 컴포넌트의 인스턴스나 DOM 엘리먼트를 인자로서 받습니다.

즉, 마운트 시점에 해당 콜백 ref가 실행 되는 것이죠.

```jsx
let textInput = null;
const CustomTextInput = () => {
  const setTextInputRef = (element) => {
    textInput = element;
  };
  const focusTextInput = () => {
    if (textInput) textInput.focus();
  };
  useEffect(() => {
    focusTextInput();
    return () => {
      // clear
    };
  }, []);
  return (
    <div>
      <input type="text" ref={this.setTextInputRef} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </div>
  );
};
```

위 예제에서는 인스턴스가 마운트 될 때 `input` DOM 엘리먼트를 인자로 `ref`콜백을 호출합니다. 그리고 컴포넌트의 인스터스의 마운트가 해제될 때, `ref`콜백을 null과 함께 호출합니다.

- 콜백 ref에 관한 주의 사항

  `ref`콜백이 **인라인 함수로 선언**되었다면 `ref`콜백은 업데이트 과정 중에 처음에는 `null`로, 그 다음에는 DOM 엘리먼트로, 총 두 번 호출됩니다. 이러한 현상은 매 렌더링마다 `ref`콜백의 새 인스턴스가 생성되므로 React가 이전에 사용된 ref를 제거하고 새 ref를 설정해야하기 때문에 일어납니다.

# Ref 사용 예시

### Input Element 제어

가장 흔히 쓰이는 방식입니다. DOM의 focus 함수를 호출하고 싶거나 disabled 시키고 싶을 때 사용할 수 있습니다.

```jsx
import React, { useRef } from "react";

function Field() {
  const inputRef = useRef(null);

  function handleFocus() {
    inputRef.current.disabled = false;
    inputRef.current.focus();
  }

  return (
    <>
      <input disabled type="text" ref={inputRef} />
      <button onClick={handleFocus}>활성화</button>
    </>
  );
}
```

### audio Element 제어

또 다른 사례로 audio 엘리먼트 제어를 들 수 있습니다.

음악 파일의 재생하거나 중지할 수 있는 컴포넌트를 작성하면 아래와 같습니다.

```jsx
import React, { useRef } from "react";
import music from "./music.mp3";

function Player() {
  const audioRef = useRef(null);
  const handlePlay = () => {
    audioRef.current.play();
  };
  const handlePause = () => {
    audioRef.current.pause();
  };
  return (
    <>
      <figure>
        <figcaption>Eyes on You (Sting) - Network 415:</figcaption>
        <audio src={music} ref={audioRef}>
          Your browser does not support the
          <code>audio</code> element.
        </audio>
      </figure>
      <button onClick={handlePlay}>재생</button>
      <button onClick={handlePause}>중지</button>
    </>
  );
}
```

버튼으로 audio 를 제어할 수 있습니다.

https://codesandbox.io/s/react-refs-45hwd?from-embed
