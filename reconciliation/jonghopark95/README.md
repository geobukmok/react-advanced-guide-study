

# Reconciliation

### 

## Motivation



[Profiler API](https://reactjs.org/docs/profiler.html)에서 말하듯이, 리액트는 두 가지 단계에서 작동을 하게 된다.



1. Render Phase

   * 해당 단계에선 DOM 을 만들기 위해 **어떤 변화가 필요한지** 결정한다.
   * React는 render() 를 호출하고, 이전 렌더값과 결과를 비교하게 된다.

2. Commit Phase

   * 해당 단계에선 React가 **변화를 적용**하게 되는 단계이다.
   * DOM을 예로 들면, React가 DOM 노드를, insert, update, remove 하는 단계이다.
   * 또한, LifeCycle 함수들을 해당 단계에서 적용하게 된다.

   

Reconciliation 은 Render Phase에서 효율적으로 UI를 업데이트 하기 위한 알고리즘이다.



[state of the art algorithm](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) 에 따르면, 트리에서 n개의 요소들을 바탕으로 다른 트리를 만들기 위해선 O(n^3) 의 시간 복잡도가 소요된다. 이는 너무 비싼 연산이다.



**리액트는 두 가지 가정하에 좀 더 실용적인 O(n) 알고리즘을 만들게 되는데, 두 가지 가정은 다음과 같다.**

1. 트리를 비교 했을 때 root element type이 다를 경우, 리액트는 다른 트리를 만들게 된다.
2. 개발자는 `key prop`을 통해 child element가 변경되지 않아야 할지 보여줄 수 있다.



대부분의 실용적인 사례에서 위 가정은 들어맞았기 때문에, 리액트는 이 알고리즘대로 reconciliation을 수행하게 된다.





## Diffing Algorithm



두 개의 트리를 비교 할 때, 리액트는 root elment 부터 비교한다. 이후의 행동은 아래 4가지 특징에 따라 달라진다.

1. **다른 타입의 DOM Elements**
2. **같은 타입의 DOM Element**
3. **같은 타입의 Component Element**
4. **Children을 재귀적으로 호출하는 경우**



### 다른 타입의 DOM Elements

두 트리의 root elment가 다른 type을 가질 경우, React는 오래된 트리를 지워버리고 새로운 트리를 만든다.

`<a>에서 <img>` 같은 HTML Element 이던, `<Article>에서 <Comment>` 같은 컴포넌트이던, 모두 새로운 트리를 재구축하게 된다.



오래된 트리를 지울 때, DOM node 또한 함께 지워지게 된다. 클래스 컴포넌트일 경우, `componentWillUnmount()` 함수를 호출하게 된다. 

이후, 새로운 트리를 만들 때 새로운 DOM node들이 삽입하게 된다. 이 때, `UNSAFE_componentWillMount` 를 호출하며 이후 `componentDidMount()` 를 호출하게 된다. 이전의 오래된 트리와 연관된 state는 사라지게 된다.



해당 트리 아래의 `Children` 은 모두 제거된다. 예를 들면, 아래 코드에서 diffing이 일어난다고 할 때,

```tsx
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

`<Counter/>` 컴포넌트는 삭제되며, 새로운 컴포넌트가 마운트된다.



### 같은 타입의 DOM Element

만약 두 개의 React DOM Element가 같은 타입일 경우, 리액트는 동일한 속성들은 유지하며 바뀐 속성들만 업데이트한다.

아래 코드를 diffing 한다고 하자.

```tsx
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

두 element를 비교하면, React는 DOM 노드 상에 `className `만 수정하게 된다.



`style` 을 업데이트 하게 되면, 리액트는 해당 style 내부에서도 변경된 속성만 바꾸게 된다.

```tsx
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

위 코드에서 React는 `color` 속성 만을 수정하게 된다.



DOM 노드 처리가 끝나면, children에 대해 같은 방식으로 비교하게 된다.



### 같은 타입의 Component Element

컴포넌트가 업데이트 되면, 인스턴스는 가만히 있으며 render 간에 state 가 유지된다.

이 때, 새로운 element와 매치되는 컴포넌트 instance 의 props를 갱신하게 된다.

이후, `UNSAFE_componentWillReceiveProps()`, `UNSAFE_componentWillUpdate()`, `componentDidUpdate()` 를 호출하게 된다.



![React) React의 생명 주기(Life Cycle) - 라이프사이클 - ZeroCho Blog](https://cdn.filestackcontent.com/ApNH7030SAG1wAycdj3H)





### **Children을 재귀적으로 호출하는 경우**

두 개의 트리를 비교할 때, children이 반복되면 리액트는 두 리스트를 순회하며 차이가 있을 때마다 mutation을 만들게 된다.

아래 코드를 보자.

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



리액트는 두개의 트리에서 `<li>first</li>, <li>second</li>` 를 같다고 판단할 것이며,  `<li>third</li>` 를 트리에 삽입하게 될 것이다.



그러나 이는 성능적으로 그렇게 뛰어나지 않다. 예를 들어, 위 코드가 다음과 같이 변경되면 성능이 안좋아진다.

```jsx
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>third</li>
  <li>first</li>
  <li>second</li>
</ul>
```

React는 `<li>first</li>, <li>second</li>` 를 유지하지 않고 모든 child를 생성하게 된다. 이는 비효율적이다.



이 때, key를 써서 chlid element가 변경되지 않아야 함을 리액트에게 알려줄 수 있다.

자식들이 `key` 속성을 가지고 있다면 리액트는 key를 사용해 두 트리의 children을 비교하게 된다.

예를 들어, 위의 비효율적인 문제를 다음과 같이 수정할 수 있다.

```jsx
<ul>
  <li key="first">first</li>
  <li key="second">second</li>
</ul>

<ul>
  <li key="third">third</li>
  <li key="first">first</li>
  <li key="second">second</li>
</ul>
```



키를 정하는 방법은 다음과 같다.

1. 데이터의 유니크한 ID를 사용한다.
2. 1이 여의치 않으면, ID property를 사용하거나 hash를 만든다. 
   이 때, 전역적으로 unique 할 필요는 없다. 오직 형제들 사이에서 unique 하면 된다.
3. 2가 여의치 않으면, array 의 index 를 key 로 넘겨줄 수 있다. 
   **만약 아이템이 절대 재배열되지 않는다면 이는 문제가 없지만, 재배열되는 경우 문제가 발생한다.**



만약 인덱스를 key로 사용한다면, 항목의 순서가 바뀌었을 때 key도 변경될 것이고, 컴포넌트의 state가 엉망이 될 것이다.



## TradeOffs



즉, 중요한 것은 render를 호출할 때 트리 간의 차이를 비교하여 다른 부분만 변경한다는 것이다.

React는 아래과 같은 가정하에 reconcilation을 하므로, 가정이 들어맞지 않는다면 성능이 엉망진창이 될 것이다.

1. diffing algorithm은 다른 컴포넌트 타입의 subtree는 비교하지 않는다. 
   만약, 아주 비슷한 output인데 컴포넌트 타입이나 root dom 타입이 다를 경우, 이를 같은 타입으로 바꿔주는 것이 더 좋다.
2. Key 들은 stable, predictable 그리고 unique 해야 한다. 
   `Math.random()` 과 같은 예측할 수 없는 값을 사용하게 되면, 많은 component instance, DOM 노드를 불필요하게 재생성하게 되므로 이는 성능 감소로 이어지게 된다.

