import React, { useState, MouseEvent } from "react";
import ReactDOM from "react-dom";

type Position = { x: number; y: number };

interface MouseProps {
  render(pos: Position): React.ReactNode;
}
const Mouse: React.FC<MouseProps> = ({ render }) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const handleMouseMove = (event: MouseEvent) => {
    setPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };
  return (
    <div style={{ height: "100vh" }} onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Mouse
        render={(position) => (
          <div>
            {position.x}, {position.y}
          </div>
        )}
      ></Mouse>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
