# Integrating with Other Libraries



Database.js JQuery Plugin을 예를 들어보자.



### import Library

```jsx
const $ = require('jquery');
$.Datatable = require('datatables.net');
```



### render()

render() 메소드 내에 ref를 붙여주자.

```jsx
render(){
  return(
    <table ref={(el) => (this.el = el)}>
      <thead>
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Completed</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{this.props.children}</tbody>
    </table>
  )
}
```



### componentDidMount()

해당 메소드에서 ref를 받아와서, jquery method인 DataTable을 호출해준다.

```jsx
componentDidMount(){
  this.$el = $(this.el);
  this.currentTable = this.$el.DataTable();
}
```



### componentDidUpdate()

해당 메소드에서 만약 props가 업데이트되면 ajax.reload를 호출하여 database를 refresh 해준다.

datatable.js에선 이 메소드는 table을 refresh 해주는 것이다.

```jsx
componentDidUpdate(prevProps){
  if(prevProps.children !== this.props.children){
    this.currentTable.ajax.reload()
  }
}
```



### componentWillUnmount()

만들었던 table을 언마운트 시 제거해주자.

```jsx
componentWillUnmount(){
  this.currentTable.destroy()
}
```



### 컴포넌트로서 사용

```jsx
import React from "react";
import DataTable from "./components/DataTable";

class App extends React.Component {
  state = {
    todos: [],
  };

  componentDidMount() {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          todos: data,
        })
      );
  }

  render() {
    return (
      <DataTable>
        {this.state.todos.map((todo) => (
          <tr key={todo.id}>
            <td>{todo.id}</td>
            <td>{todo.title}</td>
            <td>{todo.completed ? "Yes" : "No"}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </DataTable>
    );
  }
}

export default App;
```



즉, 외부 플러그인을 사용할 예정이라면 Class Component 내의 다양한 메소드들을 사용해 확실히 컨트롤할 수 있어야 한다.

