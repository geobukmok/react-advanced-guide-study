/**
 * createContext, Provider, Consumer를 사용해
 * 하위 컴포넌트에 context를 전달합니다.
 */
import React from "react";

const ColorContext = React.createContext("red");

const App = () => {
  const color = "blue";

  return (
    <ColorContext.Provider value={color}>
      <Parent />
    </ColorContext.Provider>
  );
};

const Parent = () => <Child />;
const Child = () => <GrandChild />;

const GrandChild = () => {
  return (
    <ColorContext.Consumer>
      {(color) => <p>Color : {color}</p>}
    </ColorContext.Consumer>
  );
};

export default App;
