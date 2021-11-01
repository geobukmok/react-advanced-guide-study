# 다른 라이브러리와 통합하기

React 앱 안에 다른 어플리케이션을 얼마든지 포함시킬 수 있다.

## DOM 조작 플러그인과 통합하기

React는 React의 외부 DOM에서 일어나는 변화를 인식하지 못하기 때문에 다른 라이브러리와 같은 DOM 노드를 다룬다면 혼란스러울 것이다. 이 충돌을 피하는 가장 쉬운 방법은 React 컴포넌트가 업데이트되지 않게 막는 것이다.

### jQuery 플러그인

jQuery 플러그인이 DOM의 일부에 자유롭게 접근하기 위해서는 다음과 같은 wrapper를 정의할 수 있다.

```jsx
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={(el) => (this.el = el)} />;
  }
}
```

- 최상위 DOM 엘리먼트에 ref를 붙인다.
- `render()` 메서드에서 빈 `<div />`를 반환함으로써 React 컴포넌트가 업데이트되지 않도록 막는다.
- `componentDidMount`, `componentWillUnmount` 생명주기 메서드를 정의하여 jQuery 플러그인이 DOM에 이벤트 리스너를 등록하고, 해제하도록 한다. (메모리 누수를 방지하기 위해 플러그인이 등록한 이벤트 리스너를 제거하는 것은 필수! - 해제하는 메서드 없으면 만들어서라도)

#### 구체적 예시 - jquery Chosen 플러그인

```jsx
function Example() {
  return (
    <Chosen onChange={(value) => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

```jsx
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger('chosen:updated');
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }

  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={(el) => (this.el = el)}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

- React가 관여하는 한 `<div>`는 항상 단일 자식만 가지며, React 업데이트는 Chosen에 의해 추가된 외부 DOM 노드와 충돌하지 않는다.
- `componentDidMount`에서 `<select>` 노드의 ref를 통해 Chosen을 초기화하고, `componentWillUnmount`에서 해제한다.
- 값이 변경될 때마다 알림을 받기 위해 Chosen이 관리하는 `<select>`에서 jQuery change 이벤트를 구독한다. `this.props.onChange`를 호출하는 `handleChange()` 메서드를 선언하고 jQuery change 이벤트로 구독한다. (`DidMount`에서 `on`, `WillUnmount`에서 `off`)
- React가 DOM을 관리하지 않으므로, props가 업데이트될 때마다 수동으로 DOM을 업데이트해줘야 한다. `componentDidUpdate`에서 props를 비교하여 변경되었을 경우 Chosen에게 `trigger()` API를 통해 알려준다.

## 다른 뷰 라이브러리와 통합하기

`ReactDOM.render()` 메서드는 독립적인 UI에 대해 여러 번 호출될 수 있는데, 이 유연성 덕분에 다른 애플리케이션에 React를 포함시킬 수 있다.

### 문자열 기반 렌더링을 React로 바꾸기

이전 웹 애플리케이션은 `$el.html(htmlString)` 처럼 DOM의 일부분을 문자열로서 DOM에 삽입하는 방식이었다. 이를 React 컴포넌트 기반으로 다시 작성할 수 있다.

다음과 같은 jQuery 구현은

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function () {
  alert('Hello!');
});
```

다음과 같이 React 컴포넌트를 통해 재작성할 수 있다.

```jsx
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(<Button />, document.getElementById('container'), function () {
  $('#btn').click(function () {
    alert('Hello!');
  });
});
```

다만, 위 코드에서는 동일한 컴포넌트를 여러 번 렌더링할 수 있으므로 ID를 통한 방식이 아닌 React 이벤트 시스템을 통해 클릭 핸들러를 등록하는 것이 더 좋다.

```jsx
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(<HelloButton />, document.getElementById('container'));
```

#### 구체적 예시 - Backbone 뷰

Backbone 뷰는 문자열을 통해 DOM 엘리먼트를 생성한다. 이 프로세스를 `ReactDOM.render()` 메서드를 사용해 React 컴포넌트 렌더링으로 대체할 수 있다.

```js
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    // Backbone의 render() 함수 오버라이드
    const text = this.model.get('text');
    // `this.el`이 제공하는 DOM 요소에 <Paragraph /> 컴포넌트 렌더링
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    // React 이벤트 핸들러와 기타 자원들을 등록 해제
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  },
});
```

---

이 이상의 내용들은 나중에 찾아보는 것이 더 유익할 것 같아서 이 정도로만 정리하겠다. 이번 문서는 라이브러리 통합하기에 대한 맛보기용 !! (Backbone을 써본 경험이 없고 잘 모름, 나중에 쓸 일이 생길 때 찾아보는 것이 더 좋을 것 같음)
