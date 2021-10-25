import React from "react";
import ReactDOM from "react-dom";
import ErrorBoundary from "./ErrorBoundary";
import ProblemComponent from "./ProblemComponent";

const App = () => {
  return (
    <ErrorBoundary>
      <h1>Hello world</h1>
      <ProblemComponent></ProblemComponent>
    </ErrorBoundary>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
