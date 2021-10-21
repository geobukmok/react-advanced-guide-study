# REACT CODE SPLITTING

### Why?

번들이 커져서 로드 시간이 길어지는 것을 방지하기 위해서 번들을 나누어 지연 로딩을 통해 초기 로딩 성능을 향상시킨다.



## import()

Webpack이 이 구문을 만나면 앱의 코드를 분할한다. Promise를 반환한다.

```react
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```



## React.lazy

> 컴포넌트를 렌더링하는 시점에서 비동기적으로 로딩할 수 있게 해 주는 유틸 함수이다.

동적 import를 사용해서 컴포넌트를 렌더링 할 수 있다.

```react
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

로딩 화면, 스켈레톤 등의 컨텐츠를 보여줄 수 있다.

```react
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```



### [Suspense](https://ko.reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly)

리액트 내장 컴포넌트로 코드 스플리팅 된 컴포넌트를 로딩하도록 발동시킬 수 있고, 로딩이 끝나지 않았을 때 보여줄 UI를 설정해 줄 수 있다. fallback 이라는 props를 통해 로딩 중에 보여줄 JSX 문법을 지정할 수 있다.



### 참고

React.lazy를 쓰지 않고 리액트에서 코드 스플리팅을 해야 한다면(16.6버전 이전) 분리할 컴포넌트를 state에 선언하여 해당 모듈을 불러와야 할 때 state를 바꾸어 주는 식으로 진행함으로써 조금 번거롭고 귀찮은 작업이다.



## Dynamic loading

### Route-based code splitting

> 각 react-router 마다 React.lazy를 사용해서 dynamic loading을 설정해준다.

Splitting을 할 곳을 가장 찾기 쉬운 방법이다. 각 라우트가 다른 컴포넌트로 관리를 하고 있는 경우, 각 라우트를 import 함수를 통해 분리된 빌드 파일로 관리 할 수 있다. 유저가 다른 페이지로 넘어갈 때만 그 페이지를 비동기로 로딩한다.

```react
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/about" component={About}/>
      </Switch>
    </Suspense>
  </Router>
);
```



### Component level

> 유저의 input으로 인해 나타나는 컴포넌트

페이지가 처음으로 Load되었을 때, 그 페이지 안에 있지만 보이지 않는 컴포넌트가 존재할 수 있다. 이를 dynamic loading으로 처리해주면 필요한 경우에 불러오게 되어 초기 Load 속도를 높일 수 있다.

 

### page splitting

페이지 하나가 긴 경우, 그 페이지에 들어갈 때 당장 보이는 부분을 나머지와 분리하고 그 뒷 부분을 다른 컴포넌트로 만들어 스플리팅 할 수 있다.
