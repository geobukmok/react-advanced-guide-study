# Render Props

render props은 React 컴포넌트 간에 코드를 공유하기 위해 함수 props를 이용하는 테크닉이다.

render props 패턴으로 구현된 컴포넌트는 자체적으로 렌더링 로직을 구현하는 것이 아닌, render 엘리먼트 요소를 반환하고 이를 호출하는 함수를 사용한다.

이를 사용하는 라이브러리는 React Router 등이 있다.



### 횡단 관심사를 위한 render props 사용법

컴포넌트에서 React는 코드의 재사용성에서 사용되는 주된 단위이다. 

그러나 컴포넌트에서 캡슐화된 상태, 동작을 같은 상태를 가진 다른 컴포넌트와 공유하는 방법이 명확하지는 않다.

아래를 예로 들어 보자.

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
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```



만약, 위 코드 중 cursor 에 대한 로직을 재사용하려면 어떻게 해야 할까?

즉, 다른 컴포넌트에서 커서에 대한 위치에 대해 알아야 할 경우 어떻게 공유할 수 있을까?



이 경우, render props을 사용하면 무엇을 렌더링할지 컴포넌트에게 알려줄 수 있다.

```jsx
// Cat.js
const Cat = ({ mouse }) => (
  <p>
    The current mouse position is ({mouse.x}, {mouse.y})
  </p>
);

export default Cat;

// Mouse.js
import { useState } from "react";

const Mouse = ({ render }) => {
  const [state, setState] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) =>
    setState({
      x: e.clientX,
      y: e.clientY
    });

  return (
    <div style={{ height: "100vh" }} onMouseMove={handleMouseMove}>
      {render(state)}
    </div>
  );
};

export default Mouse;

// App.js
import Cat from "./Cat";
import Mouse from "./Mouse";
import "./styles.css";

const App = () => {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <Mouse render={(mouse) => <Cat mouse={mouse} />} />
    </div>
  );
};

export default App;
```



즉, render props는 무엇을 렌더링할 지 컴포넌트에게 알려주는 함수이다. 이는 마우스 트래킹 같은 행위를 쉽게 공유할 수 있게 만들어 준다.

HOC에도 render props pattern을 이식할 수 있다.



```jsx
// withMouse.js
import Mouse from "./Mouse";

const withMouse = (Comp) => {
  return () => <Mouse render={(mouse) => <Comp mouse={mouse} />} />;
};

export default withMouse;

// Cat.js
import withMouse from "./withMouse";

const Cat = ({ mouse }) => (
  <p>
    The current mouse position is ({mouse.x}, {mouse.y})
  </p>
);

export default withMouse(Cat);

// App.js
import Cat from "./Cat";
import "./styles.css";

const App = () => {
  return (
    <div>
      <h1>Move the mouse around!</h1>
      <Cat />
    </div>
  );
};

export default App;
```





### render 이외의 Props 사용법

render props pattern 은 단지 이름이지, 꼭 prop name으로 render를 사용할 필요는 없다.

예를 들면, 직접 element안에 꽂아서 넣을 수도 있다.

```jsx
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```



이런 테크닉은 주로 사용되지 않으므로, children은 함수 타입을 가지도록 propTypes를 지정하는 것이 좋다.

```jsx
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```








### 주의사항. React.PureComponent에서 render props pattern을 사용할 땐 주의해야 한다.

얕은 prop 비교는 새로운 prop에 대해 false를 반환하게 된다.

```jsx
class Mouse extends React.PureComponent {
  // 위와 같은 구현체...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          이것은 좋지 않습니다! `render` prop이 가지고 있는 값은
          각각 다른 컴포넌트를 렌더링 할 것입니다.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

위와 같은 코드일 경우, Mouse는 PureCompnent를 상속받으므로 MouseTracker가 Render 될 때마다 render의 prop으로 넘어가는 함수가 계속 생성된다. 이럴 경우엔 다음과 같이 해야 한다.



```jsx
class MouseTracker extends React.Component {
  // `this.renderTheCat`를 항상 생성하는 매서드를 정의합니다.
  // 이것은 render를 사용할 때 마다 *같은* 함수를 참조합니다.
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```
