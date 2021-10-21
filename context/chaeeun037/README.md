# REACT CONTEXT API

### Why?

중간에 있는 엘리먼트들에게 일일이 props를 넘겨주지 않고도 컴포넌트 트리 전체에 데이터를 제공할 수 있다.



## 언제 사용해야 할까?

props drilling을 개선하기 위한 전역 데이터 공유에 사용한다.

ex) 유저 정보, 테마, 언어 등 전달할 때

실제로 React 다국어 프레임워크 react-i18next에서 context를 사용한다.

<img src="https://i.imgur.com/iyNKCIz.png" width="400px"/>



## 고려할 것

다양한 레벨에 네스팅된 많은 컴포넌트에 데이터를 전달하므로 컴포넌트를 재사용하기가 어려워진다.

이런 경우에는 여러 레벨에 걸쳐 props를 넘기는것 보다 컴포넌트 합성(children prop 사용하여 엘리먼트를 출력 그대로 전달)이 더 간단할 수 있다.

**[예제] props 전달**

```react
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

**[예제] 컴포넌트 합성**

```react
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

이러한 제어의 역전을 이용해서 props의 수가 줄고 최상위 컴포넌트의 제어력이 커져서 깔끔한 코드를 작성할 수 있다.

하지만 복잡한 로직을 상위로 올리는 경우에 컴포넌트가 난해해지고, 하위 컴포넌트들은 필요 이상으로 유연해져야한다.



## API

> [예제 코드 출처](https://velopert.com/3606)

### React.createContent

Context 객체를 만든다.

### Context.Provider

context를 구독하는 컴포넌트에게 context의 변화를 알리는 역할을 한다. Context에서 사용할 값을 설정할 때 사용한다.

```react
import React from 'react';
import LeftPane from './components/LeftPane';
import RightPane from './components/RightPane';
import { SampleProvider } from './contexts/sample';

const App = () => {
  return (
    <SampleProvider>
      <div className="panes">
        <LeftPane />
        <RightPane />
      </div>
    </SampleProvider>
  );
};

export default App;
```



### Class.contextType

생성한 Context 객체를 원하는 클래스의 contextType 프로퍼티로 지정할 수 있다. 가장 가까운 Provider를 찾아 읽을 수 있다.

하나의 context만 구독할 수 있다.

### Context.Consumer

context를 구독하여 설정한 값을 불러올 때 사용한다.

```react
import React from 'react';
import { SampleConsumer } from '../contexts/sample';

const Receives = () => {
  return (
    <SampleConsumer>
      {
        (sample) => (
          <div>
            현재 설정된 값: { sample.state.value }
          </div>
        )
      }
    </SampleConsumer>
  );
};

export default Receives;
```



### Context.displayName

개발자 도구에서 표현되는 문자열을 설정한다.



## 주의사항

다시 렌더링할지 여부를 정할 때 참조를 확인하기 때문에 Provider의 부모가 렌더링될 때마다 불필요하게 하위 컴포넌트가 다시 렌더링되는 문제가 생길 수 있다.

```react
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{something: 'something'}}>        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```

이를 피하기 위해서 부모의 state로 끌어올려아 한다.

```react
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},    };
  }

  render() {
    return (
      <MyContext.Provider value={this.state.value}>        <Toolbar />
      </MyContext.Provider>
    );
  }
}
```



## Redux와 비교

Context API와 Redux는 사용법과 그 구조에 조금 차이가 있을 뿐 전역 상태를 관리한다는 점에서는 유사하다. 애초에 Redux가 Context API를 기반으로 만들어진 것이기 때문이기도 하다.

단순 전역 상태 관리만 있어도 된다면 Context API, 디버깅이나 로깅 등의 상태 관리 외의 기능이나 미들웨어가 필요하다면 Redux를 사용하는 것이 좋다.

*high-frequency updates*한 어플리케이션의 경우 Context API를 사용하면 성능상 이슈가 있을 수 있다.
