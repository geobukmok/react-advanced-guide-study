# Fragments

React에서는 컴포넌트가 여러 엘리먼트를 반환할 때 반드시 단일 태그로 감싸야 한다. 이 때 DOM에 불필요한 또는 무의미한 노드가 추가될 수 있는데, `React.Fragment`는 이를 방지해준다.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

## 단축 문법

Fragment에 전달할 어트리뷰트가 없다면 빈 태그를 통해 표현할 수 있다. Fragments를 선언하는 더 짧고 새로운 문법이다.

```js
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

## key가 있는 Fragments

> `key`는 Fragment에 전달할 수 있는 유일한 어트리뷰트이다.

Fragments에 `key`가 있다면 `<React.Fragment>` 문법으로 명시적으로 선언해야 한다.

```js
function Glossary(props) {
  return (
    <dl>
      {props.items.map((item) => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```
