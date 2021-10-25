# [React] Forwarding Refs

재사용성이 높은 Input 컴포넌트를 작성했다고 가정해 봅시다.

```tsx
interface InputProps {
  label: string;
}
export default function MyInput({ label }: InputProps) {
  return (
    <label>
      {label}
      <input type="text" />
    </label>
  );
}
```

위와 같은 컴포넌트 들에 대해서 **focus**를 사용하거나, 애니메이션 등을 관리하기 위해서 DOM 노드에 접근하는 것이 불가피할 수 있습니다.

위의 input 컴포넌트를 사용하는 다른 컴포넌트가 최초 마운트 되었을 때 (`useEffect` 사용), 자동적으로 input에 focus할 수 있도록 ref를 전달하여 DOM에 접근해보겠습니다.

<br>

다음은 App의 코드입니다.

```tsx
function App() {
  const myInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (myInputRef.current) myInputRef.current.focus();
  }, []);

  return (
    <div>
      <h1>My App</h1>
      <MyInput ref={myInputRef} label={'Test'} />
    </div>
  );
}
```

이렇게 작성하고 실행해보았더니 오류가 발생하고, focus가 되지 않습니다. 에러를 확인해보겠습니다.. 🥲

<br>

![ref-error](assets/images/%5BReact%5D%20Forwarding%20Refs/ref-error.png)

우리가 싫어하는 저 빨간 글씨들을 보면 **함수형 컴포넌트는 ref를 전달받을 수 없다..** 라고 합니다. 그리고 밑에 해답을 보니 `React.forwardRef()`를 사용하라고 하는 것 같습니다. 그렇다면 코드를 수정하여 다시 되는지 확인해보겠습니다.

```tsx
import { forwardRef } from 'react';

interface InputProps {
  label: string;
}

const MyInput = forwardRef<HTMLInputElement, InputProps>(({ label }, ref) => {
  return (
    <label>
      {label}
      <input ref={ref} type="text" />
    </label>
  );
});
MyInput.displayName = 'MyInput';

export default MyInput;
```

![ref-success](assets/images/%5BReact%5D%20Forwarding%20Refs/ref-success.png)

됐습니다 !!

<br>

`ref` 인자는 `React.forwardRef`와 같이 호출된 컴포넌트를 정의했을 때에만 생성됩니다. 일반 함수나 클래스 컴포넌트는 `ref` 인자를 받지도 않고 props에서 사용할 수도 없습니다.

`ref`는 `key`와 마찬가지로 React에서 다르게 처리합니다.

<br>

---

<br>

## ref는 언제 사용할까?

**[React의 공식문서](https://ko.reactjs.org/docs/refs-and-the-dom.html)**를 확인해보면 Ref를 남용하지 말것이며, 바람직한 사용법에 대해 언급하고 있습니다.

저는 리액트 코드를 작성할 때 'DOM에 직접 접근하는 것을 되도록 피하고, **React에게 맡길 수 있는 모든 요소를 맡기자..!**' 라고 생각합니다.

하지만 불가피하게 사용해야 될 경우가 있습니다.

1. focus, 텍스트 선택영역, 미디어 재생 관리
2. 애니메이션을 직접적으로 실행시킬 때
3. 서드 파이 DOM 라이브러리를 React와 같이 사용할 때

<br>

위의 예시 코드 처럼 **UX를 개선하기 위해서** input의 DOM에 접근하여 focus하는 점을 알겠습니다만.. 또 언제 사용할 수 있을까요?!

저같은 경우에는 **[IntersectionObeserver API](https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API)** 를 이용하는 경우 사용합니다.

IntersectionObserver API는 아래의 경우 사용되게 됩니다.

- 페이지가 스크롤 되는 도중에 발생하는 이미지나 다른 컨텐츠의 지연 로딩.
- 스크롤 시에, 더 많은 컨텐츠가 로드 및 렌더링되어 사용자가 페이지를 이동하지 않아도 되게 하는 infinite-scroll 을 구현.
- 광고 수익을 계산하기 위한 용도로 광고의 가시성 보고.
- 사용자에게 결과가 표시되는 여부에 따라 작업이나 애니메이션을 수행할 지 여부를 결정.

<br>

IntersectionObserver API를 자세히 설명하기에는 내용이 많으니 간단히 설명해보겠습니다. 자세한 내용은 mdn 문서를 확인해주세요.. ☹️

```js
/*
options는 root, rootMargin, threshold를 갖는 객체
*/
const observer = new IntersectionObserver(callback, options);
observer.observe(elem);
```

여기서 observer 객체의 **observe** 메서드를 실행하기 위해서는 DOM에 대한 정보가 필요로 하므로 **ref**를 사용해야 합니다.