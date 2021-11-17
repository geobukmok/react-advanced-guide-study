# Strict Mode



StrictMode는 앱 내에 잠재적으로 발생할수 있는 문제들을 대두되게 해주는 도구이다.

Fragment 처럼, StrictMode는 어떤 보여지는 UI를 렌더링하지 않는다. 

단지 자손 컴포넌트들에게 추가적인 경고, 체크들을 하게 된다.



```tsx
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```



StrictMode는 다음과 같은 기능을 하게 된다.



* ***불안전한 lifecylcle 함수를 사용하는 component 체크***
* ***legacy 한 string ref API를 사용하는 경우 경고***
* ***deprecate 된 findDOMNode를 사용하는 것에 대한 경고***
* ***예측하지 못한 side effect 찾아내기***
* ***legacy context API 찾아내기***





## 불안전한 lifecylcle 함수를 사용하는 component 체크



비동기 리액트 앱을 만드는 경우에, 특정 legacy lifecycle method를 사용하는 것은 문제가 될 수 있다.

물론 이를 사용하지 않으면 되지만, 만약 앱이 third party library 를 사용하면, 이 생명주기 함수들이 사용되지 않는 다는 것을 보장하기 어렵다.

Strict Mode를 사용하게 되면, 리액트는 unsafe lifecycle을 사용하는 클래스 컴포넌트를 보여주게 되고, 경고 메시지를 띄우게 된다.



![strict mode unsafe lifecycles warning](https://reactjs.org/static/e4fdbff774b356881123e69ad88eda88/1e088/strict-mode-unsafe-lifecycles-warning.png)





## string ref API를 하는 것에 대한 경고



리액트는 두 가지 방법으로 ref를 관리하는 법을 제시한다.



1. legacy string ref API
2. callback API



1번은 몇 가지 이슈들로 사용하지 않는 것이 권장된다. StrictMode는 이에 대한 경고를 내뱉는다.





## findDOMNode 사용에 대한 경고

이전에 ref로 DOM node를 지칭할 수 없었을 때, findDOMNode를 사용하곤 했다. 

findDOMNode는 오로지 클래스 컴포넌트에만 사용할 수 있다. 그러나, 이는 부모 컴포넌트가 특정 컴포넌트를 사용함으로써 추상화를 무너뜨리게 된다. . **대부분의 경우에서 DOM 노드에 ref를 붙일 수 있으며 `findDOMNode`를 사용할 필요가 전혀 없다.**





## 예측되지 않은 Side Effect 검토

리액트는 render => commit phase로 넘어가게 된다.

이 때, commit phase 는 대부분 빠르지만 rendering의 경우 느리다. 이러한 이유로 concurrent mode 에선 rendering 작업들을 쪼개어서, 멈추고 재시작하는 작업을 하곤 한다.

이는, 리액트가 하나의 커밋보다 더 많이 render phase 를 일으키게 된다는 것이고, 또는 아예 commit 을 안하게 될 수도 있다는 것이다.



클래스 컴포넌트에서의 Render Phase Lifecycle 함수들은 다음과 같다.

- `constructor`
- `componentWillMount` (or `UNSAFE_componentWillMount`)
- `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
- `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
- `getDerivedStateFromProps`
- `shouldComponentUpdate`
- `render`
- `setState` updater functions (the first argument)



이 메서드들이 한번 이상 호출될 때, side effect를 가져오지 않는 것이 중요하다. 이는 비결정적이므로, 이런 문제들을 사전에 찾기 어렵다.



Strict Mode는 이런 점들을 자동적으로 찾아주지는 않지만, 조금 더 결정적으로 만들어 줄 수 있다. 

Strict Mode는 다음과 같은 함수들을 두번 invoking 하는 방식으로 결정적이게 만들어준다.

- Class component `constructor`, `render`, and `shouldComponentUpdate` methods
- Class component static `getDerivedStateFromProps` method
- Function component bodies
- State updater functions (the first argument to `setState`)
- Functions 



## legacy Context API 찾기



legacy context API를 사용하게 되면 동작은 하지만, 경고 메시지를 띄우게 된다.

![warn legacy context in strict mode](https://reactjs.org/static/fca5c5e1fb2ef2e2d59afb100b432c12/1e088/warn-legacy-context-in-strict-mode.png)

