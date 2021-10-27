import MyPage from "./MyPage";
import { createStore } from "redux";
import { Provider } from "react-redux";

import rootReducer from "./store";

const store = createStore(rootReducer);

function App() {
  return (
    <Provider store={store}>
      <MyPage />
    </Provider>
  );
}

export default App;
