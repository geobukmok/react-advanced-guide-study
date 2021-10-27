// test-utils.jsx
import { FC, ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";

import rootReducer from "./store";

const testStore = configureStore({ reducer: rootReducer });
function render(
  ui: ReactElement,
  { store = testStore, ...renderOptions } = {}
) {
  const Wrapper: FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render, testStore };
