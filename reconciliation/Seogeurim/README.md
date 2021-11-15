# 재조정 (Reconciliation)

React 내부에서는 "diffing" 알고리즘을 통해 컴포넌트 갱신을 높은 성능으로 수행한다.

React 컴포넌트에서는 `render()` 함수를 통해 React 엘리먼트 트리를 만들게 된다. `state`나 `props`가 갱신되면 `render()` 함수는 새로운 React 엘리먼트 트리를 반환하게 되는데, 이 트리와 기존의 트리를 비교하여 효율적으로 UI를 갱신해야할 것이다.

하나의 트리를 다른 트리로 변환하기 위한 알고리즘 중 현재 sota로 나와있는 것은 O(n<sup>3</sup>)의 시간복잡도를 가진다. 만일 이를 React에 적용하면, 1000개의 엘리먼트를 그리기 위해 10억 번의 연산을 수행해야 하는데 비용이 매우 크다.

그래서 React는 **heuristic**한 O(n)의 알고리즘을 구현하였다. 이는 두 가지 가정에 기반하는데,

1. 서로 다른 type의 두 엘리먼트는 다른 트리를 생산한다.
2. 개발자가 `key` prop을 통해 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시할 수 있다.

## The Diffing Algorithm

### Elements Of Different Types

엘리먼트의 type이 다를 경우(ex. `<button>`에서 `<div>`로 바뀔 때), 기존 트리를 버리고 완전히 새로운 트리를 구축한다.

트리를 버릴 때 이전 DOM 노드들은 모두 파괴된다.(`componentWillUnmount()`) 그리고 새로운 트리가 만들어지면서 새로운 DOM 노드들이 DOM에 삽입된다.(`UNSAFE_componentWillMount()` > `componentDidMount()`)

```jsx
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

위와 같은 경우 `<div>`에서 `<span>`으로 엘리먼트 타입이 바뀌므로 이전 `Counter` 컴포넌트는 사라지고 새로 마운트가 된다.

### DOM Elements Of The Same Type

같은 type의 두 React DOM 엘리먼트를 비교할 때는, 동일한 내역은 유지하고 변경된 속성들만 갱신한다.

```jsx
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

위와 같은 경우 현재 DOM 노드에서 변경된 속성인 `className`만 수정하게 된다.

### Component Elements Of The Same Type

컴포넌트가 갱신되면 React는 새로운 엘리먼트의 내용을 반영하기 위해 현재 컴포넌트 인스턴스의 props를 갱신한다. 이 때 `UNSAFE_componentWillReceiveProps()`, `UNSAFE_componentWillUpdate()`, `componentDidUpdate`를 호출한다.

## Recursing On Children

다음 코드를 살펴보자.

```jsx
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

위 코드에서 React는 두 트리를 비교하면서 `<li>first</li>`, `<li>second</li>`가 일치하는 것을 확인한 뒤 `<li>third</li>`를 트리에 추가한다. 하지만 이렇게 순차적으로 비교하는 방식을 사용했을 때, `<li>third</li>`가 리스트의 맨 앞에 추가되었을 경우 성능이 좋지 않을 것이다.

```jsx
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

위 경우 리스트의 맨 앞에 `<li>Connecticut</li>`만 추가했음에도 불구하고 모든 자식이 변경될 것이고, 아주 비효율적이다.

### Keys

React는 `key` prop을 통해 위 문제를 해결한다. 고유의 `key` 값을 통해 기존 트리와 일치하는 부분을 확인하는 것이다.

```jsx
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

위 예시를 살펴보면 `'2014'` key를 가진 엘리먼트만이 새로 추가되었다는 것을 알 수 있다.

#### 배열의 index를 key로 사용할 경우

보통 `key`는 데이터의 ID 속성과 같은 식별자를 활용해 지정한다. 하지만 식별자가 존재하지 않아 배열의 index를 key로 사용한다면, **항목들이 재배열되는지**를 확인해야 한다. 재배열되는 경우에는 재배열 후 `key` 값 또한 다시 바뀌기 때문에 비효율적으로 동작하기 때문이다.

## 고려 사항

개발자의 입장에서 코드를 작성할 때, React의 heuristic 알고리즘이 기반하고 있는 가정을 고려하여 작성하는 것이 좋다.

1. 매우 비슷한 결과물을 출력하는 두 컴포넌트를 교체한다면, 같은 type의 엘리먼트로 만드는 것이 좋을 것이다.
2. `key`는 변하지 않고, 예상 가능하며, 유일한 값이어야 한다. (`Math.random()`으로 생성된 값 등 변하는 `key`를 사용하면 DOM 노드를 불필요하게 재생성하여 성능이 나빠질 수 있다.)
