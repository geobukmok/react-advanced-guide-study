# Profiler API

Profiler는 React 앱의 **렌더링 비용을 측정**한다.

## Usage

Profiler는 React 트리 내 어디에나 추가하여 그 부분의 렌더링 비용을 계산해준다. 이는 `id`와 `onRender`의 두 가지 props를 요구한다.

아래 코드에서는 `Navigation` 컴포넌트와 그 자식 컴포넌트들의 렌더링 비용을 계산할 수 있다.

```jsx
render(
  <App>
    <Profiler id="Navigation" onRender={callback}>
      <Navigation {...props} />
    </Profiler>
    <Main {...props} />
  </App>
);
```

Profiler는 **여러 개**를 둘 수 있으며, 하위 트리의 다른 컴포넌트들을 계산하기 위해 **중첩**해서 사용할 수도 있다.

### onRender Callback

Profiler에 prop으로 필요한 `onRender`는 콜백 함수이다. React는 Profiler 트리 내 컴포넌트에 업데이트가 "commit"될 때마다 이 함수를 호출한다.

> "commit" : React가 어떤 변화를 **적용했을 때**를 말한다. 라이프사이클로 말하면 `componentDidMount`, `componentDidUpdate`가 일어났을 때이다.

```js
function onRenderCallback(
  id, // 방금 commit된 Profiler 트리의 "id"
  phase, // "mount" (트리가 방금 마운트가 된 경우) 혹은 "update"(트리가 리렌더링된 경우)
  actualDuration, // commit된 업데이트를 렌더링하는데 걸린 시간
  baseDuration, // memoization 없이 하위 트리 전체를 렌더링하는데 걸리는 예상시간
  startTime, // React가 해당 업데이트를 렌더링하기 시작한 시간
  commitTime, // React가 해당 업데이트를 commit한 시간
  interactions // 이 업데이트에 해당하는 interaction들의 집합
) {
  // Aggregate or log render timings...
}
```

- `id: string` : 복수의 Profiler를 사용할 때 트리의 어느 부분이 커밋되었는지 식별
- `phase: "mount" | "update"` : 트리가 마운트된 건지, 리렌더링된 건지 식별
- `actualDuration: number` : 렌더링 시간, 메모이제이션을 잘 활용하고 있는지를 알 수 있음
- `baseDuration: number` : 초기 마운트나 메모이제이션이 없는 경우 등, Profiler 트리 내 컴포넌트들 중 최악의 렌더링 비용을 알 수 있음

## Example

React 앱의 성능을 측정하는 방법으로는 Profiler API를 활용하는 방법과 React DevTool의 _Profiler_ 탭을 활용하는 방법이 있다.

Profiler 탭을 활용하는 방법에 대해서는 [이 포스트](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)에 잘 설명되어 있다. 이 포스트를 살펴보면 다양한 그래프를 통해 컴포넌트별 렌더링 비용을 측정할 수 있음을 알 수 있다.

Profiler API를 사용했을 때는 특정 컴포넌트에 대한 성능 측정에 대해 프로그래밍적인 접근이 가능하다. 예시를 들어보자면,

```jsx
// CustomStockChart.jsx
// 참고 : https://www.telerik.com/blogs/profiling-react-apps-with-profiler-api

import React, { Profiler } from 'react';

const CustomStockChart = (props) => {
  // ...

  return (
    <Profiler id="StockChart" onRender={logTimes}>
      <StockChart>{/* ... */}</StockChart>
    </Profiler>
  );
};

const logTimes = (id, phase, actualTime, baseTime, startTime, commitTime) => {
  console.log(`${id}'s ${phase} phase:`);
  console.log(`Actual time: ${actualTime}`);
  console.log(`Base time: ${baseTime}`);
  console.log(`Start time: ${startTime}`);
  console.log(`Commit time: ${commitTime}`);
};

export default CustomStockChart;
```

위 코드를 살펴보면, `CustomStockChart`가 렌더링되면 Profiler의 `onRender` 콜백이 실행되고 렌더링 비용에 대한 정보를 콘솔에 출력할 것이다. 실제로는 이 정보를 콘솔에 로깅하는 것보다는 유용한 집계 차트를 얻기 위해서 백엔드에 전송하는 방식으로 쓰일 수 있다고 한다.

---

#### 211108 스터디 정리

React에서 `key`로 `map` 메서드의 `index` 값을 사용하는 것은 성능이 좋지 않다고 알려져있다. 이를 Profiler로 체크해보면 실제로 그렇다는 것을 알 수 있다. `key`를 부여하고 정렬 기능 등을 수행하는 프로그램을 짠다고 생각했을 때, `key`를 통해 DOM을 재배치할 때 기존의 컴포넌트를 식별할 수 있다. 하지만 이 때 `index` 값을 사용한다면 다시 `key` 값을 부여하는 등의 작업이 일어나므로 성능이 좋지 않다.
