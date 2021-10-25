# Forwarding Refs

> Ref forwarding은 자신의 children 컴포넌트로 ref를 전달하기 위한 기술이다. 대부분의 컴포넌트에서 필요한 기능은 아니지만, 재사용 가능한 컴포넌트 라이브러리들은 충분히 유용하게 사용할 수 있다.

# 흔한 사용 시나리오

## 1. DOM component에 ref 전달하기

만약, 우리 프로젝트에서 `<button>` 를 커스터마이징한 `<FancyButton>`을 사용한다고 생각해보죠.

일반적으로 ref를 사용할 필요는 없습니다. 다른 DOM에 의존성을 가지는 것은 좋지 않은 구조이기 때문이죠. 그러나 실제 `<button>`을 사용하는 것처럼 `<FancyButton>`을 매우 자주 사용하게 될 경우, ref로 접근해 focus, animation, selection 관리를 FancyButton에도 할 필요가 생기게 됩니다.

이 경우, ref를 다음과 같이 전달할 수 있습니다.

```js
export default function App() {
  const buttonRef = useRef();

  return (
    <div className="App">
      <FancyButton ref={buttonRef}>안녕안녕</FancyButton>
    </div>
  );
}

```

```js
import { forwardRef } from "react";

const FancyButton = (props, ref) => {
  return <button ref={ref}>{props.children}</button>;
};

export default forwardRef(FancyButton);
```

ref argument는 forwardRef로 컴포넌트를 감싸줘야지 생겨요. `key`처럼, `ref` 도 React에 의해 다르게 관리됩니다. 일반 funtion, class component는 ref argument를 가지지 않고, props로도 전달되지 않습니당.

```js
function forwardRef<T, P = {}>(render: ForwardRefRenderFunction<T, P>): ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>;
```

forwardRef는 다음과 같은 형식 구조를 가지고 있어요. ForwardRefRenderFunction 이라는 타입을 가지는 인자를 받는데요. 해당 인자는 props, ref를 받아, ReactElement를 반환해줍니다. 앞서 보았던 `forwardRef(FancyButton)`이 설명이 되는거죠!

```js
 interface ForwardRefRenderFunction<T, P = {}> {
    (props: PropsWithChildren<P>, ref: ForwardedRef<T>): ReactElement | null;
    displayName?: string;
    // explicit rejected with `never` required due to
    // https://github.com/microsoft/TypeScript/issues/36826
    /**
     * defaultProps are not supported on render functions
     */
    defaultProps?: never;
    /**
     * propTypes are not supported on render functions
     */
    propTypes?: never;
}

```


## 2. higher-order 컴포넌트에 ref forwarding 하기 

HOC를 사용해 구현하기 위해선 다음과 같이 해줘야 합니다.

```js
// HOC.js
import React, { forwardRef } from "react";

const HOC = (Component) =>
  forwardRef(({ ...props }, ref) => (
    <Component {...props} forwardedRef={ref} />
  ));

export default HOC;

```
```js
import HOC from "./HOC";

const FancyButton = (props) => {
  return <button ref={props.forwardedRef}>{props.children}</button>;
};

export default HOC(FancyButton);

```

## 3. 기타

forwardRef를 devTools에서 custom name을 사용하기 위해선, displayName 속성을 사용해주시면 됩니다.

[ReactForwardRef.js](https://github.com/facebook/react/blob/main/packages/react/src/ReactForwardRef.js)를 보시면, 다음과 같은 부분이 있습니다.

```js
...

  const elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
  if (__DEV__) {
    let ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function() {
        return ownName;
      },
      set: function(name) {
        ownName = name;

        // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.forwardRef((props, ref) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.
        if (!render.name && !render.displayName) {
          render.displayName = name;
        }
      },
    });
  }
  return elementType;
}
```

익명함수이거나 displayName이 없을 경우, `ForwardRef` 라는 이름으로 나오게 되고, myFunction 이라는 이름을 가지고 있으면 `ForwardRef(myFunction)` 이라는 이름으로 나오게 됩니다.

만약, `forwardRef.displayName = "testtest"` 라고 하면 `ForwardRef(testtest)` 라고 나옵니다.

