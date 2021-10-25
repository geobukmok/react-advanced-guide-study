# 에러 경계 (Error Boundaries)

## 왜 에러 경계가 필요할까?

- 과거에는 컴포넌트 내부에서 자바스크립트 에러가 발생하면 내부 상태가 망가지면서 앱 전체에 영향을 주었다.
- React에서는 컴포넌트 내에서 에러를 처리할 수 있는 방법을 제공하지 않아 복구할 수 없다는 문제가 있었다.

위 문제를 해결하기 위해 React 16에서는 에러 경계(Error Boundary)라는 개념을 도입하였다.

## 에러 경계란

에러 경계란, 하위 컴포넌트 트리에서 자바스크립트 에러가 발생했을 경우 **에러를 기록**하고, 깨진 컴포넌트 트리 대신 **fallback UI**를 보여주는 React 컴포넌트이다.

자바스크립트의 `catch {}` 구문이 하위 컴포넌트에 적용되는 것이라고 이해할 수 있다.

### Error 관련 Life Cycle API

> _[React.Component 오류 처리](https://ko.reactjs.org/docs/react-component.html#error-handling)_

아래 메서드들은 자식 컴포넌트를 렌더링하거나, 자식 컴포넌트가 생명주기 메서드를 호출하거나, 또는 자식 컴포넌트가 생성자 메서드를 호출하는 과정에서 **오류**가 발생했을 때 호출된다.

- `static getDerivedStateFromError()` : fallback UI를 렌더링하기 위한 상태 업데이트
- `componentDidCatch()` : 에러 정보 log 남기기

위 메서드들 중 하나 이상을 정의한 클래스 컴포넌트는 에러 경계가 된다.

### 에러 경계 사용법

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 fallback UI가 보이도록 상태 업데이트
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 기록
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // fallback UI 렌더링
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

위와 같이 에러 처리 관련 Life Cycle 메서드를 정의한 ErrorBoundary 컴포넌트를 작성하고,

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

이렇게 작성하면 `MyWidget` 컴포넌트 이하의 하위 컴포넌트 트리에 대하여 에러를 포착하고 처리할 수 있다.

## 덧붙여서

- 오직 클래스 컴포넌트만이 에러 경계가 될 수 있다.
- 대부분의 경우 에러 경계 컴포넌트를 한 번만 선언하여 애플리케이션 전체에서 활용할 것이다.
- 에러 경계 컴포넌트 렌더링 시 오류가 발생한다면 에러는 그 위의 가장 가까운 에러 경계로 전파된다. (에러 경계의 하위 컴포넌트 트리에 존재하는 _모든 에러를_, 그리고 하위에 존재하는 _에러만을_ 포착하므로)

---

#### 지난 스터디 : code splitting - Error Boundary

Code Splitting에 대해 공부할 때 Error Boundary에 대해 이해하지 못했던 것을 다시 보자.

> _[Seogeurim/Code-Splitting#error-boundaries](https://github.com/geobukmok/react-advanced-guide-study/tree/main/code-splitting/Seogeurim#error-boundaries)_
>
> 다른 모듈 로드에 실패할 경우 Error Boundary를 만들고 lazy 컴포넌트를 감싸면 에러를 표시할 수 있다.
>
> ```js
> import React, { Suspense } from 'react';
> import MyErrorBoundary from './MyErrorBoundary';
> const OtherComponent = React.lazy(() => import('./OtherComponent'));
> const AnotherComponent = React.lazy(() => import('./AnotherComponent'));
>
> const MyComponent = () => (
>   <div>
>     <MyErrorBoundary>
>       <Suspense fallback={<div>Loading...</div>}>
>         <section>
>           <OtherComponent />
>           <AnotherComponent />
>         </section>
>       </Suspense>
>     </MyErrorBoundary>
>   </div>
> );
> ```

`MyErrorBoundary` 컴포넌트의 에러 처리 관련 생명주기 메서드는 자식 컴포넌트를 렌더링하는 과정에서 오류가 발생했을 때 호출될 것이다. 즉 lazy 컴포넌트를 불러오는 과정에서 네트워크 장애 등의 에러가 발생하여 렌더링에 실패한다면, `Error Boundary`를 통해 에러에 대한 사용자 경험과 복구 관리를 처리할 수 있을 것이다.
