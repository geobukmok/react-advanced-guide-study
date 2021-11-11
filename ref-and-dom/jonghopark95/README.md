# Ref and the DOM

>  ***Ref는 render 메서드에서 생성된 DOM 노드나, React element에 접근하는 방법을 제공한다.***





### Ref를 사용할 때

다음과 같은 사용 사례를 제외하면 ref 사용을 지양하는 것이 좋다.

* focus, text select area, 미디어 재생 관리
* animation을 직접적으로 실행시킬 때
* third party DOM library를 React와 같이 사용할 때





### Ref 생성하기

```jsx
const Cat = ({ mouse }) => {
  const pRef = useRef();
  console.log(pRef);
  
  return (
    <p ref={pRef}>
      The current mouse position is ({mouse.x}, {mouse.y})
    </p>
  );
};
```





### Ref에 접근하기

render 메서드 안에서 ref가 전달되면 해당 노드의 참고는 ref의 current attribute에 담기게 된다.

ref의 값은 노드의 유형에 따라 달라지게 된다.

* ref가 HTML element에 쓰였다면, DOM element를 current로 받는다.
* ref가 Custom Class Component에 쓰이면, 마운트된 컴포넌트 인스턴스를 값으로 받는다.
* 함수 컴포넌트는 인스턴스가 없으므로 ref를 사용하려면 다른 방법을 써야 한다. (forwardRef)





### DOM element에 Ref 사용하기

DOM API를 사용해 focus를 관리한다고 해보자.

```jsx
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    this.textInput.current.focus();
  }

  render() {
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```



해당 부분에선 컴포넌트가 마운트 될 때, current에 element를 대입하고, 마운트가 해제되면 current를 null로 돌려놓는다.

이 처럼, ref를 수정하는 작업은 componentDidMount, componentDidUpdate 때 이루어진다.





### Class Component에 Ref 사용하기

해당 코드를 보자.

```jsx
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

위 코드처럼, 만약 ComponentTextInput이 마운트 된 직후 클릭 되길 원하면, ref로 내부 메소드를 직접 호출할 수 있다. 

(그냥 내부에서 componentDidMount로 하는게 낫지 않나...?)





### Ref와 함수 컴포넌트

함수 컴포넌트는 인스턴스가 없으므로 ref attribute를 사용할 수 없다.

사용할 수 있게 하려면, forwardRef를 사용하거나 class Component로 바꿔야 한다.



### Callback Ref

다음 코드와 같이, 함수를 ref에 넘길 수도 있다.

```jsx
const Cat = ({ mouse }) => {
  let textInput;
  const setTextInputRef = (elem) => (textInput = elem);
  const focusTextInput = () => {
    if (textInput) textInput.focus();
  };

  useEffect(() => {
    console.log(textInput);
  });

  return (
    <>
      <input type="text" ref={setTextInputRef} />
      <input
        type="button"
        value="Focus the text input"
        onClick={focusTextInput}
      />
    </>
  );
};
```

component가 마운트 될 때, React는 ref 를 DOM element와 함께 호출한다. 그리고 해제 될 때, ref 콜백을 null과 함께 호출한다. 이는 componentDidMount, componentDidUpdate가 호출되기 전에 호출된다.



### Callback Ref 주의사항

ref callback 이 인라인 함수로 선언되면, 업데이트 과정 중에 처음에는 Null, 그 다음은 DOM element로 두 번 호출된다.

이는 매 랜더링마다 새 인스턴스가 생성되므로 이전에 사용된 ref를 제거되고, 새 ref를 설정해야 하므로 일어나게 된다.

이는 ref callback을 바인딩된 메서드로 선언하거나, useCallback 등으로 해결할 수 있다.

그러나 이런 현상은 많은 경우 문제가 되지 않는다.

