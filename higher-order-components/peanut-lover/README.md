# 고차 컴포넌트 정리

고차 컴포넌트와 컨테이너 컴포넌트라 불리는 패턴이 유사하다고 느낄 수 있습니다. 컨테이너 컴포넌트는 high-level과 low-level 관심사를 분리하는 전략 중 하나입니다. 컨테이너는 구독 및 state 같은 것을 관리하고 UI 렌더링 같은 것을 처리하는 컴포넌트에 props를 전달합니다. 고차 컴포넌트는 컨테이너를 그 구현체 중 일부에 사용하고 있습니다. 고차 컴포넌트는 매개변수화된 컨테이너 컴포넌트 정의로 생각할 수 있습니다.

##

고 수준의 관심사와 low-level 관심사를 분리하는 전략 중 하나입니다.

https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb

고차 컴포넌트는 기본적인 두가지 패턴으로 분리될 수 있습니다.

- Enhancers: 추가적인 기능이나 property를 가지고 컴포넌트를 감싸는 것.
- Injector: 컴포넌트에 Property를 주입하는 것.

고차 컴포넌트는 둘 중 하나 혹은 둘다 로써 사용될 수 있습니다.

## Enhance HOC

우리는 enhancers를 가지고 시작할 것입니다. 상대적으로 type 설정이 쉽기때문에.

이 패턴의 기초적인 예제는 `loading` porp 를 하나의 컴포넌트에 추가하는 HOC입니다.

```typescript
const withLoading = (Component) => {
  return class WithLoading extends React.Component {
    render() {
      const { loading, ...props } = this.props;
      return loading ? <LoadingSpinner /> : <Component {...props} />;
    }
  };
};
```

타입을 가지고 위 HOC을 구현하면

```typescript
interface WithLoadingProps {
	loading: boolean;
}

const withLoading = <P extends object>(Component: React.ComponentType<P>) => {
  return class WithLoading extends React.Component<P & WithLoadingProps> {
    renter(){
      const { loading, ...props } = this.props;
      return loading ? <LoadingSpinner> : <Component {...props as P} />
    }
  }
}
```

위 코드를 하나하나 분석해보겠습니다.

```typescript
interface WithLoadingProps {
  loading: boolean;
}
```

위와 같이 HOC에서 추가될 Property 타입을 정의해야합니다.

```typescript
<P extends object>(Component: React.ComponentType<P>)
```

여기서 저희는 제네릭을 사용하고 있습니다. `P`는 HOC에 전달된 컴포넌트의 props를 나타냅니다.

그리고 `React.ComponentType<P>`는 `React.FunctionComponent<P> | React.ClassComponent<P>` 을 의미합니다.

```typescript
class WithLoading extends React.Component<P & WithLoadingProps>
```

우리는 HOC을 통해 돌려줄 컴포넌트를 정의했습니다. 그리고 돌려줄 컴포넌트의 Props 타입을 인자로 받은 컴포넌트의 프로퍼티와 HOC에 의해 추가되는 Props를 합친 타입으로 선정해줬습니다.

```typescript
const { loading, ...props } = this.props;
```

타입스크립트의 오래된 버젼에서는 `this.props as WithLoadingProps`로 캐스팅이 필요합니다.

마지막으로 우리는 `loading`이라는 prop를 이용해서 조건적으로 Spinner Loading을 보여줄 지 결정할 수 있습니다.

```tsx
return loading ? <LoadingSpinner /> : <Component {...(props as P)} />;
```

### Functional Component로 구현도 가능

```tsx
const withLoading =
  <P extends object>(
    Component: React.ComponentType<P>
  ): React.FC<P & withLoadingProps> =>
  ({ loading, ...props }) => {
    return loading ? <LoadingSpinner /> : <Component {...(props as P)} />;
  };
```

# Injector HOC

Injectors는 더욱더 흔히 쓰이는 HOC의 형태입니다. 앞에서 했던 enhancers보다 type 세팅이 더 어렵습니다.

컴포넌트에 props를 추가해주는 것 이외에도 ,

`react-redux`의 `connect`는 injector HOC의 예입니다. 예제는 간단히 counter value과 증가나 감소할 때의 callback을 주입해는 걸로 해보겠습니다.

```tsx
import { Subtract } from "utility-types";

export interface InjectedCounterProps {
  value: number;
  onIncrement(): void;
  onDecrement(): void;
}

interface MakeCounterState {
  value: number;
}

const makeCounter = <P extends InjectedCounterProps>(
  Component: React.ComponentType<P>
) => {
  return class MakeCounter extends React.Component<
    Subtract<P, InjectedCounterProps>,
    MakeCounterState
  > {
    state: MakeCounterState = {
      value: 0,
    };

    increment = () => {
      this.setState((prevState) => ({
        value: prevState.value + 1,
      }));
    };

    decrement = () => {
      this.setState((prevState) => ({
        value: prevState - 1,
      }));
    };

    render() {
      return (
        <Component
          {...(this.props as P)}
          value={this.state.value}
          onIncrement={this.increment}
          onDecrement={this.decrement}
        />
      );
    }
  };
};
```

이 예제를 보면 Injector가 뭘해주는지 그리고 Enhancer HOC과 다른 점이 무엇인지 알 수 있습니다.

Java 에 익숙하시다면 `abstract class` 에 정의한 추상 method를 정의해서 코드 반복을 제거하기 위한 동작으로 볼수 있습니다. Enhancer HOC 예제와 다른 점은 Injector HOC를 이용해서 특정 컴포넌트의 props를 외부가 아니라 직접 주입하게 됩니다.

만약 반복되는 props를 입력하기 번거롭다면 Injector HOC는 이용해 반복되는 코드를 줄일 수 있습니다.

아래와 같은 컴포넌트를 위에서 정의 Injector HOC로 처리해줄 수 있습니다.

```tsx
import makeCounter, { InjectedCounterProps } from "./makeCounter";

interface CounterProps extends InjectedCounterProps {
  style?: React.CSSProperties;
}

const Counter = (props: CounterProps) => {
  return (
    <div style={props.style}>
      <button onClick={props.onDecrement}> - </button>
      {props.value}
      <button onClick={props.onIncrement}> + </button>
    </div>
  );
};

export default makeCounter(Counter);
```

`makeCounter` HOC를 작성할 때

`<P extends InjectedCounterProps>(ComponentType<P>)`

HOC에 전달되는 props 는 HOC에 의해 추가될 prop들이 있음을 확실히 타입지정을 해줍니다.

그리고

```typescript
class MakeCounter extends React.Component<
	Subtract<P, InjectedCounterProps>,
	MakeCounterState
>
```

여기서 `Subtract`는 `utility-types` 패키지를 통해서 사용할 수 있지만 직접 구현해보고 싶다면 아래와 같은 형태가 됩니다.

```typescript
type Subtract<P extends object, S extends object> = Pick<
  P,
  Exclude<keyof P, keyof S>
>;
```

간단히 P라는 타입에서 S라는 타입의 키를 제거한 타입을 반환하는 타입을 재정의한 것 입니다.

네 여기 까지 Injector HOC까지 구현을 해보았습니다.

위 두 예제를 합친 Enhancer + Injector 예제를 보고 마무리해보겠습니다.

```tsx
export interface InjectedCounterProps {
  value: number;
  onIncrement(): void;
  onDecrement(): void;
}

interface MakeCounterProps {
  minValue? : number;
  maxValue? : number;
}

interface MakeCounterState {
  value: number;
}

const makeCounter = <P extends InjectedCounterProps>(
	Component: React.ComponentType<P>
) => {
  return class MakeCounter extends React.Component<
  	Subtract<P, InjectedCounterProps> & MakeCounterProps,
    MakeCounterState
  > {
    state: MakeCounterState = {
      value: 0,
    }

    increment = () => {
      this.setState(prevState => {
        value: prevState.value === this.props.maxValue
        	? prevState.value
        	: prevState.value + 1
      })
    }

    decrement = () => {
      this.setState(prevState => {
        value:
        	prevState.value === this.props.minValue
        		? prevState.value,
            : prevState.value - 1
      })
    }
   render() {
      const { minValue, maxValue, ...props } = this.props;
      return (
        <Component
          {...props as P}
          value={this.state.value}
          onIncrement={this.increment}
          onDecrement={this.decrement}
        />
      );
    }
	}
}
```
