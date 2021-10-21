import React, { useContext, useState } from "react";

type User = {
  username: string;
};

type UserContextType = User | null;

type UserUpdateContextType = ((c: User | null) => void) | null;

const UserContext = React.createContext<UserContextType>(null);
const UserUpdateContext = React.createContext<UserUpdateContextType>(null);

const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={setUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
};

const useUser = (): UserContextType => {
  return useContext(UserContext);
};

const useUserUpdate = (): UserUpdateContextType => {
  return useContext(UserUpdateContext);
};

const UserInfo = () => {
  console.log("UserInfo Rerendering.");

  const user = useUser();
  return <div>{user?.username}</div>;
};

const Authenticate = () => {
  console.log("Authenticate Rerendering.");
  const setUser = useUserUpdate();
  const onClick = () => {
    setUser?.({ username: "JIHO" });
  };
  return <button onClick={onClick}>사용자 인증</button>;
};

function App() {
  return (
    <UserProvider>
      <UserInfo />
      <Authenticate />
    </UserProvider>
  );
}

export default App;
