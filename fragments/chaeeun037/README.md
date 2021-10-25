# REACT FRAGMENTS

### Why?

컴포넌트가 여러 엘리먼트를 반환할 때 DOM에 별도의 노드를 추가하지 않고 Fragments를 사용해서 여러 자식을 그룹화할 수 있다.

특히 table 태그와 같이 구조가 정해져있는 태그에서 유용하게 사용할 수 있다.

**[예시] 유효하지 않는 html**

```react
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

```react
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Hello</td>
        <td>World</td>
      </div>
    );
  }
}
```

```html
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```



## 사용법

```react
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Hello</td>
        <td>World</td>
      </React.Fragment>
    );
  }
}
```



## 단축 문법

```react
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

`key`는 `Fragments`에 전달할 수 있는 유일한 어트리뷰트이다.

 `key`가 있다면 `<React.Fragment>` 문법으로 명시적으로 선언해야 한다.

```react
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // React는 `key`가 없으면 key warning을 발생합니다.
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```
