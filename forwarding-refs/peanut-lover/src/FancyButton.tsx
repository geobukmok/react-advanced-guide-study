import React from "react";

const FancyButton = React.forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"]
>((props, ref) => {
  return (
    <button ref={ref} style={{ background: "tomato" }}>
      {props.children}
    </button>
  );
});

export default FancyButton;
