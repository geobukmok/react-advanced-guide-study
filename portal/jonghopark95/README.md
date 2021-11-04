# Portals



포탈은 부모 컴포넌트의 DOM 계층 구조 외부에 존재하는 DOM 노드에 children을 렌더링할 수 있는 방법을 제공해준다.

```jsx
ReactDOM.createPortal(child, container)
```



child는 렌더링 가능한 React child (element, string, fragment)가 와야하고, 두번째 인자는 DOM element 이다.



---



### Usage



일반적으로는 component render 메소드로부터 element를 반환하면 가장 가까운 부모 노드의 child로 DOM에 마운트된다.

그러나, DOM 의 다른 위치에 child를 넣는 것이 유용할때가 있다.

```jsx
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```



일반적인 사용케이스는 parent component가 overflow: hidden, z-index 등을 가지지만, child가 시각적으로 container를 깨야 하는 상황이다. dialogs, hovercards, tooltips 등이 있다.

Portal을 사용하면 웹 접근성을 위해 keyboard focus를 잘 관리해야 한다는 점을 기억해야 한다.



---



### Event Bubbling Through Portals



Portal은 child가 어디에 있던 리액트 child처럼 동작한다. 즉, Context API 도 React Tree 내에 있으니, DOM tree라는 상관없이 동작한다.

이는 Event Bubbling 관점에서 지켜볼 포인트가 있는데, Portal 내에서 이벤트가 발생하면 그것을 담고있는 React tree 조상까지 전파된다. 즉, DOM tree 조상 아래에 해당 element가 없더라도 이벤트가 전파된다.

다음 링크를 들어가 코드를 보자. https://codepen.io/gaearon/pen/jGBWpE?editors=1111

위 코드는 HTML DOM tree root 가 아예 다르지만, modal-root의 click 이벤트가 버블링되어 상태가 변경된다. 

이는 portal 에 의존하지 않는 유연한 추상화를 하게 해준다. 예를 들어, <Modal /> 컴포넌트를 렌더링 할 경우 부모는 portal을 사용했는지 여부에 상관없이 이벤트를 캡처링할 수 있다.



---



### 함수형 Portal test



https://codesandbox.io/s/react-portal-teseuteu-u3w8i?file=/src/Modal.js:0-279



```jsx
import { createPortal } from "react-dom";

const Modal = () => {
  const $modalRoot = document.getElementById("modal-root");
  const ModalDOM = (
    <div>
      <button>Modal Power</button>
    </div>
  );

  return createPortal(ModalDOM, $modalRoot);
};

export default Modal;
```