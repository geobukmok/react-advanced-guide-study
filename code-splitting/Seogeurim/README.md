# 코드 분할 (Code-Splitting)

## 코드 분할과 번들링

### 번들링이란?

> Webpack, Rollup, Browserify

번들링이란, 쉽게 말해서 여러 개로 나뉘어져 있는 파일들을 하나의 파일로 만들어주는 것이다.

하나의 웹 페이지는 html, css, js 파일, 이미지, 웹 폰트, json 데이터 등 정말 많은 파일들이 모여 구성이 된다. 특히 자바스크립트가 발전하면서 모듈 시스템이 나오게 되었고, js 파일도 모듈이라는 개념이 생겼으며 import/require로 js 파일끼리의 의존 관계도 생겼다. 번들링이란 이러한 모듈과 여러 파일들로 흩어져 있는 코드들을 하나로 합쳐주는 일을 말한다.

번들링을 통해 http 요청 수를 줄일 수 있다.

### 코드 분할

하지만 앱의 규모가 커진다면? 번들도 커지게 된다. 앱의 규모에 따라 번들이 거대해지면 앱의 초기 로딩 속도에 악영향을 주게 될 것이다.

번들이 거대해지는 것을 막기 위한 방법은 **번들을 '나누는(splitting)' 것**이다. **'코드 분할'이란 런타임에 동적으로 로드될 수 있는 여러 번들을 만들어내는 것**으로, Webpack, Rollup, Browserify와 같은 번들러가 지원하는 기능이다.

코드 분할을 통해 규모가 큰 앱을 지연 로딩(lazy-load)할 수 있고, 이는 성능 향상 및 초기 로딩 비용의 감소로 이어진다.

## 동적 `import()` 문법

동적 `import()` 문법을 사용하면 코드 분할을 할 수 있다. Webpack이 이 구문을 만나게 되면 앱의 코드를 분할한다.

```js
import('./math').then((math) => {
  console.log(math.add(16, 26));
});
```

CRA(Create React App)은 이미 구성되어 있으므로 다음과 같이 사용할 수 있다. 아래 코드의 경우, `moduleA`를 포함한 번들은 사용자가 Load 버튼을 눌렀을 때 로드된다.

```js
import React, { Component } from 'react';

class App extends Component {
  handleClick = () => {
    import('./moduleA')
      .then(({ moduleA }) => {
        // Use moduleA
      })
      .catch((err) => {
        // Handle failure
      });
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Load</button>
      </div>
    );
  }
}

export default App;
```

### Webpack & Babel 설정

- [Webpack Code-Splitting](https://webpack.js.org/guides/code-splitting/)
- [babel-plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import) : Allow parsing of `import()`

```js
// webpack.config.js
module.exports = {
  entry: {
    main: './src/app.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js', // for code-split bundles
    path: './dist',
    publicPath: 'dist/',
  },
};
```

## React.lazy

`React.lazy` 함수를 통해 동적 import를 사용해 컴포넌트를 렌더링 할 수 있다.

- `React.lazy`는 동적 import()를 호출하는 함수를 인자로 가지며, 이 함수는 `default export`를 가진 모듈을 Promise로 반환해야 한다.
- lazy 컴포넌트는 `Suspense` 컴포넌트 하위에서 렌더링되어야 한다.
- `Suspense` 컴포넌트는 `fallback` prop을 통해 lazy 컴포넌트가 로드되는 동안 예비 컨텐츠를 보여준다.

아래와 같이 코드를 작성하면,

- `MyComponent`가 처음 렌더링될 때 `OtherComponent`를 포함한 번들을 불러오게 된다.
- `OtherComponent`를 불러오는 동안 `Loading...`을 표시한다.

```js
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

### Error boundaries

다른 모듈 로드에 실패할 경우 Error Boundary를 만들고 lazy 컴포넌트를 감싸면 에러를 표시할 수 있다.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

_`Error boundaries`에 대한 자세한 내용은 다음 스터디에서 다뤄보자!_

---

#### 211021 스터디 정리

- [loadable](https://github.com/gregberge/loadable-components)이 더욱 유연하다고 한다. 나중에 한 번 살펴보면 좋을듯 !!
- 18 major version 부터 React.lazy를 서버 사이드 렌더링에서도 사용 가능해질 것이라고 !! (지금은 안 됨, loadable은 가능)
