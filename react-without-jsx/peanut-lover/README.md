# JSX 없이 React 개발하기

JSX없이 일반적으로 리액트 개발하기가 쉽지않다. 선언적 프로그래밍이 가능하도록하는 것에는 jsx의 도움이 크기 때문입니다.

하지만 라이브러리 수준에서는 필요할 때가 있지않을까 싶습니다. 그리고 리액트 내부적인 동작원리와 타입스크립트의 이해에도 도움이 될 것 같습니다.

## React.createElement(component, props, ...children)

JSX 사용될 때 `<A data={data}>This is Sample</A>`는 babel과 같은 트랜스파일링에 의해 아래와 같이 변형됩니다.

```js
React.createElement(A, {data: data}, "This is Sample")
```
