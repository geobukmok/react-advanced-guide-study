# Context

_context를 이용하면 단계마다 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있다._

## 언제 context를 써야 할까

유저 정보, 테마, 언어 등과 같이 **전역적(global) 데이터**를 공유해야 할 때 사용한다.

전역적인 데이터를 사용하기 위해서는 상위 컴포넌트에서 props를 통해 하위 컴포넌트로 계속 넘겨주어야 하는데, context를 사용하면 일일이 props를 넘겨주지 않아도 된다.

```js
// Theme context 생성
const ThemeContext = React.createContext('light');

// 최상위 컴포넌트
class App extends React.Component {
  render() {
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 중간 컴포넌트
// context를 사용하면 중간에서 theme 데이터 정보를 일일이 넘겨줄 필요가 없다.
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

// 하위 컴포넌트
class ThemedButton extends React.Component {
  // 현재 선택된 테마 값을 읽기 위해 contextType을 지정
  // React는 가장 가까이 있는 테마 Provider를 찾아 그 값(dark)을 사용
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

### context vs 컴포넌트 합성

- context를 사용하면 컴포넌트를 재사용하기 어려워지므로 꼭 필요할 때만 쓰는 것이 좋다.
- 여러 레벨에 걸쳐 props 넘기는 걸 대체하는 데에 context보다 컴포넌트 합성이 더 간단한 해결책일 수도 있다.

예를 들어,

```js
<Page user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

위와 같이 구성된 컴포넌트를

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// 이제 이렇게 쓸 수 있습니다.
<Page user={user} avatarSize={avatarSize} />
// ... 그 아래에 ...
<PageLayout userLink={...} />
// ... 그 아래에 ...
<NavigationBar userLink={...} />
// ... 그 아래에 ...
{props.userLink}
```

이렇게 바꾸면, `user`와 `avatarSize` props는 최상위 컴포넌트인 `Page` 컴포넌트만 알고 있으면 된다.

이것을 **제어의 역전(inversion of control)** 이라 볼 수 있으며, 넘겨줘야 하는 props의 수는 줄고 최상위 컴포넌트의 제어력은 커지기 때문에 더 깔끔한 코드를 쓸 수 있다.

그러나 복잡한 로직을 상위로 옮기면 상위 컴포넌트는 더 난해해지고 하위 컴포넌트들은 필요 이상으로 유연해질 수 있기 때문에 주의해서 사용해야 한다.

## API

- `React.createContext` : Context 객체를 만든다.

  ```js
  const MyContext = React.createContext(defaultValue);
  ```

- `Context.Provider` : Context 객체를 구독하고 있는 컴포넌트들에게 context의 변화를 알린다.

  ```js
  <MyContext.Provider value={/* 어떤 값 */}>
  ```

- `Class.contextType` : `React.createContext()`로 생성한 Context 객체를 원하는 클래스의 contextType 프로퍼티로 지정한다. 이 프로퍼티를 활용해 클래스 안에서 `this.context`를 이용해 해당 Context의 가장 가까운 Provider를 찾아 그 값을 읽을 수 있게 된다.
- `Context.Consumer` : context 변화를 구독하는 React 컴포넌트로, 이 컴포넌트를 사용하면 함수 컴포넌트 안에서 context를 구독할 수 있다.

  ```js
  <MyContext.Consumer>
    {value => /* context 값을 이용한 렌더링 */}
  </MyContext.Consumer>
  ```

- `Context.displayName` : Context 객체의 `displayName` 속성을 통해 React 개발자 도구에서 context를 어떻게 보여줄지 결정할 수 있다.

## 불필요한 리렌더링 줄이기

리렌더링 여부를 정할 때 참조(reference) 여부를 확인하기 때문에, **Provider의 부모가 렌더링될 때마다 불필요하게 하위 컴포넌트가 다시 렌더링되는 문제**가 생길 수도 있다.

예를 들어, 아래 코드를 확인해보자.

```js
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{ something: 'something' }}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

위 코드에서는 `value`가 바뀔 때마다 매번 새로운 객체가 생성된다. 그에 따라 Provider가 리렌더링되고 매번 그 하위에서 구독하고 있는 컴포넌트 모두가 리렌더링될 것이다.

이를 피하기 위해서는 값을 부모의 state로 끌어올리는 것이 좋다.

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: { something: 'something' },
    };
  }

  render() {
    return (
      <MyContext.Provider value={this.state.value}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

## Context vs Redux

나는 프로젝트 상태 관리에 Context API를 도입해서 사용해본 경험은 없고, Redux와 그 미들웨어인 redux-thunk/redux-saga를 사용한 경험이 있다. Context API는 이론만 살펴본 것이지만 한 번 비교해본다면 스스로의 결론은 이렇다.

- 관리할 전역 상태가 많지 않다면 Context API가 훨씬 간단할 것 같다. Redux는 부가적으로 작성해야할 코드가 많다.
- 상태 관리 외에 여러 부가적인 기능이 필요하다면 Redux가 좋을 것 같다. Redux는 미들웨어와 함께 사용하면 비동기 처리 로직 등을 분리할 수 있다. 그래서 훨씬 견고한 구조로 상태를 관리할 수 있을 것 같다.
