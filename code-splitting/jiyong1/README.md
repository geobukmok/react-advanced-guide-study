# [React] 코드 분할

<br>

## 번들링

대부분의 React 앱은 `Webpack` 등과 같은 툴을 이용해서 하나의 **번들** 된 파일을 웹 페이지에 포함하여 한번에 로드할 수 있다.

`CRA`, `Next.js`, `Gatsby` 와 같은 툴을 사용한다면 해당 앱에서 `Webpack` 을 같이 설치했을 것이다.

<br>

## 코드 분할의 필요성

앱의 규모가 커질 수록 번들링된 파일의 크기도 커지게 된다. 이는 로드 시간이 길어지게 만들 것이다.

코드 분할은 앱을 **지연 로딩**하게 도와주고 성능을 향상 시켜준다. 앱의 코드 양을 줄이지 않고도 필요하지 않은 코드를 불러오지 않게 하여 초기화 로딩에 필요한 비용을 줄여준다.

<br>

## import()

> 코드 분할을 도입하는 좋은 방법 중 하나
>
> 동적으로 import하여 사용한다.

<br>

- before

  ```javascript
  import { add } from './math';
  
  console.log(add(1, 2));
  ```

- after

  ```javascript
  import("./math").then(math => {
    console.log(add(1, 2));
  })
  ```

<br>

`Webpack` 에서 위와 같은 동적인 import를 만나게 되면 앱의 코드를 분할한다.

`Babel` 을 사용할 때는 동적 import를 인식할 수 있지만 변환하지는 않도록 한다. 이를 위해 **babel-plugin-syntax-dynamic-import** 를 사용한다.

- install

  ```bash
  $ npm install babel-plugin-syntax-dynamic-import
  ```

- usage (`.babelrc`)

  ```json
  {
    "plugin": ["syntax-dynamic-import"]
  }
  ```

<br>

---

<br>

## React.lazy

> React.lazy와 Suspense는 아직 SSR을 할 수 없다.

<br>

- before

  ```javascript
  import OtherComponent from './OtherComponent';
  ```

- after

  ```javascript
  const OtherComponent = React.lazy(() => import('./OtherComponent'));
  ```

<br>

위의 구문이 실행된 컴포넌트가 렌더링 될 때  **OtherComponent를 포함한 번들을 자동으로 불러온다.**

`React.lazy` 는 `import()` 를 호출하는 함수를 인자로 가진다. 이 함수는 React 컴포넌트를 포함하여 export default를 가진 모듈로 결정되는 **Promise** 를 반환해야 한다.

lazy 컴포넌트는 `Suspense` 컴포넌트 하위에서 렌더링 되어야 한다. `Suspense`는 해당 컴포넌트가 로드되기 전까지 로딩 화면과 같은 컨텐츠를 미리 보여줄 수 있게 해준다.

<br>

```jsx
import React, { Suspense } from 'react';

import Loading from './Loading';
const FirstLazyComponent = React.lazy(() => import('./FirstComponent'));
const SecondLazyComponent = React.lazy(() => import ('./SecondComponent'));

function App() {
  return (
  	<div>
    	<Suspense fallback={<Loading />}>
        <section>
        	<FirstLazyComponent />
          <SecondLazyComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

- `fallback` prop을 통해 lazy하게 로딩되는 컴포넌트들이 로드될 때까지 보여줄 React Component를 전달한다.
- `Suspense` 컴포넌트로 여러 lazy 컴포넌트를 감쌀 수 있다.

<br>

<br>

## Error Boundaries

동적으로 import하기 때문에 네트워크 상의 문제 등으로 인해 로드를 실패할 경우 에러가 발생하게 된다. 이때 `Error Boundaries`를 이용하여 사용자의 경험을 개선하고, 복구 관리를 처리한다.

<br>

```jsx
import MyErrorBoundary from './MyErrorBoundary';

function App() {
  return (
  	<div>
      <MyErrorBoundary>
        <Suspense fallback={<Loading />}>
          <section>
            <FirstLazyComponent />
            <SecondLazyComponent />
          </section>
        </Suspense>
      </MyErrorBoundary>
    </div>
  );
}
```

<br>

<br>

## Loadable Component Library

위에서 언급한 `React.lazy` 는 코드 분할의 좋은 방법이기는 하지만 **SSR을 사용해야 하는 상황**이거나 일부 다른 상황에서 한계가 있다. 그럴때는 [Loadable Components](https://github.com/gregberge/loadable-components)가 좋은 대안이 된다.

사용법을 간단히 확인해보니 단순한 것 같다. 그리고 props를 전달받아서 상황에 맞는 컴포넌트를 lazy 하게 렌더링 할 수 있는 것 같다 ! 🤭

React 공식문서에서도, Loadable Component에서도 둘 다 좋은 방법이라고 한다. 하지만 문서를 좀 읽어보니 Loadable Component가 **한계가 더 없어 보이며 중복되는 코드를 줄일 수 있어** 좋은 것 같다. ~~물론 매우 개인적인 생각이다~~

<br>

```jsx
import loadable from '@loadable/component';

const LazyComponent = loadable(props => import(`./${props.page}`));

function App() {
  return (
    <div>
      <LazyComponent page="Home" />
      <LazyComponent page="About" />
    </div>
  )
}
```

<br>

---

<br>

## Route-based code splitting

**코드 분할을 어느 곳에 도입할지 결정하는 것**은 까다로운 일이다. 사용자의 경험을 개선시키기 위해 번들을 균등하게 분배 할 곳을 찾고자 할 때, 이를 시작하기 좋은 곳은 **Route**이다.

다음은 `React-Router` 라이브러리를 사용해서 코드 분할을 설정한 예시이다.

<br>

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './Loading';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

function App() {
  return (
  	<Router>
    	<Suspense fallback={<Loading />}>
      	<Switch>
        	<Route exact path="/" component={Home}/>
          <Route path="/about" component={About}/>
        </Switch>
      </Suspense>
    </Router>
  )
}
```

