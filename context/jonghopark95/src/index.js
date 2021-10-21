import DivideProvider from "./DivideProvider";
import ModifyContextData from "./ModifyContextData";
// import App from "./App";
import ProviderConsumer from "./ProviderConsumer";
import React from "react";
import ReactDOM from "react-dom";
import UseContext from "./UseContext";

ReactDOM.render(
  <React.StrictMode>
    {/* <ProviderConsumer /> */}
    <DivideProvider />
  </React.StrictMode>,
  document.getElementById("root")
);
