# React Context 정리

리액트는 Component 간의 데이터 전달이 단방향입니다. 그리고 트리형태로, 계층적으로 나누어진 컴포넌트들간에 데이터를 전달하기 위해서는 중간에 끼어있는 컴포넌트를 모두 거쳐서 데이터를 전달해야합니다.

여기서 중간 계층의 컴포넌트가 너무 많으면 특정 컴포넌트에서 사용되지도 않는 불필요한 property들을 명시해줘야하는 단점이 있습니다. 이 문제는 **prop-drilling** 라고 불립니다.

Context API는 이러한 Property Drilling을 극복하기 위해서 React 16.x 버젼부터 지원하기 시작했습니다.

[리액트 고급 안내서 - Context 문서](https://ko.reactjs.org/docs/context.html)에서 사용법들은 충분히 있으니 저는 왜 써야하고 흔히 혼란에 빠지는 의문인

**"Context API 만 있으면 외부 의존성 라이브러리인 redux 나 다른 상태관리 라이브러리 안써도되지않나?"** 라는 질문에 대한 내용을 위주로 작성해보겠습니다.

- React Context API 를 왜 써야하는지?
- React Context 를 사용해서 상태관리하면 되지않나?
- React Context를 사용할 때 단점 혹은 주의 사항

# Context API의 목적

글 서두에 말했던 것 처럼 Context API **property drilling** 이라는 가독성과 생산성을 해치는 문제를 해결하기 위해서 저희는 Context API를 사용합니다.

여기서 중요한 것은 Context API 역할은 명확히 할 필요가 있습니다. **Component 간의 데이터 전달이라는 문제만 해결**합니다. 가끔 Context API와 Redux를 비교하는 실수를 하곤합니다. 단순한 통로를 만들어주는 용도로 사용된다고 생각하는 게 좋을 것 같습니다.

# Context API를 사용한 상태 관리

흔히, Context API를 이용해서 상태관리를 한다라는 말은 Context API와 useState, useReducer를 조합해서 리액트 자체 기능만으로 상태관리를 한다는 말을 의미합니다.

즉, Context API 자체로는 어떠한 상태도 관리해주지않습니다.

# Context API 성능 문제

리덕스와의 주요 차이는 성능 면에서 나타나게 됩니다. 리덕스에서는 **컴포넌트에서 글로벌 상태의 특정값을 의존**하게 될 때 **해당 값이 바뀔때에만 리렌더링**이 되도록 최적화가 되어있습니다.

따라서, 글로벌 상태 중 의존하지 않는 값이 바뀌게 될 때에는 컴포넌트에서 낭비 렌더링이 발생하지 않습니다.

반면 Context에는 이러한 성능 최적화가 이뤄지지 않습니다. 컴토넌트에서 만약 Context의 특정 값을 의존하는 경우, 해당 값 말고 다른 값이 변경 될 때에도 컴포넌트에서는 리렌더링이 발생하게 됩니다. 따라서 Context를 사용하게 될 때에는 **관심사 분리**가 굉장히 중요합니다. 서로 관련이 없는 상태라면 같은 Context에 있으면 안됩니다. Context를 따로 만들어주어야하죠.

추가적으로, Context에서 상태를 업데이트를 하는 상황에서도 성능적으로 고려해야 될 부분이 있습니다. Provider를 만들게 될 때, 상태와 상태를 업데이트하는 함수를 value에 넣는 상황이 발생하기도 합니다.

[RiDi - Redux, Context 관련 설명](https://ridicorp.com/story/how-to-use-redux-in-ridi/) 에서 가져온 예시 코드입니다.

```javascript
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  return useContext(UserContext);
}

function UserInfo() {
  const { user } = useUser();
  if (!user) return <div>사용자 정보가 없습니다.</div>;
  return <div>{user.username}</div>;
}

function Authenticate() {
  const { setUser } = useUser();
  const onClick = () => {
    setUser({ username: "velopert" });
  };
  return <button onClick={onClick}>사용자 인증</button>;
}

export default function App() {
  return (
    <UserProvider>
      <UserInfo />
      <Authenticate />
    </UserProvider>
  );
}
```

위와 같이 하나의 Context에 값과 값을 업데이트하는 함수를 value로 가지고 있을 경우, 불필요한 렌더링이 발생할 수 있습니다.

위 문제는 Context를 UserProvider내에 user, setUser를 위한 Context 를 따로 만들어 주면 쉽게 해결됩니다.

```javascript
import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);
const UserUpdateContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <UserContext.Provider value={user}>
      <UserUpdateContext.Provider value={setUser}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}

function useUser() {
  return useContext(UserContext);
}

function useUserUpdate() {
  return useContext(UserUpdateContext);
}

function UserInfo() {
  const user = useUser();
  if (!user) return <div>사용자 정보가 없습니다.</div>;
  return <div>{user.username}</div>;
}

function Authenticate() {
  const setUser = useUserUpdate();
  const onClick = () => {
    setUser({ username: "velopert" });
  };
  return <button onClick={onClick}>사용자 인증</button>;
}

export default function App() {
  return (
    <UserProvider>
      <UserInfo />
      <Authenticate />
    </UserProvider>
  );
}
```

만약 전역으로 관리해야할 상태가 많아진다면 위와 같이 불필요한 랜더링을 제거하기 위해 Context를 겹겹히 쌓아야될 수도 있습니다. 즉, 글로벌 상태가 다양해 지는 경우 Context 는 적합하지 않을 수 있다고 말할 수 있습니다.

정적인 데이터를 여러 Component를 거치고 전달하거나 아주 간단한 상태를 관리하고 싶을 경우, Context API 를 사용하는 것이 적절해 보입니다.

Styled-Component의 theme와같이 동적으로 변하지않는 상태나 로그인된 유저정보와같이 간단한 상태들이 Context API를 사용하기에 적절해보입니다.

하지만 상품 정보, ... 복잡한 글로벌 상태에는 부적절해보입니다. 이 경우, 리덕스 사용이 적절해보입니다.

# 정리

- Context API 는 Property Drilling 문제를 해결해준다.
- Context API + useState, userReducer를 이용해서 상태 관리를 할 경우, 복잡한 상태를 관리하기에는 무리가 있다.(성능을 최적화하기 위해 관심사별 Context를 많이 만들어야하기 때문)
