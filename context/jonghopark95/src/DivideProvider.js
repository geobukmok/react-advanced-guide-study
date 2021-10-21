/**
 * Provider가 많아 질경우,
 * 이를 관리하는 컴포넌트를 만들어 분리할 수 있습니다.
 */
import React, { useContext, useState } from "react";

const ColorContext = React.createContext("red");
const SetColorContext = React.createContext(() => {});

const AppProvider = (props) => {
  const [color, setColor] = useState("pink");

  return (
    <SetColorContext.Provider value={setColor}>
      <ColorContext.Provider value={color}>
        {props.children}
      </ColorContext.Provider>
    </SetColorContext.Provider>
  );
};

const App = () => (
  <AppProvider>
    <Parent />
  </AppProvider>
);

const Parent = () => <Child />;
const Child = () => <GrandChild />;

const GrandChild = () => {
  const color = useContext(ColorContext);
  const setColor = useContext(SetColorContext);

  return (
    <>
      <p>Color : {color}</p>
      <button onClick={() => setColor("blue")}>Blue 로 변경!</button>
    </>
  );
};

export default App;
