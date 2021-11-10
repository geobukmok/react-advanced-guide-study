# Render Props

"render props"란, React 컴포넌트 간에 코드를 공유하기 위해 함수 props를 이용하는 간단한 테크닉입니다.

render props 패턴으로 구현된 컴포넌트는 자체적으로 **렌더링 로직을 구현하는 대신**, react 엘리먼트 요소를 반환하고 이를 호출하는 함수를 사용합니다.

render props를 사용하는 유명한 라이브러리는 `ReactRouter`, `Formik`이 있습니다.

render props가 왜 유용하고, 어떻게 우리의 프로젝트에 적용할 수 있을지에 관해 이야기하겠습니다.

## 횡단 관심사(Cross-Cutting Concerns) 를 위한 render props 사용법

컴포넌트는 React에서 코드의 재사용성을 위해 사용하는 주요 단위입니다. 하지만 컴포넌트에서 캡슐화된 상태나 동작을 같은 상태를 가진 다른 컴포넌트와 공유하는 방법이 명확하지는 않습니다.

예를 들면, 아래 컴포넌트는 웹 어플리케이션에서 마우스 위치를 추적하는 로직입니다.

```jsx
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  }

  render() {
    return (
      <div style={{ height: "100vh" }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>
          The current mouse position is ({this.state.x}, {this.state.y})
        </p>
      </div>
    );
  }
}
```

스크린 주위로 마우스 커서를 움직이면, 컴포넌트가 마우스의 (x, y) 좌표를 `<p>` 에 나타냅니다.

여기서 질문입니다. 다른 컴포넌트에서 이 행위를 재사용하려면 어떻게 해야 할가요? 즉, 다른 컴포넌트에서 커서(cursor) 위치에 대해 알아야 할 경우, 쉽게 공유할 수 있도록 캡슐화할 수 있습니까?

리액트에서 컴포넌트는 코드 재사용의 기본 단위이므로, 우리가 필요로 하는 마우스 커서 트래킹 행위를 `<Mouse>`컴포넌트로 캡슐화하여 어디서든 사용할 수 잇게 리팩토링해 보겠습니다.

```jsx
const Mouse = ({ render }) => {
  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });
  const handleMouseMove = (e) => {
    setPointer({
      x: e.clientX,
      y: e.clientY,
    });
  };
  return <div onMouseMove={handleMouseMove}>{render(pointer)}</div>;
};
```

위와 같이 render props 패턴을 적용하면 Mouse 컴포넌트를 수정하지 않고 Mouse Tracking 기능을 재사용할 수 있도록 할 수 있습니다.

정리하자면, render props은 무엇을 랜더링할지 컴포넌트에 알려주는 함수입니다.

이 테크닉은 행위(마우스 트래킹 같은)를 매우 쉽게 공유할 수 있도록 만들어 줍니다. 해당 행위를 적용하려면, `<Mouse>`를 그리고 현재(x,y) 커서 위치에 무엇을 그릴지에 대한 정보를 prop를 통해 넘겨주기만 하면 됩니다.

render props에 대해 한가지 흥미로운 점은 대부분의 higher-order component(HOC)에 render props pattern을 이식할 수 있습니다.

예를 들면, `<Mouse>` 컴포넌트보다 withMouse HOC를 더선호한다면 render prop를 이용해서 다음과 같이 쉽게 HOC를 만들 수 있습니다.

```jsx
function withMouse(Component) {
	return () => {
    return <Mouse render={pointer => {
        <Component {...this.props} mouse={mouse} />
      }}
  }
}
```

render props를 사용하면 두 가지 패턴 모두 사용이 가능합니다.

# render 이외의 Props 사용법

여기서 중요하게 기억해야 할 것은, "render props pattern"으로 불리는 이유로 꼭 prop name으로 렌더를 사용할 필요는 없습니다. 사실, 어떤 함수형 prop이든 render prop이 될 수 있습니다.

https://reactnative.dev/docs/flatlist

React Native 의 컴포넌트들이 흔히 사용하는 방법인듯 합니다.

## 주의할 점

위 예시들에서는 `render` 에 인라인 함수를 작성해서 넣어주는 경우가 많았는데 실제로 사용할 때는 따로 변수화해서 빼두는 것이 `PureComponent`나 React.memo를 사용에 방해가 되지않습니다.
