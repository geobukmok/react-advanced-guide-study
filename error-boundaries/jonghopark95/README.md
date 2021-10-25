# [react-error-boundary 로 에러 핸들링하기](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)



# Error Boundaries

> 과거에는 컴포넌트 내부의 JS 에러가 React State를 훼손하고, 다음 렌더링에서 암호화 에러 방출을 유발하곤 했다. 이런 에러는 항상 애플리케이션 코드의 이전 단계의 에러로 인해 발생했지만, React는 컴포넌트 내에서 에러를 처리할 방법을 제공하지 않았다.


# try/catch

보통, 에러를 처리하기 위해 먼저 떠올리는 것은 try / catch이다.

```js
import * as React from 'react'
import ReactDOM from 'react-dom'

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{color: 'red'}}>{error.message}</pre>
    </div>
  )
}

function Greeting({subject}) {
  try {
    return <div>Hello {subject.toUpperCase()}</div>
  } catch (error) {
    return <ErrorFallback error={error} />
  }
}

function Farewell({subject}) {
  try {
    return <div>Goodbye {subject.toUpperCase()}</div>
  } catch (error) {
    return <ErrorFallback error={error} />
  }
}

function App() {
  return (
    <div>
      <Greeting />
      <Farewell />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
```

의외로 이건 정상적으로 동작한다.
그러나, 모든 컴포넌트를 try/catch 로 묶는 것은 꽤나 귀찮은 작업이다. 단순히 App 컴포넌트만 묶어도 되지 않는가??

```js
function App() {
  try {
    return (
      <div>
        <Greeting />
        <Farewell />
      </div>
    )
  } catch (error) {
    return <ErrorFallback error={error} />
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
```

그러나 이는 동작하지 않는다. 왜냐면 Greeting, Farewall을 호출하는 주체는 우리가 아니라, React 이기 때문이다. Greeting, Farewall 이 오류가 발생했을 때 감지하는 것은 React 이다.

또, try/catch 는 명령형인 반면에, React는 선언형이므로 어울리지 않는다는 점도 있다.


# Error Boundary

React에서는 error boundary 라는 방법을 제시한다. 또, 더 많은 지원을 해주는 react-error-boundary 라이브러리도 있다.

```js
import {ErrorBoundary} from 'react-error-boundary'

function ErrorFallback({error}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{color: 'red'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  return (
    <div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Greeting />
        <Farewell />
      </ErrorBoundary>
    </div>
  )
}
```


# Error Recovery

react-error-boundary 라이브러리의 좋은 점은, onReset, resetKeys prop을 통해 에러가 난 이후를 제어할 수 있도록 해준다는 점입니다.

```js
function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{color: 'red'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}


function App() {
  const [username, setUsername] = React.useState('')
  const usernameRef = React.useRef(null)

  return (
    <div>
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
            setUsername('')
            usernameRef.current.focus()
            }}
            resetKeys={[username]}
        >
            <Bomb username={username} />
        </ErrorBoundary>
    </div>
  )
}
```

# 모든 에러 다루기

React docs 에 따르면, 다음과 같은 경우 React는 Error Boundary 를 처리할 수 없습니다.

```
* Event Handler
* Asynchronous code (e.g. setTimeout, requestAnimationFrame, ...)
* SSR
* 자식이 아닌, Error Boundary 자체에서 발생하는 에러
```

이 경우, useErrorHandler 훅을 사용해 핸들링 할 수 있습니다.


```js
// 비동기 처리
  const handleError = useErrorHandler()

  function handleSubmit(event) {
    event.preventDefault()
    const name = event.target.elements.name.value
    setState({status: 'pending'})
    fetchGreeting(name).then(
      newGreeting => setState({greeting: newGreeting, status: 'resolved'}),
      error => handleError(error),
    )
  }
```

또는 다음과 같이 사용할 수도 있습니다.
```js

function Greeting() {
  const [name, setName] = React.useState('')
  const {status, greeting, error} = useGreeting(name)
  useErrorHandler(error)

  function handleSubmit(event) {
    event.preventDefault()
    const name = event.target.elements.name.value
    setName(name)
  }

  return status === 'resolved' ? (
    <div>{greeting}</div>
  ) : (
    <form onSubmit={handleSubmit}>
      <label>Name</label>
      <input id="name" />
      <button type="submit" onClick={handleClick}>
        get a greeting
      </button>
    </form>
  )
}
```

두 가지 모두, error 가 발생할 경우 위로 전파되어 가장 가까운 error boundary 에 걸릴 것입니다.