import React, { Profiler, useState } from "react";
import ReactDOM from "react-dom";
import Task from "./Task";

type Task = {
    id: number,
    title: string,
    content: string,
    date: string
}
const initTasks = [
    {
        id: 1233225,
        date: new Date("2020-01-02").toString(),
        title: "Test title1",
        content: "Test content",
    },
    {
        id: 2324234,
        date: new Date("2020-01-03").toString(),
        title: "Test title2",
        content: "Test content",
    },
    {
        id: 3234234,
        date: new Date("2020-01-04").toString(),
        title: "Test title3",
        content: "Test content",
    }
]

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

    const handleClickDownSortTask = () => {
        const sorted = todo.sort((taskA, taskB) => {
            const dateA = new Date(taskA.date);
            const dateB = new Date(taskB.date);
            if (dateA > dateB) {
                return 1;
            } else if (dateA < dateB) {
                return -1;
            } else {
                return 0;
            }
        });
        setTodo([...sorted]);
    }

    const handleClickUpSortTask = () => {
        const sorted = todo.sort((taskA, taskB) => {
            const dateA = new Date(taskA.date);
            const dateB = new Date(taskB.date);
            if (dateA > dateB) {
                return -1;
            } else if (dateA < dateB) {
                return 1;
            } else {
                return 0;
            }
        });
        setTodo([...sorted]);
    }

    return <div>
        <button onClick={handleClickDownSortTask}>날짜로 내림차순 정렬</button>
        <button onClick={handleClickUpSortTask}>날짜로 오름차순 정렬</button>
        <button onClick={handleClickAddTask}>추가</button>
        <Profiler id={"Task List"} onRender={(id, phase, actualDuration, basDuration, startTime, commitTime, interaction) => {
            console.log("id", id);
            console.log("phase", phase);
            console.log("actualDuration", actualDuration);
        }}>

            {todo.map((task, idx) => {
                // TODO: Check 
                // return <Task key={idx} id={task.id} date={task.date} title={task.title} content={task.content} />
                return <Task key={task.id} id={task.id} date={task.date} title={task.title} content={task.content} />
            })}
        </Profiler>
    </div>;
};

ReactDOM.render(<App />, document.getElementById("app"));
