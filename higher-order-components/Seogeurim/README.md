# 고차 컴포넌트 (HOC, Higher Order Component)

고차 컴포넌트란, **원래의 컴포넌트를 렌더링하면서 추가적인 기능을 포함시키도록 하는 함수**이다. **코드 재사용**, **추상화**와 관련이 있다.

## 고차 컴포넌트에 앞서... 고차 함수란?

리액트에서 고차 컴포넌트는 고차 함수의 개념이 반영된 것이라고 할 수 있다. 따라서 고차 함수가 무엇인지에 대해 먼저 짚고 넘어가보자.

자바스크립트에서 함수는 일급 객체이다. 그래서 가능한 개념이 고차 함수이다. 고차 함수란 아래의 조건들 중 한 가지 이상을 만족하는 함수를 말한다.

- 함수의 인수로 함수를 넣을 수 있다.
- 함수는 함수를 반환할 수 있다.

아, 이게 고차 함수구나. 그럼 고차 함수는 어떻게 쓰일까?

> 참고: 책 [모던자바스크립트 입문]

```js
/* 수열을 표시하는 프로그램 */
let digits = '';
for (var i = 0; i < 10; i++) {
  digits += i;
}
console.log(digits); // 0123456789

/* 무작위 알파벳을 표시하는 프로그램 */
let randomChars = '';
for (var i = 0; i < 8; i++) {
  randomChars += String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0));
}
console.log(randomChars);
```

위 두 프로그램을 살펴보면 하는 일은 다르지만 사용하는 로직이 같다. 핵심 관심사는 수열, 무작위 알파벳에 대한 것으로 각각 다르지만, 관심사에 해당하는 문자를 모아 문자열로 도출하는 부분, 즉 **횡단 관심사**가 같다고 볼 수 있다. 그럼 '문자를 모아 문자열로 도출하는 부분'을 **추상화**하여 표현한다면 프로그램의 가독성과 유지보수성을 향상시킬 수 있다. 다음과 같이 말이다!

```js
// 고차 함수 joinStrings를 활용해 횡단 관심사 추상화
function joinStrings(n, f) {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += f(i);
  }
  return s;
}

let digits = joinStrings(10, function (i) {
  return i;
});
let randomChars = joinStrings(8, function (i) {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 'a'.charCodeAt(0));
});
console.log(digits); // 0123456789
console.log(randomChars); // mzobequt
```

## 횡단 관심사(Cross-Cutting Concerns)에 고차 컴포넌트 사용하기

고차 컴포넌트는 앞서 설명한 고차 함수의 개념을 컴포넌트에 반영했다고 생각할 수 있다. 그럼 React 컴포넌트 예시를 살펴보며 이해해보자.

- 외부로부터 데이터를 구독하여 댓글 목록을 렌더링하는 `CommentList` 컴포넌트
- 블로그 포스트를 구독하기 위한 `BlogPost` 컴포넌트
- `DataSource`는 글로벌 데이터 소스

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      comments: DataSource.getComments(),
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      comments: DataSource.getComments(),
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id),
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id),
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

위 코드를 살펴보면, 각 컴포넌트는 핵심 관심사가 매우 다르지만 동일한 횡단 관심사를 가지고 있다는 것을 볼 수 있다.

- `componentDidMount` : `DataSource`에 change 리스너 추가
- `handleChange` : `setState` 호출
- `componentWillUnmount` : `DataSource`에 change 리스너 제거

위 횡단 관심사는 고차 컴포넌트를 사용해 추상화할 수 있다. 고차 컴포넌트는 컴포넌트를 매개변수로 받아 새로운 컴포넌트를 반환하는 함수이다. 고차 컴포넌트 `withSubscription` 코드를 살펴보자.

```js
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props),
      };
    }

    componentDidMount() {
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props),
      });
    }

    render() {
      // 래핑된 컴포넌트는 새로운 props, data와 함께 컨테이너의 모든 props를 전달받는다.
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

```js
const CommentListWithSubscription = withSubscription(CommentList, (DataSource) =>
  DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(BlogPost, (DataSource, props) =>
  DataSource.getBlogPost(props.id)
);
```

이렇게 코드를 작성하여 횡단 관심사를 고차 컴포넌트로서 적절히 추상화하였고, 이는 코드 재사용과 유지보수성에 큰 기여를 할 것이다.

### 고차 컴포넌트란

- 입력된 컴포넌트를 수정하지 않으며 상속을 사용하여 동작을 복사하지도 않는다.
- 그저 원본 컴포넌트를 컨테이너 컴포넌트로 포장(wrapping)하여 조합(compose)한다.
- 고차 컴포넌트는 사이드 이펙트가 전혀 없는 순수 함수이다.

고차 컴포넌트는 매개변수로 받은 컴포넌트의 프로토타입을 수정 또는 변경하지 않아야 한다. 변경(mutation)된 고차 컴포넌트는 누출된 추상화(leaky abstraction)이라고 한다. HOC는 변경(mutation) 대신에 입력 컴포넌트를 컨테이너 구성 요소로 감싸서 조합(composition)을 사용해야 한다.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // 입력 component를 변경하지 않는 container 🤗
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

## 고차 컴포넌트 컨벤션

### 래핑된 컴포넌트를 통해 관련 없는 Props 전달하기

고차 컴포넌트는 컴포넌트에 기능을 추가할 뿐, 변경해서는 안 된다. 관련 없는 props는 그대로 컴포넌트에 전달한다.

```js
render() {
  const { extraProp, ...passThroughProps } = this.props;

  const injectedProp = someStateOrInstanceMethod;

  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

### 조합 가능성(Composability) 끌어올리기

고차 컴포넌트는 Component를 입력받아 Component를 반환한다. 출력 타입이 입력 타입과 동일한 함수는 정말 쉽게 조합할 수 있다.

#### React Redux의 `connect`

```js
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

위 코드를 분해해보면 `connect`는 고차 컴포넌트를 반환하는 고차 함수라는 것을 알 수 있다.

```js
// connect는 다른 함수를 반환하는 함수
const enhance = connect(commentListSelector, commentListActions);
// 반환된 함수는 Redux store에 연결된 컴포넌트를 반환하는 고차 함수 컴포넌트
const ConnectedComment = enhance(CommentList);
```

### displayName 작성

개발 도구 디버깅을 위하여 HOC의 결과임을 알리는 displayName을 작성하는 것이 좋다. 네이밍은 HOC의 이름으로 내부 컴포넌트명을 감싸는 방법을 사용한다.

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {
    /* ... */
  }
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`; // WithSubscription(CommentList)
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

#### 211028 스터디 정리

고차 컴포넌트 용도

- Enhancer : 새로운 props를 통해 기능을 추가하고 싶을 때 (외부에서 property 받음)
- Injector : 필요한 기능을 먼저 구현해놨다가 사용하고 싶을 때 (재정의처럼)
