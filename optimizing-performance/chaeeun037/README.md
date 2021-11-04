# REACT OPTIMIZING PERFORMANCE

### Why?

빠른 사용자 인터페이스를 위해서 개발자가 고려해야 하는 작업이 많은데, react는 UI를 업데이트하기 위해 비용이 많이 드는 DOM 작업의 수를 최소화하는 기술이 적용되어있으므로 많은 작업을 하지 않아도 된다.

그럼에도 불구하고 이미 적용된 기법을 제외하고 react 애플리케이션의 속도를 높일 수 있는 몇가지 방법을 소개한다.



## Production 빌드 활용

기본적으로 React에는 경고들이 많이 포함되어있다. 개발할 때는 유용하지만, React를 크고 느리게 만들기 때문에 앱을 배포할 때는 프로덕트 버전을 사용해야 한다.

[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)를 사용하면 프로덕트 버전인지 쉽게 확인할 수 있다. 

다음은 여러가지 프로덕션 용도의 앱을 만드는 방법이다. React의 유용한 경고들을 숨기고, 빌드를 느리게 만들기 때문에 개발 중에 설정하지 않도록 주의하도록 한다. 

### Create React App

```shell
npm run build
```

`build/`폴더에 프로덕션 빌드 파일이 만들어진다.

### 단일 파일 빌드

```react
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

`.production.min.js`로 끝나는 React 파일만이 프로덕션 환경에 적합하다.

### Brunch

`tester-brunch`를 설치한다.

```shell
# npm을 사용한다면
npm install --save-dev terser-brunch

# Yarn을 사용한다면
yarn add --dev terser-brunch
```

```shell
brunch build -p
```

### Browserify

`envify`, `terser`, `uglifyify`를 순서대로 설치한다.

```shell
# npm을 사용하는 경우
npm install --save-dev envify terser uglifyify

# Yarn을 사용하는 경우
yarn add --dev envify terser uglifyify
```

- `envify`변환은 올바른 빌드 환경이 설정되도록 한하고 전역 (`-g`)으로 변환시킨다.
- `uglifyify`변환은 개발에서만 사용하는 package를 제거하고 전역(`-g`)으로 변환시킨다.
- 최종 bundle은 mangling을 위해 `terser`로 연결된다. [참고](https://github.com/hughsk/uglifyify#motivationusage)

###### (mangling? 컴파일러가 식별할 수 있도록 함수의 이름을 변경하는 것)

### Rollup

`replace`, `commonjs`, `terser`을 순서대로 설치한다.

```shell
# npm을 사용하는 경우
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# Yarn을 사용하는 경우
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

- `replace`는 올바른 빌드 환경이 설정되도록 해준다.
- `commonjs`는 CommonJS를 지원하도록 해준다.
- `terser`는 최종 bundle을 압축하고 mangle 해준다.

### webpack

```react
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```



## DevTools Profiler

> 컴포넌트 프로파일링 도구를 사용해서 React 성능을 측정할 수 있다.
>
> [참고](https://medium.com/wantedjobs/react-profiler%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%EC%84%B1%EB%8A%A5-%EC%B8%A1%EC%A0%95%ED%95%98%EA%B8%B0-5981dfb3d934): 컴포넌트 분리와 `React.memo`를 이용한 성능 최적화

`react-dom` 16.5+와 `react-native` 0.57+는 React DevTools Profiler를 사용하여 개발 모드에서 향상된 프로파일링이 가능하다.



## Long Lists 가상화

긴 List를 렌더링하는 경우 **windowing**이라는 기법을 사용하는 것이 좋다.

### windowing

> [참고](https://youtu.be/QhPn6hLGljU?t=52)

주어진 시간에 목록의 일부분만 렌더링해서 컴포넌트를 다시 렌더링하는데 걸리는 시간과 생성된 DOM 노드의 수를 크게 줄일 수 있다.

React에서 주로 사용하는 windowing 라이브러리로는 `react-window`와 `react-virtualized`가 있다. 목록, 그리드, 표 형식의 데이터를 표시하기 위해서 재사용 가능한 컴포넌트들을 제공한다.



## Reconciliation 피하기

컴포넌트의 prop이나 state가 변경되면 React는 새로 반환된 엘리먼트를 이전에 렌더링된 엘리먼트와 비교해서 같지 않을 때 실제 DOM을 업데이트한다.

리렌더링이 너무 오래걸릴 때 몇몇 상황에서 컴포넌트를 업데이트 할 필요가 없다는 것을 알고있다면 렌더링 전에 실행되는 생명주기 함수 `shouldComponentUpdate`를 무시함으로써 해결할 수 있다.

**[예시] shouldComponentUpdate**

```react
import React from 'react'

class CustomComponent extends React.Component {

  state = {}

  constructor() {
    super()
    this.state = {
      id: 1,
      name: 'Kim Chaeeun',
      birthday: {
        year: 1995,
        month: 3,
        day: 7,
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 나는 생일 object 가 달라졌을때만 re-render를 할꺼야
    if (this.nextState.birthday == this.state.birthday) {
      return false
    } else {
      return true
    }
  }

  render() {
    return (
      <div>
        <div>아이디: {this.state.id}</div>
        <div>이름: {this.state.name}</div>
        <div>
          생년월일: {this.state.birthday.year}
          -{this.state.birthday.month}
          -{this.state.birthday.day}
        </div>
      </div>
    )
  }
}
```



## shouldComponentUpdate 동작

> 가지치기하는 원리이다.

`SCU`는 `shouldComponentUpdate`가 반환한 것을 나타내고, `vDOMEq`는 React 엘리먼트가 동일한지 여부를 표시하고, 원의 색은 컴포넌트를 조정해야 하는지 여부를 나타낸다.

<img src="https://ko.reactjs.org/static/5ee1bdf4779af06072a17b7a0654f6db/cd039/should-component-update.png" width="600">





## React.PureComponent

`PureComponent`는 `this.props.words`의 이전 값과 새로운 값을 간단하게 비교한다. 얕게 탐색함으로써 성능을 최적화할 수 있지만 정상적으로 동작하지 않을 수 있다.

**[예시]**

```react
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

이 코드는 `WordAdder`의 `handleClick`메서드에서 `words`배열을 변경시키기 때문에 배열의 실제 단어가 변경되었다 하더라도 `this.props.words`의 이전 값과 새로운 값은 동일하게 비교된다.

따라서 `ListOfWords`는 렌더링 되어야 하는 새로운 단어가 있어도 업데이트되지 않는다.



## 데이터를 Mutating하지 않음으로써 얻는 효과

위와 같이 데이터의 값은 바뀌었는데 참조값이 바뀌지 않아서 리렌더링이 안되는 문제를 해결하는 가장 간단한 방법은 참조값을 바꾸는 것이다.

예를 들어 `handleClick`메서드는 `concat`, 객체는 `Object.assign`를 사용해서 새로운 객체를 반환하는 것을 말한다.
