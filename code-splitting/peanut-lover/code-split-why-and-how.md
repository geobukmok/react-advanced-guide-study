# Code Splitting

https://ko.reactjs.org/docs/code-splitting.html

리액트 고급 안내서에서 **코드분할**은 리액트에서 코드 분할을 어떻게 할 수 있는지를 보여줍니다. 하지만 우리가 코드 분할을 왜해야하는지 그리고 주의할 점이 무엇인지에 관해서는 내용이 부족한 것 같아서 정리해보겠습니다.

1. 번들링을 하는 이유
2. 하나의 파일로 번들링하는 방식의 단점
3. 싱글 페이지 앱에서의 코드 분할
4. 코드 분할의 Best Practice
5. NextJS에서는 코드분할을 어떻게 지원하고 있는가?(작성 중...)

## 번들링을 하는 이유

코드를 번들링 했던 이유는 Single Page Application 방식의 웹 어플리케이션 개발이 유행되면서 Network Interaction(일반적으로 네트워크 리소스가 컴퓨팅파워보다 훨씬 느림)을 최소화하기 위해 하나의 자바스크립트 파일로 압축해서 전송하기위해서 번들링을 사용했습니다.

하지만 번들링된 JS 파일이 커질 경우, 초기 로딩 속도가 느려졌고 그로 인해 사용자 경험의 품질을 나쁘게 할 수 있습니다. 평균적으로 고객들은 웹 페이지가 로드되는 시간이 2~3초 안에 아닐 경우, 페이지를 떠날 수 있습니다.

> https://web.dev/i18n/ko/vitals/

Core Web Vital에서 중점을 두는 것 중 하나가 **로딩**이기 때문에 개선할 방법이 필요했습니다. (Core Web Vital 는 사용자 경험을 나타내는 수치입니다. )

## 하나의 파일로 번들링하는 방식의 단점

Network Interaction 시간이 훨씬 손해가 크기 때문에 **한번에** 보내는 것이 좋습니다. 하지만 사실상 큰 규모의 서비스에서 사용자가 한번에 받은 번들에서 사용하는 부분은 코드 중 **30~40%**에 불과 합니다.

또다른 문제는 SEO(Search Engine Optimization)입니다. Search Engine은 **load가 빠를 수록 페이지의 순위를 높게** 주는 경향이 있습니다.

간단한 툴으로 사용할 싱글페잉지 앱일 경우 괜찮겠지만 여러 사용자들이 사용하는 서비스에서는 초기 로딩 속도는 중요한 최적화 중 하나입니다.

## 웹팩을 이용한 코드 분할

코드 분할를 수행하는 주체는 당연하게도 여러 모듈의 코드를 모아주는 번들러입니다. 웹팩에서 어떻게 코드를 분할하고 있는지 살펴보겠습니다.

> https://webpack.kr/guides/code-splitting/

즉, 코드분할은 번들러에 의존적이기 때문에 사용하는 번들러의 동적 코드 스플리팅이 어떻게 이루어지는지를 공부할 필요가 있습니다.

웹팩의 경우, Dynamic Imports 을 제공하기위해서 런타임 중 비동기적으로 자바스크립트 코드를 가져오는 ECMAScript `import()` 를 사용합니다.

> Import(string path):Promise
>
> https://webpack.kr/api/module-methods/#import-1

```javascript
// import _ from "lodash";
// const result = _.join(["Hello", "World"], " ");
// console.log(result);

console.log("Lazy import lodash");

import("lodash").then((module) => {
  const result = module.join(["Hello", "World"], " ");
  console.log(result);
});
```

### 세분화된 코드 분할이 필요하다

```
// common.js
export default function common() {
	console.log("Common")
}

// A.js
import common from 'common.js'
export default function A () {
	common();
	console.log("A")
}

// B.js
import common from 'common.js'
export default function B () {
  common();
	console.log("B")
}

// index.js
import("./A.js").then((module) => {
  module();
});

import("./B.js").then((module) => {
  module();
});

```

**만약 위와 같이 chunk들이 덜 세분화되면, 어떤 모듈들은 하나 이상의 chunk 속에 들어갈 것 입니다.** 공통 모듈은 common chunk라고 불릴 수 있습니다. 그래서 코드 분할을 할 때는 initial bundle size, common chunk size, 그리고 code-split chunks들의 사이즈 사이에 최선의 균형을 찾는 것이 중요합니다.

**Common Chunk** vs **Initial bundle size** vs **code-split chunks**

웹팩이 어느정도 이것들에 관해 조금 최적화를 해주지만 최고의 결과를 내기 위해서는 수동적인 튜닝이 필요합니다.

> Best practice is to keep your chunks size under 150KB, so that the app becomes more interactive within 3–5 seconds, even on poor networks.

# Best Practice for code splitting

1. Routed based code splitting
2. Component-based code splitting
3. `React Loadable` 는 쉽게 리액트앱에서 코드 분할을 구현할 수 있도록 합니다.
4. Chunk Size 150 KB 정도로 유지하면 좋다!

# (추가) NextJS는 어떻게 코드 분할을 이용해서 최적화를 하고 있나?

공식문서 읽어보고 정리하겠습니다!

# 참조

> https://dev.to/sagar/increase-user-interactions-by-implementing-code-splitting-in-react-5a1e
