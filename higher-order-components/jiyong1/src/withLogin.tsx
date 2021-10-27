import { ComponentType } from "react";
import { useSelector } from "react-redux";
import { UserState } from "./store/auth";
import { RootState } from "./store";

function withLogin<P>(ChildComponent: ComponentType<P>) {
  return function Wrapper(props: Omit<P, "user">) {
    const { user } = useSelector<RootState, UserState>((state) => state.auth);
    if (user) {
      return <ChildComponent user={user} {...(props as P)} />;
    } else {
      return <p>please login</p>;
    }
  };
}

export default withLogin;
