/**
 * setColor Context를 하나 더 만들어
 * 하위 컴포넌트에 상태 변경 함수를 전달합니다.
 */
import React, { useState } from "react";

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
  return (
    <SetColorContext.Consumer>
      {(setColor) => (
        <ColorContext.Consumer>
          {(color) => (
            <>
              <p>Color : {color}</p>
              <button onClick={() => setColor("blue")}>Blue 로 변경!</button>
            </>
          )}
        </ColorContext.Consumer>
      )}
    </SetColorContext.Consumer>
  );
};

export default App;
