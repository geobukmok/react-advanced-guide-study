# FORWARDING REFS

> 컴포넌트를 통해 자식 중 하나에 ref를 자동으로 전달하는 기법이다.

### Why?

재사용 가능한 컴포넌트 라이브러리 등에서 유용하게 사용할 수 있다. 



## DOM에 refs 전달하기

**[예시] 기본 컴포넌트**

```react
function FancyButton(props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}
```

 `React.forwardRef`를 사용해서 전달된 ref를 얻을 수 있다.

그것을 렌더링되는 DOM으로 전달한다.

`FancyButton`를 사용하는 컴포넌트들은 `button` DOM 노드에 대한 참조를 갖올 수 있고 DOM `button`을 직접 사용하는 것처럼 접근할 수 있다.

**[예시] ref 전달하는 컴포넌트**

```react
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
        {props.children}
  </button>
));

// 이제 DOM 버튼으로 ref를 작접 받을 수 있습니다.
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

### 단계별 동작

1. `React.createRef`를 호출해서 React ref를 생성하고 `ref` 변수에 할당한다.
2. `ref`를 JSX 속성으로 지정해서 `<FancyButton ref={ref}>`로 전달한다.
3. React는 이 `ref`를 `forwardRef` 내부의 `(props, ref) => ...` 함수의 두 번째 인자로 전달합니다.
4. 이 `ref`를 JSX 속성으로 지정해서 `<button ref={ref}>`으로 전달합니다.
5. ref가 첨부되면 `ref.current`는 `<button>` DOM 노드를 가리키게 됩니다.



## 유지관리자 주의사항

이전 동작에 의존하는 다른 컴포넌트에 영향을 줄 수 있으므로 `forwardRef`를 사용하기 전에 커밋을 하거나 주의해야한다.

또한 동작 방식이 변경되었을 때 문제가 발생할 수 있으므로 `React.forwardRef`를 조건부 적용하는 것은 추천하지 않는다.



## 고차원 컴포넌트에서의 ref 전달

> 고차 컴포넌트는 컴포넌트 로직을 재사용하기 위한 패턴이다. 컴포넌트를 가져와서 새 컴포넌트를 반환한다.

고차 컴포넌트는 자식을 래핑해서 재사용하기 쉽게 한다. 따라서 바깥쪽 컨테이너가 아닌 래핑된 컴포넌트의 ref를 참조해야 한다.

[예시]

```react
import FancyButton from './FancyButton';

const ref = React.createRef();
// 가져온 FancyButton 컴포넌트는 LogProps HOC입니다.
// 렌더링된 결과가 동일하다고 하더라도,
// ref는 내부 FancyButton 컴포넌트 대신 LogProps를 가리킵니다!
// 이것은 우리가 예를 들어 ref.current.focus()를 호출할 수 없다는 것을 의미합니다.

<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}/>;
```

`React.forwardRef` API를 사용해서 `FancyButton`의 refs를 명시적으로 전달할 수 있다.

[예시]

```react
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;
      // 사용자 정의 prop "forwardedRef"를 ref로 할당합니다.
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // React.forwardRef에서 제공하는 두 번째 파라미터 "ref"에 주의해주세요.
  // 가령 "forwardedRef"같은 일반 prop으로 LogProps에 전달할 수 있습니다.
  // 그 다음 Component에 연결할 수 있습니다.
  return React.forwardRef((props, ref) => {
      return <LogProps {...props} forwardedRef={ref} />;
  });}
```



## DevTools에 사용자 정의 이름 표시

> DevTools에 다음과 같이 표시된다.

### ForwardRef

```react
const WrappedComponent = React.forwardRef((props, ref) => {
  return <LogProps {...props} forwardedRef={ref} />;
});
```

### ForwardRef(myFunction)

렌더링 함수를 지정할 수 있다.

```react
const WrappedComponent = React.forwardRef(
  function myFunction(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }
);
```

### 사용자 정의 이름

감싸고 있는 컴포넌트를 포함하도록 `displayName`속성을 설정할 수 있다.

```react
function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // DevTools에서 이 컴포넌트에 조금 더 유용한 표시 이름을 지정하세요.
  // 예, "ForwardRef(logProps(MyComponent))"
  const name = Component.displayName || Component.name;  forwardRef.displayName = `logProps(${name})`;
  return React.forwardRef(forwardRef);
}
```



## useRef vs forwardRef?

> [출처](https://merrily-code.tistory.com/121)

함수 컴포넌트는 인스턴스가 없기 때문에 ref가 존재하지 않는다. [참고](https://ko.reactjs.org/docs/refs-and-the-dom.html#accessing-refs)

따라서 `useRef`를 통해 함수 컴포넌트를 제어할 수 없다.

이 때 `forwardRef`를 사용하면 부몬 컴포넌트에서 하위 컴포넌트로 ref를 전달할 수 있어서 함수 컴포넌트 역시 ref를 통한 제어가 가능하다.

이 외에도 커스텀 컴포넌트인 경우에도 ref 속성이 존재하지 않을 때 `forwardRef`를 사용할 수 있다.

