# REACT STRICT MODE

### Why?

어플리케이션 내의 잠재적인 문제를 알아내기 위해서 사용한다. 부가적인 검사와 경고를 활성화한다.



## Strict Mode

> 개발모드에서만 활성화되고 프로덕션 빌드에는 영향을 끼치지 않는다.

어플리케이션 내 어디서든지 활성화 할 수 있다.

```react
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
       	<div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

위의 예시에서는 `Header`와 `Footer` 컴포넌트는 Strict 모드 검사가 이루어지지 않는다.

하지만 `ComponentOne`과 `ComponentTwo`는 각각의 자손까지 검사가 이루어진다.

`StrictMode`가 도움이 되는 경우에 대해서 알아보자.

### 안전하지 않은 생명주기를 사용하는 컴포넌트 발견

비동기 React 애플리케이션에서 특정 생명주기 메서드들은 안전하지 않다. 하지만 애플리케이션이 서드 파티 라이브러리를 사용한다면, 해당 생명주기 메서드가 사용되지 않는다고 장담하기 어렵다.

Strict 모드가 활성화되면 React는 안전하지 않은 생명주기 메서드를 사용하는 모든 클래스 컴포넌트 목록을 정리해 다음과 같이 컴포넌트에 대한 정보가 담긴 경고 로그를 출력한다.

[![strict mode unsafe lifecycles warning](https://ko.reactjs.org/static/e4fdbff774b356881123e69ad88eda88/1e088/strict-mode-unsafe-lifecycles-warning.png)](https://ko.reactjs.org/static/e4fdbff774b356881123e69ad88eda88/1628f/strict-mode-unsafe-lifecycles-warning.png)

Strict 모드에 의해 발견된 문제들을 해결한다면, 향후 릴리즈되는 React에서 concurrent 렌더링의 이점을 얻을 수 있을 것이다.

### 레거시 문자열 ref 사용에 대한 경고

이전의 React에서 ref를 관리하는 방법으로 레거시 문자열 ref API와 콜백 API를 제공했는데 문자열 ref가 사용하기 더 편리했지만 [단점들](https://github.com/facebook/react/issues/1373)이 있었다.

React 16.3에서는 여러 단점 없이 문자열 ref의 편리함을 제공하는 세 번째 방법을 추가했다.

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
  }

  render() {
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }
}
```

이제는 객체 ref가 문자열 ref를 교체하는 용도로 널리 더해졌기 때문에, Strict 모드는 문자열 ref의 사용에 대해 경고한다.

[`createRef` API에 대해서 알아보기](https://ko.reactjs.org/docs/refs-and-the-dom.html)

### 권장되지 않는 findDOMNode 사용에 대한 경고

이전의 React에서 주어진 클래스 인스턴스를 바탕으로 트리를 탐색해 DOM 노드를 찾을 수 있는 `findDOMNode`를 지원했다. 

[DOM 노드에 바로 ref를 지정](https://ko.reactjs.org/docs/refs-and-the-dom.html#creating-refs)할 수 있기 때문에 보통은 필요하지 않다.

### 예상치 못한 부작용 검사

개념적으로 React는 두 단계로 동작한다.

- **렌더링** 단계는 특정 환경(예를 들어, DOM과 같이)에 어떤 변화가 필요한 지 결정한다. 이 과정에서 React는 `render`를 호출하여 이전 렌더와 결과값을 비교한다.
- **커밋** 단계는 React가 변경 사항을 반영한다(React DOM의 경우 React가 DOM 노드를 추가, 변경 및 제거하는 단계를 말합니다). 이 단계에서 React는 `componentDidMount` 나 `componentDidUpdate` 와 같은 생명주기 메서드를 호출한다.

커밋 단계는 일반적으로 매우 빠르지만, 렌더링 단계는 느릴 수 있다. 이로 인해서 곧 추가될 concurrent 모드(아직 기본적으로는 비활성화됨)는 렌더링 작업을 더 작은 단위로 나누고 작업을 중지했다 재개하는 방식으로 브라우저가 멈추는 것을 피한다. 

즉, React는 커밋하기 전에 렌더링 단계의 생명주기 메서드를 여러 번 호출하거나 아예 커밋을 하지 않을 수도(에러 혹은 우선순위에 따른 작업 중단) 있다.

렌더링 단계 생명주기 메서드는 클래스 컴포넌트의 메서드를 포함해 다음과 같다.

- `constructor`
- `componentWillMount` (or `UNSAFE_componentWillMount`)
- `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
- `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
- `getDerivedStateFromProps`
- `shouldComponentUpdate`
- `render`
- `setState` 업데이트 함수 (첫 번째 인자)

위의 메서드들은 여러 번 호출될 수 있기 때문에, 메모리 누수 혹은 잘못된 애플리케이션 상태 등 다양한 문제를 일으킬 가능성이 있다. 이러한 문제들은 [예측한 대로 동작하지 않기 때문](https://ko.wikipedia.org/wiki/결정론적_알고리즘)에 발견하는 것이 어려울 수 있다.

Strict 모드가 자동으로 부작용을 찾아주는 것은 불가능하지만 조금 더 예측할 수 있게끔 만들어서 문제가 되는 부분을 발견할 수 있게 도와준다. 이는 아래의 함수를 의도적으로 이중으로 호출하여 찾을 수 있다.

- 클래스 컴포넌트의 `constructor`, `render` 그리고 `shouldComponentUpdate` 메서드
- 클래스 컴포넌트의 `getDerivedStateFromProps` static 메서드
- 함수 컴포넌트 바디
- State updater 함수 (`setState`의 첫 번째 인자)
- `useState`, `useMemo` 그리고 `useReducer`에 전달되는 함수

```jsx
class TopLevelRoute extends React.Component {
  constructor(props) {
    super(props);

    SharedApplicationState.recordEvent('ExampleComponent');
  }
}
```

컴포넌트의 constructor와 같은 메서드를 의도적으로 두 번 호출하면 strict mode가 이와 같은 패턴을 쉽게 찾을 수 있도록 한다.

### 레거시 context API 검사

레거시 context API는 오류가 발생하기 쉬워 이후 릴리즈에서 삭제될 예정이다. 16.x 버전에서 여전히 돌아가지만, Strict 모드에서는 아래와 같은 경고 메시지를 노출한다.

[![warn legacy context in strict mode](https://ko.reactjs.org/static/fca5c5e1fb2ef2e2d59afb100b432c12/1e088/warn-legacy-context-in-strict-mode.png)](https://ko.reactjs.org/static/fca5c5e1fb2ef2e2d59afb100b432c12/51800/warn-legacy-context-in-strict-mode.png)

[새로운 context API 문서](https://ko.reactjs.org/docs/context.html)를 참조하여 새로운 버전으로 마이그레이션 해야한다.
