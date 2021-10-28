# Higher-Order Components

> 고차 컴포넌트는 컴포넌트를 가져와 새 컴포넌트를 반환하는 함수입니다.


## Inject Props

우린 prop drilling이 아니라 가끔 props를 주입시켜 주고 싶은 경우가 있다. 이 때, Context API 는 좋은 방법이지만 이 방법은 value가 오직 render 함수에서만 쓸 수있다는 단점이 있다. HoC는 이를 props로 처리할 수 있게 해준다.


---

## Cross-cutting Concerns(횡단 관심사)에 고차 컴포넌트 사용하기

컴포넌트는 React 코드 재사용의 기본 단위이지만, 어떤 패턴은 이런 기존 컴포넌트에 적용이 잘 되지 않는 경우가 있다.

예를 들어, 다음과 같은 반복되는 로직이 있다고 가정하자.

1. 컴포넌트가 마운트되면, change listener를 DataSource에 추가해야 한다. 
2. 리스너 안에서 데이터 소스가 변경되면 setState를 호출한다.
3. 컴포넌트가 마운트 해제되면 change 리스너를 제거한다.

해당 패턴이 반복된다고 가정하면, 이 로직을 한 곳에서 정의하고 컴포넌트 간에 공유할 수 있는 추상화가 필요하게 된다. 이 경우, 고차 컴포넌트를 사용하면 좋다.

고차 컴포넌트는 원본 컴포넌트를 수정하지 않는다. 단순히 포장하여 조합할 뿐이다. 고차 컴포넌트는 부작용이 없는 순수 함수이다.

---

## 원본 컴포넌트를 변경 (Mutate) 하지 말아라. 조합(Composition) 하여라.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // 원본의 입력을 반환한다는 것은 이미 변형되었다는 점을 시사합니다.
  return InputComponent;
}

// EnhancedComponent 는 props를 받을 때 마다 log를 남깁니다.
const EnhancedComponent = logProps(InputComponent);
```

위와 같이 사용하게 되면, InputComponent를 재사용하기 어렵다. 또, 만약 EnhancedComponent를 인자로 받는 HOC를 적용하면 적용했던 componentDidUpdate가 무시된다.

HOC는 mutation 대신에 입력 컴포넌트를 감싸서 조합을 사용해야 한다.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // 들어온 component를 변경하지 않는 container입니다. 좋아요!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

---

## Convention : Wrapped Component에게 관련없는 Props 전달하기

```js
render() {
  // 이 HOC에만 해당되므로 추가된 props는 걸러내어 이 HOC에 전달되지 않도록 합니다.
  const { extraProp, ...passThroughProps } = this.props;

  // 이 Props는 일반적으로 Status값 또는 Instance method 입니다.
  const injectedProp = someStateOrInstanceMethod;

  // wrapped component에 props를 전달합니다.
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

고차 컴포넌트는 HOC에 해당하는 props는 걸러내어 WrappedComponent에 전달되지 않도록 해야 합니다. 즉, 관심사와 분리되어있는 props를 활용해야 합니다.

---

## Convention : 조합 가능성 극대화하기 (Maximizing Composability)

다음과 같은 코드를 보자.

```js
// React Redux의 `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

해당 코드에서 connect는 고차 컴포넌트를 반환합니다. 즉, HOC는 Component => Component의 특성을 가지고 있고, 이런 특성은 쉽게 조합할 수 있다는 특성을 가지고 있다.

---

## Convention : 쉬운 디버깅을 위한 Display name 작성 방법

displayName을 작성하려면 다음과 같이 구성하면 됩니다.

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

---

# 주의사항

## 1. Render 메서드 내부에서 HOC를 사용하지 마세요.

```js
render() {
  const EnhancedComponent = enhance(MyComponent);
  return <EnhancedComponent />;
}
```

다음과 같이 사용할 경우, render() 호출시마다 EnhancedComponent를 할당하게 된다. 이는 즉, <EnhancedComponent/>가 마운트 해제되고 다시 마운트 됨을 의미한다.

## 2. Static Method는 반드시 따로 복사해야 한다.

컴포넌트에 HOC를 적용하면, 기존 컴포넌트는 감싸지게 되므로 새로운 컴포넌트가 기존 컴포넌트의 static method를 가지고 있지 않게 됩니다.

```js
// 정적 함수를 정의합니다
WrappedComponent.staticMethod = function() {/*...*/}
// HOC를 적용합니다
const EnhancedComponent = enhance(WrappedComponent);

// 향상된 컴포넌트에는 정적 메서드가 없습니다.
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

이를 해결하기 위해선 다음과 같이 컨테이너에 복사를 해주어야 합니다.
```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // 복사 할 메서드를 정확히 알아야 합니다.
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

## 3. Ref는 전달되지 않는다.
React는 ref를 prop과 별개로, 특별하게 취급하므로 HOC 내부에 ref를 전달하려면 forwardRef를 사용해야 합니다.