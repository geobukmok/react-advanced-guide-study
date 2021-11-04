# Optimizing Performance



내부적으로 리액트는 몇가지 똑똑한 기술을 쓴다. 그 기술은 UI를 업데이트 하는 비싼 DOM 연산들의 수를 최소화 하는 것이다. 많은 앱에서, 리액트를 사용하며 성능 최적화에 대해 많은 것들을 하지 않아도 빠른 UI를 사용할 수 있다. 그럼에도 불구하고 리액트 앱을 더 빠르게 할 수 있는 몇가지 방법이 있다.



### Production Build를 사용하세요

만약 리액트 앱 내에서 성능 문제를 경험할 경우, 미니 production build로 테스팅해야 한다.

기본적으로 리액트는 개발 단계를 위해 많은 warning이 있지만, 이것들은 앱이 비대해지게 만들고 느려지게 만든다. 따라서 앱을 배포할땐 production build를 사용해야 한다.

만약 빌드 버전인지 확신이 들지 않을 경우, [React Developer Tools for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)을 사용해보자. 

production을 하려면 다음과 같은 과정을 거치면 된다.



**Create React App**

* cra를 사용한다면 `npm run build` 를 사용해보자. 이 스크립트는 build/ folder에 빌드된 JS를 만들어 줄 것이다.



**Single-File Builds**

* `production.min.js`로 끝나는 리액트 파일이 production에 적합하다.



**webpack**

* Webpack v4+는 기본적으로 production 모드에서 코드를 minify 할 것이다.

* ```jsx
  const TerserPlugin = require('terser-webpack-plugin');
  
  module.exports = {
    mode: 'production',
    optimization: {
      minimizer: [new TerserPlugin({ /* additional options here */ })],
    },
  };
  ```

* 꼭 기억해야 할건, 이건 단지 production build일 때 사용하는 것이고, `TesterPlugin`을 개발 모드일 때 적용할 필요는 없다는 것이다. 왜냐면 이건 React warning을 많이 가릴 것이고, 빌드를 느리게 만들 것이기 때문이다.



---



### DevTools Profiler로 Component Profiling 하기

리액트는 DEV 모드에서 profiling 기능을 제공해준다. Profiler는 다음주에... https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html



---



### Virtualize Long Lists

만약에 앱이 매우 긴 데이터 리스트를 render 해야 한다면, `windowing` 이란 기술을 사용해보는 것을 추천한다.

이 기술은 긴 데이터 row 중 작은 일부분만 렌더하는 기술로, 생성된 DOM 노드와 컴포넌트 렌더링 시간을 크게 중일 수 있다.

<video src="/Users/jonghopark/Desktop/windowing.mov"></video>



react-window나 react-virtualized는 유명한 window 라이브러리다. 이 패키지들은 list, grid, tabular 데이터를 보여줄 수 있는 재사용가능한 컴포넌트를 제공한다. 

물론 우리만의 windowing component를 만들수도 있다. (Twitter가 그랬음) 만약 원한다면 좀더 앱에 특화된 케이스로 수정할 수도 있다.



---



### Reconcilation 피하기

리액트는 렌더링된 UI의 내부 representation을 빌드, 유지한다. 이는 component로부터 반환된 React element도 포함한다.

이 representation은 리액트가 DOM node를 생성하지 않고, 필요 이상으로 기존 노드에 access 하지 않게 한다. 이는 JS obejct에 대한 작업보다 느릴 수가 있기 때문이다.

이는 virtual DOM이라고도 불리기는 하지만, React Native 에서도 같은 방식으로 동작한다.



Component props나 state 가 바뀌면, React는 이전에 렌더링 된것과 새롭게 반환된 element를 비교하여 실제 DOM 업데이트가 필요한지 아닌지 결정한다. 만약 동일하지 않다면, DOM을 업데이트한다.



비록 리액트가 단순히 DOM 노드만을 변경하지만, re-rendering은 시간이 약간 걸린다. 대부분의 경우 이는 크게 문제가 되지 않지만, slowdown은 충분히 주목할만하다. 

우리는 re render 과정이 시작되기 이전에 동작하는 `shouldComponentUpdate` 메소드를 overriding 하며 속도를 빠르게 올릴 수 있다. 

```jsx
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```



만약 우리가 component가 업데이트 될 필요가 없는 특정 상황들을 알고 있다면 이 메서드 내에 false를 반환하면 된다. 

false는 render() 호출을 하는 컴포넌트, 그 자손 컴포넌트를 렌더링 하는 과정을 스킵하게 될 것이다.



대부분의 경우, shouldComponentUpdate를 작성하는 것 대신에 React.PureComponent를 상속받을 수 있다.

이는 얕은 비교를 하기 때문에, 같은 state, props이면 update를 하지 않을 것이다. 

즉, 이는 shouldComponentUpdate를 shallow comparison 하는 것과 동일하다.



---



### shouldComponentUpdate In Action



다음 컴포넌트 subTree를 보자.

![스크린샷 2021-11-04 오후 12.13.42](/Users/jonghopark/Library/Application Support/typora-user-images/스크린샷 2021-11-04 오후 12.13.42.png)



C2에서 SCU가 false를 반환하므로, 리액트는 C2를 render 할 시도를 하지 않을 것이다. 그러므로, C4, C5에 shouldComponentUpdate가 일어나지 않는다.



C1, C3에서 shouldComponentUpdate가 true를 반환하였고, 따라서 React는 leaf를 내려가 체크를 해야한다.

C6 shouldComponentUpdate가 true를 반환하였고, 이는 렌더링 요소가 동일하지 않으므로 리액트는 DOM 업데이트를 해야한다.



C8이 특이한 케이스인데, 리액트는 shouldComponentUpdate가 true이므로 해당 컴포넌트를 render 해야하지만 이전 렌더 요소와 동일하기 때문에 업데이트를 하지 않을 것이다.



즉, C6은 무조건 다시 DOM을 변환해야 하고, C8은 virtualDOM 이 같으므로 제거되고, C7은 shouldComponentUpdate가 false이기 때문에 render가 호출되지 않는다.



---



### shouleComponentUpdate 예시



다음 코드를 보자



```jsx
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```



해당 코드에서 shouldComponentUpdate는 props.color, state.count 가 바뀔 때만 변화를 체크한다.

만약 컴포넌트가 좀 더 복잡해진다면, 얕은 비교를 모든 props, state와 비교하여 위와 같이 구현할 수 있다. 

이 패턴은 매우 일반적이므로, 이를 도와줄 helper를 react가 제공한다. React.PureComponent를 쓰면 된다!! 따라서 위의 로직이 다음과 같이 변한다.

```jsx
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```



대부분의 경우 shouldComponentUpdate 보단 React.PureComponent를 사용하는 것이 좋다. 만약 얕은 비교가 props, state의 변화를 놓치는 경우라면, 이는 사용하지 않는게 좋다.



```jsx
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



위 코드에서 LIstOfWords 컴포넌트는 얕은 비교를 수행하고 있는데, this.state.words 의 값이 변하지만 얕은 비교는 attribute가 아닌 refrence를 비교하므로, 변하지 않는다.



---



### The Power Of Not Mutating Data



위와 같은 경우를 방지하기 위해선 reference는 가만히 놔두고, 값을 변화시켜야 한다.

예를 들면 concat이나, spread 연산자를 사용하는 것이다.

```jsx
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```



즉, 불변성을 지키는 방식으로 객체를 업데이트해야 한다.