/**
 * Parent, Child는 color를 사용하지 않고,
 * 단지 하위 컴포넌트의 props로 넘겨주는 역할만 하고 있습니다.
 */
const App = () => <Parent color="blue" />;
const Parent = (props) => <Child color={props.color} />;
const Child = (props) => <GrandChild color={props.color} />;
const GrandChild = (props) => <p>Color : {props.color}</p>;

export default App;
