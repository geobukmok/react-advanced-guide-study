import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import FancyButton from "./FancyButton";

const ABC = () => {
  return <div></div>;
};

const App = () => {
  const btn = useRef<HTMLButtonElement | null>(null);

  return <FancyButton ref={btn}>Click me!</FancyButton>;
};

ReactDOM.render(<App />, document.getElementById("app"));
