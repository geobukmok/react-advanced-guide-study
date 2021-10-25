import React from "react";

const ProblemComponent = () => {
  if (true) {
    throw Error("의도적인 에러");
  }
  return <div>문제있음.</div>;
};
export default ProblemComponent;
