import { render, screen, testStore } from "./test-utils";
import withLogin from "./withLogin";
import { AnyAction } from "redux";
import MyPage from "./MyPage";

import authReducer, { login } from "./store/auth";

describe("redux auth", () => {
  it("default auth data", () => {
    expect(authReducer(undefined, {} as AnyAction)).toEqual({ user: null });
  });
  it("dispatch login", () => {
    expect(authReducer(undefined, login("jiyong"))).toEqual({
      user: { name: "jiyong" },
    });
  });
});

describe("login HOC", () => {
  const PageWithAuth = withLogin(MyPage);
  it("unlogin", () => {
    render(<PageWithAuth />);
    expect(screen.getByText(/please login/i)).toBeInTheDocument();
  });
  it("login", () => {
    render(<PageWithAuth />);
    testStore.dispatch(login("jiyong"));
    expect(screen.getByText(/jiyong/i)).toBeInTheDocument();
  });
});
