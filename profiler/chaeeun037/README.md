# REACT PROFILER

### Why?

React 애플리케이션이 렌더링하는 빈도와 비용을 측정한다. 느린 부분을 식별해서 메모이제이션같은 성능 최적화를 적용할 수 있다.



## 사용법

React 트리의 모든 곳에 추가되어 트리의 특정 부분의 렌더링 비용을 계산할 수 있다.

props로 `id`(문자열)와 `onRender`(콜백함수)를 받는다. `onRender`은 React 트리 내의 컴포넌트에 업데이트가 커밋되면 호출된다.

**[예시] 중첩 사용**

```react
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



### 주의

Profiler은 가벼운 컴포넌트이지만 CPU와 메모리 비용이 추가되므로 필요할 때만 사용하도록 한다.



## onRender 콜백

어떤 것이 렌더링 되었는지, 렌더링 되는데 시간이 얼마나 걸렸는지 알 수 있다.

```react
function onRenderCallback(
  id, // 방금 커밋된 Profiler 트리의 "id"
  phase, // "mount" (트리가 방금 마운트가 된 경우) 혹은 "update"(트리가 리렌더링된 경우)
  actualDuration, // 커밋된 업데이트를 렌더링하는데 걸린 시간
  baseDuration, // 메모이제이션 없이 하위 트리 전체를 렌더링하는데 걸리는 예상시간 
  startTime, // React가 언제 해당 업데이트를 렌더링하기 시작했는지
  commitTime, // React가 해당 업데이트를 언제 커밋했는지
  interactions // 이 업데이트에 해당하는 상호작용들의 집합
) {
  // 렌더링 타이밍을 집합하거나 로그...
}
```

- **`id: string`** - 방금 커밋된 Profiler 트리의 id이다. 여러개의 Profiler를 사용하고 있다면 트리의 어느 부분이 커밋되엇는지 식별하는데 사용할 수 있다.
- **`phase: "mount" | "update"`** - 해당 트리가 방금 마운트된 건지 prop, state 혹은 hooks의 변화로 인하여 리렌더링 된 건지 식별한다.
- **`actualDuration: number`** - 현재 업데이트에 해당하는 Profiler와 자손 컴포넌트들을 렌더하는데 걸린 시간이다. 하위 트리가 얼마나 메모이제이션([`React.memo`](https://ko.reactjs.org/docs/react-api.html#reactmemo), [`useMemo`](https://ko.reactjs.org/docs/hooks-reference.html#usememo), [`shouldComponentUpdate`](https://ko.reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate))을 잘 활용하고 있는지를 알 수 있다. 대다수의 자식 컴포넌트들은 특정 prop이 변할 경우에만 리렌더링이 필요하기 때문에 초기 렌더링 이후에 감소하는 것이 이상적이다.
- **`baseDuration: number`** - 메모제이션없이 Profiler 트리 내 개별 컴포넌트들을 render하는 예상 시간이다.
- **`startTime: number`** - React가 현재 업데이트에 대해 렌더링을 시작한 시간의 타임 스탬프이다.
- **`commitTime: number`** - React가 현재 업데이트를 커밋한 시간의 타임 스탬프이다. 이 값은 모든 프로파일러들이 공유하기 때문에 원한다면 그룹을 지을 수 있다.
- **`interactions: Set`** - 업데이트가 계획되었을 때 추적하고 있던 [“상호작용”](https://fb.me/react-interaction-tracing)의 집합이다.
