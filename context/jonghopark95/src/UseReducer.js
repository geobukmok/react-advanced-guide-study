/**
 * useReducer훅을 사용하여,
 * 컴포넌트의 상태값을 Redux의 Reducer처럼 관리합니다.
 */
import ColorModule, { setColor } from "./ColorModule";
import React, { useContext } from "react";

const ColorContext = React.createContext("red");
const SetColorContext = React.createContext(() => {});

const AppProvider = (props) => {
  const { state, dispatch } = ColorModule();

  return (
    <SetColorContext.Provider value={dispatch}>
      <ColorContext.Provider value={state}>
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
  const { color } = useContext(ColorContext);
  const dispatch = useContext(SetColorContext);

  return (
    <>
      <p>Color : {color}</p>
      <button onClick={() => dispatch(setColor("blue"))}>Blue 로 변경!</button>
    </>
  );
};

export default App;
