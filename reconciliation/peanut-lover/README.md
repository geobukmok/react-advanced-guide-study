# React Reconcilation

리액트는 **선언적 API** (?) 를 제공하기 때문에 갱신이 될 때마다 매번 무엇이 바뀌었는지를 걱정할 필요가 없습니다. 왜?

이는 어플리케이션 작성을 무척 쉽게 만들어주지만, React 내부에서 **어떤 일이 일어나고 있는지는 명확히 눈에 보이지 않습니다.**

 이 글에서는 리액트팀이 React의 비교 (diffing) 알고리즘을 만들 때 어떤 선택을 했는지를 소개합니다. **이 비교 알고리즘 덕분에 컴포넌트의 갱신이 예측가능해지면서도 고성능 앱이라고 불러도 손색없을 만큼 충분히 빠른 앱을 만들 수 있습니다.**



**데이터 변화에 따른 컴포넌트 렌더링까지 어떤 일이 일어나는지 구체적으로 알아봅시다.**



# 비교 알고리즘을 고안하게된 동기

리액트를 사용하다 보면, `render()` 함수는 React 엘리먼트 트리를 만드는 것이다. 라고 생각이 드는 순간이 있을 것입니다.

 state나 props가 갱신되면 변화를 감지해서 `render()` 함수는 새로운 React 엘리먼트 트리를 반환할 것입니다.

이때 React는 **방금 만들어진 트리에 맞게 가장 효과적으로 UI를 갱신하는 방법**을 알아낼 필요가 있습니다. 



하나의 트리를 가지고 다른 트리로 변환하기 위한 최소한의 연산 수를 구하는 알고리즘 문제를 풀기 위한 일반적인 해결책들이 있습니다. 하지만 **아무리 좋은 알고리즘이라도 n 개의 엘리먼트가 있는 트리에 대해 O(n^3)의 복잡도를 가집니다**. 전체 비교가 불가피하기 때문입니다.



리액트에 이 알고리즘을 적용한다면, 1000 개의 엘리먼트를 그리기 위해 10억번의 비교연산을 수행해야합니다. 



리액트는 두 가지 가정을 기반하여 O(n) 복잡도의 휴리스틱 알고리즘을 구현했습니다.

1. 서로 다른 타입의 두 엘리먼트는 서로 다른 트리를 만들어낸다. (일종의 백트래킹 방식)
2. 개발자가 `key` props 를 통해, 여러 렌더링 사이에서 어떤 자식 엘리먼트가 변경되지 않아야 할지 표시해 줄 수 있다.

`key` 는 동일한 sibling 컴포넌트간에 비교대상 선정에 힌트를 줘서 불필요한 리렌더링을 막을 수 있다.?

해당 내용은 아래 소개할 **자식에 대한 재귀적 처리** 내용에서 확인할 수 있습니다.



>  **휴리스틱 알고리즘**이란? * **휴리스틱**(**heuristics**)이란 불충분한 시간이나 정보로 인하여 합리적인 판단을 할 수 없거나, 체계적이면서 합리적인 판단이 굳이 필요하지 않은 상황에서 **사람들이 빠르게 사용할 수 있게 보다 용이하게 구성된 간편** 추론의 방법이다.



# 비교 알고리즘 diffing algorithm

두 개의 트리를 비교할 때, React는 두 엘리먼트의 루트(root) 엘리먼트부터 비교합니다. **이후의 동작은 루트 엘리먼트의 타입에 따라** 달라집니다. 

### 엘리먼트의 타입이 다른 경우

두 루트 엘리먼트의 타입이 다르면, 리액트는 이전 트리를 버리고 완전히 새로운 트리를 구축합니다. 

`<a>` 에서 `<img>` 로, `<Article>`에서 `<Comment>`로, 혹은 `<Button>` 에서 `<div>` 로 바뀌는 것 모두 트리 전체를 재구축하는 경우입니다.

루트 엘리먼트 아래의 모든 컴포넌트도 언마운트되고 그 state도 사라집니다. 예를 들어, 아래와 같은 비교가 일어나면,

```jsx
<div>
	<Counter />
</div>

<span>
	<Counter />
</span>
```

Counter는 사라지고 새로 다시 마운트가 됩니다.



### DOM 엘리먼트의 타입이 같은 경우

같은 타입의 두 React DOM 앨리먼트를 비교할 때, React는 두 엘리먼트의 속성을 확인하여, 동일한 내역은 유지하고 변경된 속성들만 갱신합니다. 예를들어

```html
<div className="before" title="stuff" />
<div className="after" title="stuff" />
```

이 두 엘리먼트를 비교하면, React는 현재 DOM 노드상에 `className` 만 수정합니다.

DOM 엘리먼트 비교에서는 속성간의 비교가 이루어진다는점.

style이 갱싱 될 때, React는 또한 변경된 속성만을 갱신합니다.



### 같은 타입의 컴포넌트 엘리먼트

컴포넌트가 갱신되면 인스턴스는 동일하게 유지되어 **렌더링 간 state가 유지**됩니다. React는 새로운 엘리먼트의 내용을 반영하기 위해 현재 컴포넌트 인스턴스의 props를 갱신합니다.

다음으로 `render()`메서드가 호출되고 비교 알고리즘이 이전 결과와 새로운 결과를 재귀적으로 처리합니다. 



### 자식에 대한 재귀적 처리

DOM 노드의 자식들을 재귀적으로 처리할 때, React는 기본적으로 동시에 두 리스트를 순회하고 차이점이 있으면 변경을 생성합니다.

예를 들어, 자식의 끝에 엘리먼트를 추가하면, 두 트리 사이의 변경은 잘 작동할 것입니다.

```html
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

React는 두 트리에서는 `<li>first</li>`가 일치하는 것을 확인하고, `<li>second</li>` 가 일치하는 것을 확인합니다. 그리고 마지막으로 `<li>thrid</li>` 를 트리에 추가합니다.



하지만 리스트의 맨 앞에 추가될 경우 성능이 좋지않습니다.

```html
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

두 트리 변환은 형편없이 작동합니다. 



하지만 React는 `<li>Duke</li>` 와 `<li>Villanova</li>`종속 트리를 그대로 유지한 대신 모든 자식을 변경합니다. 이러한 비효율은 문제가 될 수 있습니다.

### Keys

위 문제를 해결하기 위해, React는 `key`속성을 지원합니다. 자식들이 key를 가지고 있다면, React는 **key를 통해** 기존 트리와 이후 트리의 자식들이 일치하는지 확인합니다. 예를들어, 위 비효율적인 예시에 `key`를 추가하여 트리의 변환 작업이 효율적으로 수행되도록 수정할 수 있습니다.

```html
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



이제 React는 `2014`key를 가진 엘리먼트가 새로 추가되었고, `2015`, `2016` key를 가진 엘리먼트는 그저 이동만 하면 되는 것을 알 수 있습니다.

실제로, key로 사용할 값을 정하는 것은 어렵지 않습니다.  **오로지 형제 사이에서만 유일**하면 되고, 전역에서 유일할 필요는 없습니다.

최후의 수단으로 **배열의 인덱스를 key로** 사용할 수 있습니다. **항목들이 재배열되지 않는다면** 이 방법도 잘 동작할 것이지만, 재배열되는 경우 비효율적으로 동작할 것입니다. 



인데스를 key로 사용 중 배열이 재배열이 되면 컴포넌트의 state와 관련된 문제가 발생할 수 있습니다. 컴포넌트 인스턴스는 key를 기반으로 갱신되고 재사용됩니다. **인덱스를 key로 사용하면, 항목의 순서가 바뀌었을 때 key 또한 바뀌게 됩니다.**

그 결과로, 컴포넌트의 state가 엉망이 되거나 의도하지 않는 방식으로 바뀔 수도 있습니다.



## 고려 사항

앞서 설명했던 규칙에 따라 렌더링 전후에 변경된 부분만을 적용할 것입니다. 

