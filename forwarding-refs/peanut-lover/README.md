# 리액트 고급안내서 Forwarding Ref

ref전달은 자식 컴포너트에게 컴포넌트를 통해 자식 중 하나에 `ref`를 전달하는 기법입니다.

그냥 property로 전달하면 되지않나? ref 는 react에서 `key`와 마찬가지로 특별히 관리하는 속성 중 하나입니다. 그래서 전달할 방법이 없기 때문에 리액트에서 제공하는 방법을 사용해야합니다.

즉, 부모컴포넌트가 자식 컴포넌트를 직접 제어하고 싶을 때 사용됩니다. (프로퍼티를 통한 제어가 아닌)

개발 단계에서는 아무래도 새로운 property를 만들어 제어하면 되겠지만 항상 그런 상황만 있는건 아닙니다.

외부 라이브러리 컴포넌트를 특별하게 제어할 필요가 있을 때 라이브러리 측에서 ref를 제공하는 경우도 있습니다.

# 고차컴포넌트에서 유용

ref는 리액트에서 특별하게 처리한다고 언급했었습니다.

```typescript
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("old props:", prevProps);
      console.log("new props:", this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
```

`logProps` 고차 컴포넌트는 감싸는 자식 컴포넌트의 프로퍼티를 로깅하는 역할을 합니다.

```typescript
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// FancyButton을 내보내는 대신 LogProps를 내보냅니다.
// 그래도 FancyButton을 렌더링합니다.
export default logProps(FancyButton);
```

```typescript
import FancyButton from "./FancyButton";

const ref = React.createRef();

// 가져온 FancyButton 컴포넌트는 LogProps HOC입니다.
// 렌더링된 결과가 동일하다고 하더라도,
// ref는 내부 FancyButton 컴포넌트 대신 LogProps를 가리킵니다!
// 이것은 우리가 예를 들어 ref.current.focus()를 호출할 수 없다는 것을 의미합니다.

<FancyButton label="Click Me" handleClick={handleClick} ref={ref} />;
```

위와 같이 ref를 전달할 경우,Fancy Button을 감싸는 LogProps 컴포넌트에 첨부되게 됩니다.

`ref` FancyButton에 전달을 원할 경우, logProps 컴포넌트에서 forwardRef를 사용해줘야합니다.

```typescript
function logProps(Component) {

	class LogProps extends React.Component {
		componentDidUpdate(prevProps) {
 			...
 		}
 		render() {
 			const {forwardRef, ...rest} = this.props;
 			return <Component ref={forwardRef} {...rest} />
 		}
	}

	return React.forwardRef((props, ref) => {
		return <LogProps {...props} forwardRef={ref}/>
	})
}
```

위와 같이 React.forwardRef API를 사용하여 내부 FacnyButton대한 refs를 명시적으로 전달 할 수 있습니다.

# 정리

사실 문서에서 설명한 내용만으로는 특별한 쓰임이 생각나지않아 여러 포스팅을 둘러보고 있습니다.

React `forwardRef`는 부모 컴포넌트들이 자식 컴포넌트에게 ref를 전달하는 방법입니다.

=> 부모에게 자식 컴포넌트가 제어하는 DOM element의 ref를 전달한다

**자식 컴포넌트가 관리하는 컴포넌트의 권한을 부모에게 넘기는것**...!

![스크린샷 2021-10-25 오후 3.43.48](/Users/sonjiho/Library/Application Support/typora-user-images/스크린샷 2021-10-25 오후 3.43.48.png)

전형적으로 데이터를 props를 이용해 전달합니다.

## Ref가 어떻게 많이 쓰이는지 정리

> https://blog.logrocket.com/a-guide-to-react-refs/

다양한 작업을 위해 ref들을 사용할 수 있습니다.

- Fucus, text selection, media playback을 관리하기 위해

- Focus control : react에서 포커스를 임의로 발생시키기 위해 ref가 사용에 적절

- 리렌더링을 최소화하고 싶을 때

- [Triggering imperative animations](https://stackoverflow.com/questions/51223592/triggering-imperative-animations-using-react-refs)

- Third-party DOM기반의 라이브러리 통합을 위해 사용
