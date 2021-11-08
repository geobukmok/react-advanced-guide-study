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

export default React.memo(Task);
// export default Task;