/**
 * 함수형 컴포넌트를 사용한다면,
 * useContext 훅을 사용하여 보다 간결하게 표현할 수 있습니다.
 */
import React, { useContext, useState } from "react";

const ColorContext = React.createContext("red");
const SetColorContext = React.createContext(() => {});

const App = () => {
  const [color, setColor] = useState("pink");

  return (
    <SetColorContext.Provider value={setColor}>
      <ColorContext.Provider value={color}>
        <Parent />
      </ColorContext.Provider>
    </SetColorContext.Provider>
  );
};

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
