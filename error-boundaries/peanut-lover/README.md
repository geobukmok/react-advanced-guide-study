# React 고급안내서 스터디 - Error Boundary

Error Boundary는 컴포넌트 랜더링 과정 중 자바스크립트 에러가 발생시 복구를 하기 힘들었습니다.

그래서 컴포넌트 내에서 에러 를 정상적으로 처리할 수 있는 방법을 제공하지 않아서 복구 할 수 없었습니다.

개발 과정 중 발견하면 괜찮지만 배포가되었을시 특정 컴포넌트에서 문제가 발생한다면 전체 어플리케이션의 동작에 문제로 번지게됩니다. (특히 third party 컴포넌트일 경우, 즉시 고칠 수도 없다.)

Error Boundary는

하위 컴포넌트 트리의 어디에서든 자바스크립트 에러를 기록하며 깨진 컴포넌트 트리 대신 폭백 UI를 보여주는 React Component 입니다.

에러 경계는 랜더링 도중 **생명주기 메소드** 및 그 아래에 있는 전체 트리에서 에러를 잡아냅니다.

## 에러경계에서 포착하지않는 에러

- 이벤트 핸들러
- 비동기적인 코드
- 서버 사이드 렌더링

# 에러 경계에서 사용되는 생명주기 메서드

에러가 발생한 뒤에 폴백 UI를 렌더링하려면

`static getDerivedStateFromError()` 을 사용해서 에러 여부를 결정

에러 정보를 자세히 얻기 위해서 아래 메소드에서 에러정보를 얻을 수 있습니다.

`componentDidCatch`(error, errorInfo)

https://stackoverflow.com/questions/60537645/how-to-implement-error-boundary-with-react-hooks-component

아직 hook으로 에러 바운더리를 만드는 방법은 없는 듯합니다.

```js
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트 합니다.
    return { hasError: true };
  }

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

```jsx
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

한번 만들어두면 여러 프로젝트에서 재사용될 것 같습니다. (아마 실제 배포시에 유용할 것 같습니다.)

# Error 예시

대부분 렌더링 과정중 발생하는 에러는 잘못된 타입의 프로퍼티를 받았을때 혹은 프로퍼티를 잘못접근(undefine)할 때 에러가 발생할 것같습니다.

언제 쓰는게 좋을까?

개인적인 견해로는 아래와 같은 경우에 유용할 것 같다.

- 외부 컴포넌트 라이브러리를 사용할 때

- 작성한 위젯에 잘못된 property가 들어갔을 경우(이럴 일이 없도록 잘 처리해야겠지만 서버에서 받은 데이터를 기반으로 위젯의 프로퍼티 설정을 변경할 경우, 예측할 수 없다.)

> `try...catch`와 마찬가지로 꼭 에러라고 생각되는 부분에만 적용할는 것이 좋을 것같습니다. 정상적이 워크 플로우에 사용하면 혼란을 가중시킬 수 있을 것 같습니다.
