# Profiler API



Profiler는 얼마나 React 앱이 자주 렌더링 되는지, 또는 어떤 것이 가장 렌더링 비용이 많이 들었는지 등을 측정한다.

> ***Profiling은 약간의 overhead가 발생하므로, production build에서는 사용할 수 없다.***



### 들어가기 전에

리액트는 두 가지 단계에서 작동을하게 된다.

* render phase
  * 해당 단계에선 DOM 등을 만들기 위해서 어떤 변화가 필요한지 결정한다.
  * 해당 단계에서, React는 render 함수를 호출하고, 이전 렌더값과 결과를 비교하게 된다.
* commit phase
  * 해당 단계는 React가 변화를 적용하는 단계이다.
  * React DOM을 예로 들면, 해당 단계는 React가 DOM 노드를 insert, update, remove 하는 단계이다.
  * React는 또한 life cycle 함수들을 해당 단계에서 적용한다.



### Profiler Component

Profiler 컴포넌트는 트리 특정 부분의 렌더링 비용을 계산해준다. 

id, onRender 의 두 가지 props를 요구하며, 이는 React Component가 commit phase 일 경우 호출한다.

```jsx
render(
  <App>
    <Profiler id="Panel" onRender={callback}>
      <Panel {...props}>
        <Profiler id="Content" onRender={callback}>
          <Content {...props} />
        </Profiler>
        <Profiler id="PreviewPane" onRender={callback}>
          <PreviewPane {...props} />
        </Profiler>
      </Panel>
    </Profiler>
  </App>
);
```



### onRender Callback

위 코드에서 봤다시피, Profiler는 onRender 함수를 prop으로 요구하게 된다.

React는 프로파일 트리 내의 컴포넌트가 commit phase 일 경우, 해당 함수를 호출하게 된다.

그리고 해당 함수에 입력값으로 다음과 같은 값을 받게 된다.



```jsx
function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) {
  // Aggregate or log render timings...
}
```



* id (string)
  * commit 된 Profiler 트리의 id 이다. 

* phase ("mount" | "update")
  * mount : 트리가 방금 마운트 되었을 경우
  * update : rerender 된 경우
* actualDuration (number)
  * Profiler, 자손 컴포넌트들을 렌더링하는데 걸린 시간.
  * 해당 값은 초기 마운트 후에 상당히 감소되어야 한다. 많은 자손 컴포넌트가 특정 prop이 바뀔때만 re render 되어야 하기 때문이다.
* baseDuration (number)
  * Profiler 트리 내의 각 컴포넌트의 가장 최근 render 시간.
  * 해당 값은 rendering cost의 가장 최악의 케이스를 측정한다.
    * 예를 들면, memoization 되지 않은 트리, 또는 초기 마운트
* startTime (number)
  * React가 현재 업데이트를 렌더링하기 시작한 시간
* commitTime (number)
  * React가 현재 업데이트를 커밋한 시간.

