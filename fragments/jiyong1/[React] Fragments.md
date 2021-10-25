# [React] Fragments

React는 무조건 하나의 부모 Element를 반환해야 합니다.

그러나, React에서 컴포넌트가 여러 엘리먼트를 반환하는 것은 흔한 패턴입니다. Fragments는 DOM에 별도의 노드를 추가하지 않고 여러 자식을 그룹화할 수 있습니다.

두 가지 방식이 있고, 다음과 같습니다.

- `<></>`

  ```jsx
  function App() {
    return (
    	<>
      	<p>hi</p>
      	<p>hello</p>
      </>
    );
  }
  ```

- `React.Fragment`

  ```jsx
  function App() {
    return (
    	<React.Fragment>
      	<p>hi</p>
      	<p>hello</p>
      </React.Fragment>
    );
  }
  ```

<br>

`key`를 전달해야 하는 경우 명시적으로 `React.Fragment`를 선언해야 합니다.

```jsx
function App({items}) {
  return (
  	<dl>
      {items.map(item => (
        // React는 `key`가 없으면 key warning을 발생합니다.
        <React.Fragment key={item.id}>
          <dt>{item.title}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
```

