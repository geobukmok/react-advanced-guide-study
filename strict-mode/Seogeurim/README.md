# Strict Mode

React의 Strict Mode를 통해 애플리케이션 내의 잠재적인 문제를 잡아낼 수 있다. 개발 모드에서만 활성화되며 프로덕션 빌드에는 영향을 끼치지 않는다.

`<React.StrictMode>` 컴포넌트로 특정 컴포넌트를 감싸면, 그 컴포넌트와 자손 컴포넌트에 대하여 Strict 모드 검사가 이뤄진다. 본 문서에서는 Strict Mode에서 어떤 부분을 주로 검사하는지 설명하고 있다.

### Identifying components with unsafe lifecycles

- unsafe lifecycle을 사용하는 클래스 컴포넌트 목록을 정리해 경고 로그를 출력한다.
- 서드 파티 라이브러리를 사용한다면, unsafe lifecycle을 사용하지 않는 것에 대한 장담을 하기 어려운데 이 때 유용할 수 있다.
- React의 concurrent 렌더링에 있어서 이점을 얻을 수 있다.

### Warning about legacy string ref API usage

- ref를 관리하는 방법 중 [문자열 ref는 권장되지 않는 방법](https://github.com/facebook/react/issues/1373)이었다.
- React 16.3에서 객체 ref가 문자열 ref를 교체하는 용도로 나왔기 때문에, Strict 모드는 문자열 ref의 사용에 대해 경고한다.

### Warning about deprecated findDOMNode usage

- `findDOMNode`를 통해 부모가 자식의 DOM 노드 렌더링에까지 영향을 줄 가능성이 존재한다.
  - 추상화 레벨이 무너진다.
  - 리팩토링이 어려워진다.
- ref를 넘겨주는 방식을 통해 DOM에 닿을 수 있기 때문에, `findDOMNode`는 권장되지 않으며 경고한다.

### Detecting unexpected side effects

개념적으로 React는 두 단계로 동작한다.

- **렌더링 단계(`render`)** : 어떤 변화가 필요한지 결정
- **커밋 단계(`componentDidMount`/`componentDidUpdate`)** : 변경 사항을 반영

커밋 단계는 매우 빠르지만 렌더링 단계는 느릴 수 있다. 따라서 커밋하기 전에 렌더링 단계의 lifecycle 메서드를 여러 번 호출하거나, (에러 발생 또는 우선순위가 밀려) 아예 커밋을 하지 않을 수도 있는 위험이 있다.

이와 관련된 부작용이 일어나면, 메모리 누수 또는 잘못된 애플리케이션 상태와 같이 다양한 문제를 일으킬 가능성이 있다. Strict 모드가 자동으로 부작용을 찾아주는 것은 불가능하지만 좀 더 예측할 수 있게끔 만들어준다.

예를 들어,

```jsx
class TopLevelRoute extends React.Component {
  constructor(props) {
    super(props);

    SharedApplicationState.recordEvent('ExampleComponent');
  }
}
```

위 코드를 살펴보면 `SharedApplicationState.recordEvent`의 연산 결과가 계속 달라진다면 이 컴포넌트를 여러 번 인스턴스화했을 때 잘못된 애플리케이션 상태의 부작용으로 이어질 수 있다. 이렇게 컴포넌트의 `constructor`와 같은 메서드를 의도적으로 여러 번 호출하면 strict 모드가 찾아내도록 한다.

### Detecting legacy context API

Strict 모드에서는 레거시 context API 코드를 찾아 경고 메시지를 노출한다.
