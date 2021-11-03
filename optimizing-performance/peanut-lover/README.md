# React Optimizing Performance

해당 내용은 리액트 공식 문서 - 고급안내서 읽기 스터디를 통해 정리한 내용입니다. 주관적인 견해나 외부 자료에 의해 추가된 내용은 볼드체로 추가해서 남기겠습니다.

우선 문서를 읽을 때 한국어로 해석된 문서를 읽게되면 다소 의미가 다르게 전달될 때가 있어서 이번 최적화관련 내용은 영문 문서를 토대로 읽고 정리해보겠습니다.

# 개인적인 견해

우선, 항상 최적화는 중요합니다. 면접을 할 때 대부분의 면접관인 시니어 엔지니어들은 기본적인 질문이 어느정도 되면 최적화에 대한 경험에 대해 물어봅니다. **만약 어플리케이션에 대한 구체적인 최적화 경험이 없다면 추상적인 답변만 늘어 놓을 것입니다.**

사실 실제 현업 경험이 없다면 최적화의 필요성을 느낄만큼 큰 사이즈의 어플리케이션을 만들 일이 없기 때문에 없는 것이 당연할 것입니다. 하지만 현업에 바로 투입될 때 어떤 문제들이 있을지 예상해보면 한번 기억해두면 좋을 내용들을 찾아서 정리했습니다.

# React Advanced guides - Optimizing Performance

이미 리액트 **내부적으로** UI를 업데이트하기 위해 필요한 DOM 관련 작업들의 수를 최소화하려고 하는 몇가지 기술들이 적용되어있습니다. (특히 Virtual DOM)

리액트를 사용하는 것만으로 성능을 최적화하기 위해 많은 작업없이 빠른 UI를 제공할 수 있습니다. 그럼에도 불구하고 **우리 리액트 앱의 속도를 높여줄 수 있는 몇가지 방법**들이 더 있습니다.

## Production Build 사용하기

만약 리액트 앱에서 성능 문제를 겪고 있다면, production build로 테스트하고 있는지 확인해야합니다.

기본적으로 리액트는 유용한 경고 메세지들을 많이 포함합니다. (예를 들어 hook은 조건적으로 쓸수없다는 경고와 같이)

이러한 메세지는 개발과정에서는 매우 유용합니다. 하지만 이러한 기능은 리액트를 더 크고 느리게 만듭니다. 그래서 우리는 배포단계에서는 production 버젼의 리액트 라이브러리를 사용하는 것을 확실히해야합니다.

우리가 리액트 pruduction react인지 쉽게 확인하는 방법은 Chrome의 React Developer Tools Extension을 설치해서 확인할 수 있습니다.

- CRA(Create React App) 을 사용해서 프로젝트를 구성했다면 보다 쉽게 이미 설정되어있는 `npm run build`를 이용하면 배포용 리액트 형태로 제공되게 됩니다.

- CDN에서 제공하는 single file build를 이용할 수도 있습니다.

  ```html
  <script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
  ```

### Brunch

문서에서는 Webpack이 아닌 Brunch라는 도구에 대해서도 설명하지만 거의 사용할 일이 없기 때문에 간단히 넘어가겠습니다. 간단한 빌드 스크립트 툴이라고 생각하면 편하실 것 같습니다.

### Browserify

Browserify 도 마찬가지로 번들러 도구입니다. 요샌 거의 웹팩위주의 개발환경이 표준같아서 따로 학습하지않고 필요할 때 다시보는 방향으로 공부를 진행해보겠습니다.

### Rollup

이하 동문.

### Webpack

Webpack 4 버젼 이상에서는 `proudction` 모드에 기본적으로 우리의 코드를 최소화 해줍니다. [관련 링크](https://webpack.js.org/plugins/terser-webpack-plugin/#getting-started)

그 이하버젼에서는 production 모드일 때 아래와 같은 plugin을 추가해줘야합니다.

```javascript
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        /* additional options here */
      }),
    ],
  },
};
```

문서에서 계속 언급되는 `terser` 라이브러리는 자바스크립트 파서이며 mangler/compressor 도구 입니다.(ES6 이상)

해당 내용은 웹팩 공식 문서에서 Mode 설정과 관련된 내용에 명시되어있습니다. [웹팩 Mode 설정](https://webpack.js.org/guides/production/#specify-the-mode)

> with `process.env.NODE_ENV` set to `'production'` they might drop or add significant portions of code to optimize how things run for your actual users.

> 실제 유저들을 위해 최적화를 위해 특정 코드를 추가하거나 제거합니다.

# DevTools Profiler를 이용해서 컴포넌트 Profiling 하기

`react-dom` 16.5+ 와 `react-native`0.57+ 는 개발 모드에서 profiling 기능을 강화해서 제공해줍니다. Profileer에 대한 개요는 [해당 글](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)에서 찾아볼 수 있습니다. **최근 리액트 네이티브를 공부하기 시작했는데 적용해볼만하겠네요.**

# Virtualize Long Lists

긴 리스트를 가상화해라? 무슨 뜻인지 모르니 내용을 살펴보겠습니다. 만약 어플리케이션이 많은 데이터를 나열한다면(백개 혹은 천개의 행), "windowing" 이라고 알려져있는 기술을 사용하는 것을 추천한다고 합니다.

해당 기술은 특정 시점에 전체 row 중 일부분만 랜더링합니다. 즉 보이는 부분만 렌더링하는거죠. 일종의 lazy-rendering 라고 볼 수 있겠네요. 이러한 기술은 컴포넌트를 리렌더링하는 시간을 극적으로 줄일 수 있습니다.

특히`react-window`와 `react-virtualized` 는 인기있는 windowing 라이브러리입니다. Lists, grid, 테이블형태 데이터를 보여주는 재사용 컴포넌트를 제공해줍니다. 물론 우리의 windowing component를 생성할 수 있습니다. (마치 트위터 같이)

### react-window 맛만 보자.

https://react-window.vercel.app/#/examples/list/fixed-size

```jsx
import { FixedSizeList as List } from "react-window";

const Row = ({ index, style }) => <div style={style}>Row {index}</div>;

const Example = () => (
  <List height={150} itemCount={1000} itemSize={35} width={300}>
    {Row}
  </List>
);
```

위와 같이 `List` 라는 컴포넌트가 windowing을 제공해주고 있는 듯합니다.

https://addyosmani.com/blog/react-window/

리액트 윈도우를 이용해서 여러 성능 측정을 하는 블로그입니다.

내부적인 동작 원리는 좀더알아봐야할 것 같습니다. 아마 사용자에게 보여지는 viewport를 통해 특정컴포넌트가 보여지는지 확인해서 처리하는 방식을 사용하지않을까 싶습니다.

Intersaction Observer와 같은 기술도 있으니 충분히 그럴 듯해보입니다.

# Reconcilation 피하기

이번 주제는 거의 리액트의 꽃이라고도 볼 수 있는 내용입니다.

우선 reconcilation은 조정이라는 의미인데 따로 챕터가 있습니다. 간단히 리액트에서 상태 변화에 따른 UI 변화를 reconcilation이라고 이해해도 괜찮을 것 같습니다.

### Reconcilation

해당 행위를 피해라?는 의미는 상태가 변할때마다 component트리에 속한 컴포넌트들이 모두 리렌더링이 발생한다면 성능에 문제가 발생하기 때문에 최적화가 필요하다는 의미인 것 같습니다.

### Virtual DOM을 이용해서 Reconcilation을 피한다.

> React builds and maintains an internal representation of the rendered UI. It includes the React elements you return from your components

리액트는 렌더링된 UI의 내부 표현을 빌드하고 유지한다. 우리의 컴포넌트들로부터 반환된 React Element들을 포함한다.

실제적으로 보여지는 DOM 객체 이외에 **또 다른 DOM**을 내부적으로 관리한다는 뜻으로 받아들이면 이해하기가 수월합니다. (가상 DOM을 의미합니다.)

이러한 가상 DOM은 React가 필요이상으로 DOM 노드를 만들거나 존재하는 DOM을 변경하는 것을 피하게 해줍니다.

> 이 내용은 리액트 네이티브도 동일하게 적용됩니다.

알고리즘의 메모이제이션의 원리를 이용하는 것과 유사합니다. 변경이 필요한 부분만 변경하는 방식이죠.

컴포넌트 props나 상태가 변할 때마다, 리액트는 이전에 렌더링됐던 DOM과 새로 생성된 element(VDOM)과 비교해서 업데이트를 할지 결정을 합니다. 같지 않다면 DOM 업데이트를 진행합니다.

### 변화되었지만 변화시키지 않겠다!

비록 리액트가 오직 변화된 DOM 노드만 업데이트 하더라도 리렌더링이 될 때까지 시간이 좀더 걸립니다. (비교작업 + 리렌더링)

대부분의 경우 문제가 안되지만 느려짐이 느껴지다면 `shouldComponentUpdate` 생명주기 함수를 오버라딩해서 속도를 올릴 수 있습니다. `shouldComponentUpdate`는 리렌더링 처리를 시작하기전에 발생합니다.

해당 method의 기본 동작은 true를 반환합니다.

만약 컴포넌트 업데이트가 필요없는 상황을 안다면, `shouldComponentUpdate`에서 false를 반환해서 전체 렌더링 절차를 생략할 수 있습니다. (해당 컴포넌트의 `render()`도 포함)

대부분의 경우, `shouldComponentUpdate()`를 직접 사용하기 보다는 `React.PureComponent`를 상속해서 사용할 수 있습니다.

함수형 컴포넌트를 작성하신다면`useMemo`와 `React.memo`를 사용해서 PureComponent와 동일한 역할로 처리할 수 있습니다.

리렌더링을 최소화하는 방식에는 위에서 말했듯이

- `shouldComponentUpdate`
- `React.PureComponent`
- `useMemo` + `React.memo`

위 3가지 정도로 정리할 수 있을 듯합니다.

# 데이터를 Mutating 하지 않아야한다.?

reconcilation 문제를 피하기 위한 가장 간단한 방법은 우리가 `state`나 `props`로 사용하고 있는 값의 수정을 피하는 것입니다.

리액트에 익숙한 분들이면 아시겠지만 값의 변화를 비교하는 방식은 **얕은 비교** 입니다.

그래서 복잡한 객체타입의 상태를 가지고 있다면 변화된 부분만 교체하는 것이 하위 컴포넌트들의 리렌더링을 최소화하는 방법이 될 것입니다.

```js
handleClick() {
	this.setState(state => ({
    words: state.words.concat(['markler'])
  }));
}
```

예를들어 위와같이 상태를 변경할 때 기존 값들에 `markler`이라는 단어를 추가만 해서 새로운 배열을 돌려주는 `concat` 함수를 이용할 수 있습니다.

보다 편하게 사용하기 위해서 ES6는 배열을 보다 쉽게 생성하기 위해 `spread` 문법을 제공합니다.

```js
handleClick() {
	this.setState(state => ({
    words: [...state.words, 'marklar']
  }))
}
```

### 지양해야할 방식 (data를 직접 mutate하는 방식)

흔히 함수형 프로그래밍을 하지않는 언어들에서 데이터를 직접 수정하는 방식을 간혹 많이 사용합니다. 하지만 리액트에서는 그렇게하면 가독성 저하나 불필요한 리렌더링을 발생시킬수있습니다. 아래처럼. 순수하지않는 함수를 작성해서는 안됩니다.

```js
function updateColorMap(colormap) {
  colormap.right = "blue";
}
```

기존 객체를 수정없이 작업하기 위해서 `Object.assign`를 사용하면 수정되는 부분만 수정 혹은 추가된 새로운 객체를 생성하게 됩니다.=

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, { right: "blue" });
}
```

`updateColorMap` 함수는 기존의 객체를 수정하기보다는 새로운 객체를 생성해냅니다. 배열의 spread 연산자와 같은 맥락으로 `Object spread`문도은 수정없이 객체들을 변경하기 쉽게 해줍니다.

```js
function updateColorMap(colorMap) {
  return { ...colormap, right: "blue" };
}
```

위 기능은 ES2018에 추가된 기능입니다. 문법을 사용하려면 바벨의 도움이 필요합니다.(CRA를 사용하면 기본적으로 사용가능합니다.)
