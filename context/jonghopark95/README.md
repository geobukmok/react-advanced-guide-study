# Context API 차근차근 사용해보기

## 1. 초기 앱 (App.js)
```js
/**
 * Parent, Child는 color를 사용하지 않고,
 * 단지 하위 컴포넌트의 props로 넘겨주는 역할만 하고 있습니다.
 */
const App = () => <Parent color="blue" />;
const Parent = (props) => <Child color={props.color} />;
const Child = (props) => <GrandChild color={props.color} />;
const GrandChild = (props) => <p>Color : {props.color}</p>;

export default App;

```

## 2. Provider, Consumer를 사용 (ProviderConsumer.js)
```js
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

```

## 3. 상태 변경함수 전달 (ModifyContextData.js)

```js
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

```

## 4. UseContext 사용 (UseContext.js)
```js
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
```

## 5. Provider 분리
```js
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

```

### 6. useReducer 사용 (UseReducer.js, ColorModule.js)
```js
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

```

```js
import { useReducer } from "react";

// Action
const SET_COLOR = "SET_COLOR";

// Action Creator
export const setColor = (payload) => ({ type: SET_COLOR, payload });

// State
const INITIAL_STATE = {
  color: "pink",
};

const reducer = (state, action) => {
  switch (action.type) {
    case SET_COLOR:
      return {
        color: action.payload,
      };
    default:
      return;
  }
};

const ColorModule = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  return { state, dispatch };
};

export default ColorModule;

```