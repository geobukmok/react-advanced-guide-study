# REACT PORTAL

### Why?

하위 컴포넌트는 부모 컴포넌트의 css 구성 요소를 상속받기 때문에 상위 컨테이너에서 시각적으로 분리되어야 하는 경우에 사용된다.



## Portal?

부모 컴포넌트의 DOM계층 구조 바깥에 있는 DOM 노드로 자식을 렌더링한다.

[예시]

```react
ReactDOM.createPortal(child, container)
```



## 사용법

부모 컴포넌트에서 다이얼로그, 호버 카드, 툴팁과 같이 시각적으로 튀어나오도록 보여야 하는 경우에 유용하게 사용할 수 있다.

**[예시] 기존 방식**

```react
render() {
  // React는 새로운 div를 마운트하고 그 안에 자식을 렌더링합니다.
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

**[예시] Portal 사용**

```react
render() {
  // React는 새로운 div를 생성하지 *않고* `domNode` 안에 자식을 렌더링합니다.
  // `domNode`는 DOM 노드라면 어떠한 것이든 유효하고, 그것은 DOM 내부의 어디에 있든지 상관없습니다.
  return ReactDOM.createPortal(
    this.props.children,
    domNode  );
}
```

### 주의사항

웹 접근성과 관련해서 키보드 포커스 관리가 중요하므로 특히 모달 다이얼로그의 경우 모든 상호작용을 확인해야 한다.



## 이벤트 버블링

Portal은 React 트리 내에 존재하므로 DOM 트리에서의 위치와 관계없이 다른 자식들과 같이 동작한다. 

따라서 Portal 내부에서 발생한 이벤트는 DOM 트리에서 상위 노드가 아니더라도 React 트리에서 상위 노드라면 전파될 것이다. 



## Context vs Portal

Context는 최상위 레벨에서 직접 렌더링해야하지만 Portal은 계층 구조의 모든 곳에서 DOM 요소를 렌더링 할 수 있다.

Portal은 가끔씩 튀어나오는 모달 컴포넌트 등에 유용하고, Context는 데이터를 모든 노드에 전파해야 하기 때문에 Portal보다 성능 이슈가 있을 수 있고 i18n과 같은 다국어 적용 등의 앱 전체적으로 사용해야 하는 부분에 유용하다.

