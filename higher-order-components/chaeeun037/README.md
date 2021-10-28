# REACT HOC

### Why?

컴포넌트 로직을 재사용하기 위해서 사용하는 패턴이다.

클래스에서 상속 패턴을 활용해서 확장 가능하지만 상속 관계가 깊어지면 부모의 항목을 한눈에 보기 어렵고 원하지 않는 기능을 물려받는 구조적인 문제가 있다.

이러한 상속관계의 종속성을 없애고 기능만을 따로 떼어내서 조합할 수 있다.



## 고차 컴포넌트?

HOC는 이와 같은 고차 함수 확장 기능을 리액트 컴포넌트에서 구현할 수 있도록 고안한 디자인 패턴이다. 고차 함수의 이름을 살려 고차 컴포넌트로 불린다.

고차 컴포넌트의 구현 방법은 고차 함수 구조와 동일하다.

인자에 컴포넌트를 전달하고 새 컴포넌트를 반환하는 구조로 클래스, 함수 컴포넌트 상관 없이 원하는 형태의 컴포넌트로 반환하면 된다.

[예시]

```react
const EnhancedComponent = withHoC(WrappedComponent);
```

```react
import React from 'react';

export default function withHoC(WrappedComponent) {
	return class extends React.Component {
		render() {
			return <WrappedComponent {...this.props} />
		}
	}
}
```

### 사용 사례

> [참고](https://www.youtube.com/watch?v=rbfQsKqhwTw&t=149s)

* 로딩 메시지 표시
* 에러 메시지 표시



## 횡단 관심사에 고차 컴포넌트 사용하기

> 컴포넌트가 재사용의 기본 단위로 적용될 수 없는 패턴인 경우에 고차 컴포넌트를 사용할 수 있다.

### mixin?

> 이전에 사용하였지만 많은 문제를 일으킴으로써 더 이상 권장하지 않는다.
>
> [참고](https://ko.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)



## 변경이 아닌 조합(Composition)

>고차 컴포넌트 내부에서 컴포넌트의 프로토타입을 수정하지 않도록 한다.

```react
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // 들어온 component를 변경하지 않는 container이다.
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

고차 컴포넌트는 매개변수화된 컨테이너 컴포넌트로 생각할 수 있다.



## Convention: 특정 관심사와 관련 없는 Props 전달

고차 컴포넌트에서 반환된 컴포넌트는 래핑된 컴포넌트와 비슷한 인터페이스가 있어야 한다.

```react
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

위와 같은 convention으로 HOC의 유연성과 재사용성을 보장한다.



## Convention: 조합 가능성(Composability)

`compose`함수를 사용해서 여러 HOC를 조합할 수 있다. 

```react
// ... 함수 구성 유틸리티를 사용할 수 있습니다.
// compose(f, g, h)는 (...args) => f(g(h(...args)))와 같습니다.
const enhance = compose(
  // 둘 다 단일 매개변수의 HOC입니다.
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```



## Convention: 명명 규칙

디버깅을 간편하게 하기 위해서, HOC를 조합을 할 때 일반 컴포넌트, 함수와 구분하기 위해서 HOC의 이름에는 접두사로 with를 붙이는 규칙을 따르는 것이 좋다. 



## 주의사항

### render 메서드 안에서 고차 컴포넌트를 사용하지 않기

성능상의 문제 뿐만 아니라 컴포넌트가 다시 마운트되면서 컴포넌트의 state와 하위 항목들이 손실된다.

따라서 컴포넌트 정의 바깥에 HOC를 적용해서 컴포넌트가 한 번만 생성되도록 한다.

### 정적 메서드는 따로 복사하기

컴포넌트에 HOC를 적용하면 기존 컴포넌트는 컨테이너의 컴포넌트로 감싸지므로 기존 컴포넌트의 정적 메서드를 가지고 있지 않는다.

따라서 메서드를 반환하기 전에 컨테이너에 복사해야 한다.

hoist-non-react-statics를 사용해서 자동으로 복사할 수 있다.

```react
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

정적 메서드를 컴포넌트와 따로 내보내는 방법도 있다.

```react
// 대신에...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...메서드를 각각 내보내고...
export { someFunction };

// ...불러오는 모듈에서 두개를 다 임포트합니다.
import MyComponent, { someFunction } from './MyComponent.js';
```

### ref는 전달되지 않는다.

React에서 ref는 prop가 아닌 key처럼 특별하게 취급되기 때문에 ref는 래핑된 컴포넌트가 아닌 가장 바깥쪽 컨테이너 컴포넌트의 인스턴스를 나타낸다. 

`React.forwardRef`를 사용해서 해결할 수 있다. [참고](https://chaeeun037.github.io/react-forwarding-refs/)
