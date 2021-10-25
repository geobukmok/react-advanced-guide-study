# REACT ERROR BOUNDARIES

### Why?

과거에는 애플리케이션 코드의 이전 단계에서 발생한 자바스크립트 에러를 React 컴포넌트 내에서 정상적으로 처리할 수 있는 방법을 제공하지 않아서 복구할 수가 없었다.

UI의 일부분에 존재하는 자바스크립트 에러가 전체 애플리케이션을 중단시켜서는 안된다. 이를 해결하기 위해 에러 경계라는 새로운 개념이 도입되었다.



## 에러 경계

> 하위 컴포넌트 트리의 어디에서든 자바스크립트 에러를 기록하며 깨진 컴포넌트 트리 대신 폴백 UI를 보여주는 React 컴포넌트이다.

다음과 같은 생명주기 메서드를 사용해서 에러 핸들링이 가능하다.

#### getDerivedStateFromError()

에러 발생 후 폴백 UI 렌더링할때 사용

#### componentDidCatch()

에러 정보 기록할때 사용



### 에러 경계가 포착하지 않는 에러

#### 이벤트 핸들러

* 이벤트 핸들러는 렌더링중에 발생하지 않으므로 렌더링과 관련 없다. 

* `try`/`catch` 구문을 사용해서 에러 핸들링 할 수 있다.

* [예제]

  ```react
  class MyComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { error: null };
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick() {
      try {
          // 에러를 던질 수 있는 무언가를 해야합니다.
      } catch (error) {
          this.setState({ error });
      }  }
  
    render() {
      if (this.state.error) {
          return <h1>Caught an error.</h1>
      }
      return <button onClick={this.handleClick}>Click Me</button>
    }
  }
  ```

#### 비동기적 코드

* `setTimeout`
* `requestAnimationFrame` 콜백

#### 서버 사이드 렌더링

#### 자식에서가 아닌 에러 경계 자체에서 발생하는 에러

---

[예시]

```react
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
      // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.    
      return { hasError: true };  }
  componentDidCatch(error, errorInfo) {
      // 에러 리포팅 서비스에 에러를 기록할 수도 있습니다.
      logErrorToMyService(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
        // 폴백 UI를 커스텀하여 렌더링할 수 있습니다.
        return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

트리 내에서 하위에 존재하는 컴포넌트의 에러만을 포착한다.

```react
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```



## 에러 경계 위치

### 최상위

서버 사이드 프레임워크가 충돌을 해결하는 것처럼 에러 메시지를 보여줄 수 있다.

### 각 위젯 감싸기

에러 경계의 각 위젯을 여러 경계로 감싸서 애플리케이션의 나머지 부분이 충돌하지 않도록 보호할 수 있다.



## 포착되지 않는 에러 동작

에러가 발생한 UI는 잘못된 동작을 발생시키거나 잘못된 데이터를 노출할 수 있기 때문에 남겨두는 것보다는 제거하는 것이 낫다. 

React 16 이후에는 포착되지 않는 에러로 인한 충돌을 발견할 수 있다.

각 UI 영역을 나누어서 에러 경계를 추가함으로써 하나의 컴포넌트에서 충돌이 발생했을 때 나머지 컴포넌트는 유지될 수 있다. 



## 컴포넌트 스택 추적

React 16은 에러가 발생한 경우에도 렌더링하는 동안 발생한 모든 에러를 콘솔에 출력한다.

Babel 설정을 통해 플러그인을 추가하는 경우 프로덕션 환경에서 비활성화 해야한다.



## try/catch와 차이

에러 경계 컴포넌트는 어디서 에러가 발생하든지 가장 가까운 에러 경계에 전달된다. 

이처럼 에러 경계 컴포넌트는 무엇을 렌더링할지 구체화하지만, `try` /`catch`는 명령형 코드에서만 동작한다.
