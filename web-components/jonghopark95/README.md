# Web Components



### React vs Web Components

리액트와 Web Components 는 서로 다른 문제를 해결하기 위해 만들어졌다.

Web Component 재사용 가능한 컴포넌트의 강한 캡슐화를 제공한다.

그러나, React는 데이터와 동기화되는 DOM을 유지하기 위한 선언적인 라이브러리를 제공한다.

두 가지 목표가 상호 보완적이기에, 개발자로서 두 가지를 적재적소에 활용하는 것이 좋다.



### Web Component의 필수적인 API

Web Components 는 종종 필수적인 API 를 사용해야 한다.

예를 들어, `video` Web Component는 play, pause 함수를 사용해야 할 것이다.

이런 필수적인 Web Component API에 접근하기 위해, 우린 DOM node에 직접적으로 상호작용 해야 한다.

만약, third-party Web Component를 사용한다면 최고의 방안은 Web Component를 감싸는 React Component를 만드는 것이다.



Web Component에서 발생하는 이벤트는 React render tree에 정상적으로 전파되지 않을 수도 있다.

이럴 경우, 우리는 수동적으로 event handler를 붙여줘야 한다.



### 주의할 점

Web Component를 사용하며 주의할 점은, React와 달리 Web Component는 `className `  이 아닌  `class`를 사용해야 한다는 점이다.

```jsx
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```
