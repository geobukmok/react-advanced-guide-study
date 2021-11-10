# React 고급안내서 Profiler


Profiler는 React 어플리케이션이 렌더링하는 빈도와 렌더링 **비용**을 측정합니다.



Profiler는 메모제이션같은 성능 최적화 방법을 활용할 수 있는 애플리케이션의 느린부분을 식별해내는 거입니다.



> 프로파일링은 프로덕션빌드에서는 비활성화 되어 있습니다.



## 사용법

Profiler는 React 트리 내에 어디에나 추가 될 수 있으며 트리의 특정부분의 렌더링 비용을 줄여준다. 여러 최적화 기법을 적용하고 Profiler로 비교해보면 확실히 개선됨을 확인할 수 있습니다.



## React Component List `key` 프로퍼티는 리렌더링을 막는 걸까?

단순히 key 라는 식별자를 통해 동일한 DOM에 있어서는 중복 생성되지않도록 합니다. 간단한 예제를 통해 이해해보겠습니다. 

```tsx
import React, { Profiler } from "react";

interface TaskProps {
    id: number,
    date: string,
    title: string,
    content: string,
}
const Task: React.FC<TaskProps> = ({ id, date, title, content }) => {
  
    return <div style={{ border: "1px solid #000", margin: "2px" }}>
        <Profiler id={`task ${id}`} onRender={(id, phase, actualDuration, basDuration, startTime, commitTime, interaction) => {
            console.log("id", id);
            console.log("phase", phase);
        }}>
            <p>{date}</p>
            <p>{title}</p>
            <p>{content}</p>
        </Profiler>
    </div>
}

export default Task;
```

위와 같은 `Task` 컴포넌트를 렌더링해보겠습니다. 컴포너트 상태를 확인하기 위해  `Profiler` 의 `phase` 값을 로그로 확인해보겠습니다.

```tsx
const App = () => {
  const [todo, setTodo] = useState<Task[]>(initTasks);
  const handleClickAddTask = () => {
    const newID = todo.length + 1;
    setTodo([...todo, {
        id: newID,
        date: new Date().toString(),
        title: "Test title " + newID,
        content: "Test content",
    }])
  }

  const handleClickSortTask = () => {
      const sorted = todo.sort((taskA, taskB) => taskA.date > taskB.date ? 1 : -1);
      setTodo([...sorted]);
  }
    
  return <div>
  <button onClick={handleClickSortTask}>날짜로 정렬</button>
  <button onClick={handleClickAddTask}>추가</button>
  {todo.map((task, idx) => {
      	return <Task key={task.id} id={task.id} date={task.date} title={task.title} content={task.content} />
  })}
  </div>
}
```

데이터 상태 변경에 따른 컴포넌트 렌더링 상태를 확인하기 위해 컴포넌트를 추가하거나 순서를 바꾸는 버튼을 추가해놨습니다.



- 첫 렌더링시

아래와 같이 Task Component들은 phase값이 `mount` 인 체로 렌더링 되는 것을 프로파일러를 통해 확인할 수 있습니다.

```
id task 1
phase mount
id task 2
phase mount
id task 3
phase mount
```

- 새 Component 추가(추가 버튼 클릭)

```
id task 1
phase update
id task 2
phase update
id task 3
phase update
id task 4
phase mount
```

당연한 결과지만 새로 추가된 component만 마운트상태이고 기존에 있던 task update 상태로 렌더링되는 것을 확인할 수 있습니다. 당연한 듯하지만 이렇게 기존에 존재하던 component라는 정보를 알 수 있게 해주는 것이 `key` 프로퍼티의 역할 입니다.



이러한 key 프로퍼티를 통한 식별자 메커니즘이 없다면 항상 새로운 컴포넌트들을 마운트해야할 것 같습니다. 즉 형제 컴포넌트간에 구분을 위해 존재할 뿐입니다. 

**Property 비교를 통한 리렌더링은 key가 해주는 것이 아니라 컴포넌트간에 비교 대상을 선정하는 역할**을 해줄뿐입니다.



# Profiler 활용해서 React.memo의 최적화 확인하기

```tsx
import React, { Profiler } from "react";

interface TaskProps {
    id: number,
    date: string,
    title: string,
    content: string,
}
const Task: React.FC<TaskProps> = ({ id, date, title, content }) => {
    return <div style={{ border: "1px solid #000", margin: "2px" }}>
        <p>{date}</p>
        <p>{title}</p>
        <p>{content}</p>
    </div>
}

export default React.memo(Task); // 최적화
```



`key` 를 적절히 설정해줬다면 React.memo 로 최적화가 잘 됨을 확인할 수 있습니다.