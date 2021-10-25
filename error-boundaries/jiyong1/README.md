# [React] Error Boundary

컴포넌트 일부분에 존재하는 자바스크립트 에러가 어플리케이션을 중단시키는 것은 매우 치명적인 상황입니다. 이러한 상황을 대처하기 위해 **Error Boundary**라는 개념이 존재합니다.

Error Boundary는 하위 컴포넌트 중 어느 곳에서 에러를 발생하게 되면 **Fallback UI**를 보여주는 React 컴포넌트 입니다.

<br>

다음은 제가 **TypeScript**로 작성한 Error Boundary 코드 입니다.

```tsx
import { ReactNode, Component, isValidElement, ComponentType } from 'react';

interface FallbackProps {
  reset: () => void;
}
interface ErrorBoundaryProps {
  children: ReactNode;
  Fallback?: ComponentType<FallbackProps>;
  fallbackRender?: (props: FallbackProps) => ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };
  resetHandler = () => {
    this.reset();
  };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  reset() {
    this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      const props = { reset: this.resetHandler };
      const { Fallback, fallbackRender } = this.props;
      if (isValidElement(Fallback)) {
        return Fallback;
      } else if (typeof fallbackRender === 'function') {
        return fallbackRender(props);
      } else {
        throw new Error('not compatible');
      }
    }

    return this.props.children;
  }
}

```

> react-error-boundary 라이브러리를 살짝 따라해본 Error Boundary

<br>

<br>

## react-error-boundary Library

이전 **배민 문방구** 프로젝트에서 **[react-error-boundary](https://www.npmjs.com/package/react-error-boundary?activeTab=dependencies)**라는 라이브러리를 사용한 적이 있습니다.

해당 라이브러리를 사용하게 되면 fallback 컴포넌트 뿐만 아니라, **reset**할 수 있는 함수를 전달받을 수 있습니다 !

