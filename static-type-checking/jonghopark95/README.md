

# Static Type Checking



## 정적 타입 체커

Flow, Typescript 같은 정적 타입 체커들은 코드가 런타임으로 넘어가기 전에 특정 타입에 대한 문제점을 체크해준다. 또한, 자동 완성 등의 기능등을 통해 개발 경험들을 향상 시켜준다.





## Type Definitions

다른 패키지의 에러나 hint를 보여주기 위해, 컴파일러는 선언 파일들에 의존하게 된다.

라이브러리부터 타입 정의를 얻기 위한 두 가지 방법이 있다.



### Bundled

라이브러리가 본인의 선언 파일을 이미 번들링 된채로 가지고 있는 것이다.

우리의 할인은 단지 라이브러리를 설치하는 것이 끝이기 때문에, 우리에게 편하게 된다.

만약 라이브러리가 번들된 파일을 보길 원한다면, index.d.ts 를 보면 된다. 몇개의 라이브러리는 package.json 아래에 typings, types 필드로 정의하곤 한다.



### DefinitelyTyped

DefinitelyTyped는 선언 파일들을 번들링하지 않는 라이브러리들을 위한 큰 레포지토리 선언 모음이다.

이는 마이크로소프트와 contributor 들에 의해 관리된다. 리액트 또한 DefinitelyTyped를 사용한다.



### Local Declarations

몇개의 라이브러리 들은 번들링 되있지 않거나, DefinitelyTyped에 기재되지 않았을 수도 있다. 

이 경우, 우리는 declarations.d.ts를 만들 수 있다.

```jsx
declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}
```







