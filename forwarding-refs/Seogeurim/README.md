# Ref 전달하기 (Forwarding Refs)

React에서 `ref`는 prop이 아니며 `key`와 마찬가지로 다르게 처리된다.

때때로 `ref`를 전달 받아 내부 엘리먼트에 전달해야 하는 경우가 있다. **재활용성이 높은 Leaf 컴포넌트(`<input>`, `<button>`)** 나, **재사용 가능한 컴포넌트 라이브러리**와 같은 경우 그것들의 내부 DOM 노드에 접근하는 것이 필요할 때 _(포커스, 선택, 애니메이션 등 관리)_ 가 있다.

`React.forwardRef()` 함수를 사용하면 전달받은 `ref`를 내부 엘리먼트에 전달할 수 있다.

## DOM에 refs 전달하기

### FancyButton 예제

기본 `button` DOM 요소를 렌더링하는 `FancyButton` 컴포넌트 예제이다.

```js
function FancyButton(props) {
  return <button className="FancyButton">{props.children}</button>;
}
```

외부에서 `FancyButton` 컴포넌트의 `button` 엘리먼트에 접근하기 위해서는 아래와 같이 코드를 작성할 수 있다.

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

- `React.forwardRef`를 사용하여 전달된 `ref`를 얻을 수 있다.
- 전달 받은 `ref`를 `button` 태그의 JSX 속성으로 지정해서 전달할 수 있다.

이런 방법으로 `FancyButton`을 사용하는 컴포넌트들은 `button` 엘리먼트에 대한 참조를 가져올 수 있고, DOM `button` 노드에 접근이 가능해진다.

### Audio Player 예제

> 코드 출처 : [daleseo - [React] forwardRef 사용법](https://www.daleseo.com/react-forward-ref/)

```js
// Player.jsx
import React, { useRef } from 'react';
import Audio from './Audio';
import Controls from './Controls';

function Player() {
  const audioRef = useRef(null);

  return (
    <>
      <Audio ref={audioRef} />
      <Controls audio={audioRef} />
    </>
  );
}

export default Player;
```

```js
// Audio.jsx
import React, { forwardRef } from 'react';
import music from './music.mp3';

function Audio(prop, ref) {
  return (
    <figure>
      <figcaption>Eyes on You (Sting) - Network 415:</figcaption>
      <audio src={music} ref={ref}>
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </figure>
  );
}

export default forwardRef(Audio);
```

```js
// Controls.jsx
import React from 'react';

function Controls({ audio }) {
  const handlePlay = () => {
    audio.current.play();
  };

  const handlePause = () => {
    audio.current.pause();
  };

  return (
    <>
      <button onClick={handlePlay}>재생</button>
      <button onClick={handlePause}>중지</button>
    </>
  );
}

export default Controls;
```

위 코드를 살펴보면,

- `Player` 컴포넌트에서 `audioRef` 객체를 생성한 후, `Audio` 컴포넌트에는 `ref` prop으로, `Controls` 컴포넌트에는 `audio` prop으로 넘겨주고 있다.
- `Audio` 컴포넌트는 `React.forwardRef()` 함수를 사용하여 `ref` 객체를 받고, `<audio>` 엘리먼트에 전달하였다.
- `Controls` 컴포넌트는 `audio` 이름의 일반적인 prop으로 `audioRef` 객체를 받았다. 이 객체를 활용하여 `<audio>` 엘리먼트에 접근하여 `play()`와 `pause()` 함수를 호출하고 있다.

이렇게 `ref` 전달을 통해 `Player` 컴포넌트에서 자식 컴포넌트인 `Audio` 컴포넌트의 내부에 있는 `<audio>` 엘리먼트에 직접 접근할 수 있다.

## 고차원 컴포넌트에서의 ref 전달하기

콘솔에 컴포넌트 props를 로깅하는 HOC를 예시로 들어보자.

```js
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
```

```js
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

export default logProps(FancyButton);
```

```js
import FancyButton from './FancyButton';
// 여기서의 FancyButton은 LogProps HOC

const ref = React.createRef();

<FancyButton label="Click Me" handleClick={handleClick} ref={ref} />;
```

위와 같이 코드를 작성할 경우 `LogProps` HOC를 사용해서 `FancyButton` 컴포넌트로 전달하는 모든 props를 기록할 수 있다.

하지만 이 때, `ref`는 prop이 아니기 때문에 refs는 전달되지 않는다는 문제점이 있다. `FancyButton` 컴포넌트를 위한 refs가 실제로는 LogProps 컴포넌트에 첨부된다. 그럼 이렇게 작성해보자.

```js
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const { forwardedRef, ...rest } = this.props;

      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

위와 같이 `forwardedRef` 이름의 일반적인 prop으로 `LogProps` HOC에 ref 객체를 전달하고, `Component`의 `ref` 속성으로 그 객체를 연결할 수 있다.
