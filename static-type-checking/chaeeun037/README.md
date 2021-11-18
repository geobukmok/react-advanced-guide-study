# REACT STATIC TYPE CHECKING

### Why?

정적 타입 체커들을 통해 코드 실행 전에 타입 문제를 찾아내고, 자동완성과 같은 기능을 추가해서 개발자의 작업 흐름을 개선한다.

따라서 큰 프로젝트에서는 `PropTypes` 대신에 `Flow` 또는 `TypeScript`를 사용하는 것이 좋다.



## Flow

> 페이스북에서 개발한 Javascript 정적 타입 체커이다. 보통 React와 함께 사용한다.

Flow를 사용하기 위해서는 아래 요구 사항을 만족 해야 합니다.

- Flow를 프로젝트 의존성에 추가합니다.
- 컴파일된 코드에서 Flow 문법이 제거되었는지 확인합니다.
- 타입 주석을 추가하고, 타입을 체크하기 위해 Flow를 실행합니다.

### 프로젝트에 Flow 추가하기

최신 버전 Flow 설치

```sh
yarn add --dev flow-bin
# or
npm install --save-dev flow-bin
```

 `package.json` 파일에 "flow" 추가

```json
{
  // ...
  "scripts": {
    "flow": "flow",    // ...
  },
  // ...
}
```

Flow 환경설정 파일 생성

```sh
yarn run flow init
# or
npm run flow init
```



### 컴파일된 코드에서 Flow 문법 제거하기

브라우저는 Flow 관련 문법을 알아차리지 못하기 때문에 컴파일된 JavaScript 번들에서 제거해주어야 한다.

당연히 컴파일한 도구에 따라 해야할 작업은 달라진다.

#### Create React App

자동으로 Flow 문법을 제거해준다.

#### Babel

Flow를 위한 프리셋 설치

```sh
yarn add --dev @babel/preset-flow
# or
npm install --save-dev @babel/preset-flow
```

`.babelrc` 파일에서  `flow` 프리셋 설정

```json
{
  "presets": [
    "@babel/preset-flow",
    "react"
  ]
}
```

#### 다른 빌드 설정들

[flow-remove-types](https://github.com/flowtype/flow-remove-types)를 사용해서 주석을 제거할 수 있다.



### Flow 실행하기

```sh
yarn flow
# or
npm run flow
```

```sh
No errors!
✨  Done in 0.17s.
```



### Flow 타입 주석 추가하기

기본적으로 Flow는 다음 주석이 포함된 파일만 체크한다.

```jsx
// @flow
```

대체적으로 위 주석은 파일 최상단에 둔다. 프로젝트의 몇몇 파일에 주석을 추가하고 Flow가 어떤 문제를 발견했는지 확인하면 된다.

주석에 상관없이 모든 파일들을 체크하는 [옵션](https://flow.org/en/docs/config/options/#toc-all-boolean)도 있다. 모든 타입을 체크하고자 하는 새로운 프로젝트에 적합하다.

[참고]

- [Flow Documentation: Type Annotations](https://flow.org/en/docs/types/)
- [Flow Documentation: Editors](https://flow.org/en/docs/editors/)
- [Flow Documentation: React](https://flow.org/en/docs/react/)
- [Linting in Flow](https://medium.com/flow-type/linting-in-flow-7709d7a7e969)



## Typescript

> Microsoft가 개발한 프로그래밍 언어이다. Javascript의 타입 슈퍼셋이며 자체 컴파일러를 가지고 있다. 타입 언어이기 때문에 앱이 실행되기 전에 빌드 에러와 버그를 잡을 수 있다.

TypeScript를 사용하기 위해서는 아래 요구 사항을 만족해야 한다.

- 프로젝트 의존성에 TypeScript를 추가한다.
- TypeScript 컴파일러 옵션을 설정한다.
- 올바른 파일 확장을 사용한다.
- 사용하는 라이브러리의 정의를 추가한다.

### Create React App과 함께 타입스크립트 사용하기

별도의 설정 없이 TypeScript를 지원하는 새로운 프로젝트를 생성할 수 있다.

```sh
npx create-react-app my-app --template typescript
```

이미 존재하는 Create React App 프로젝트에도 추가할 수 있다. [참고](https://facebook.github.io/create-react-app/docs/adding-typescript)



### 프로젝트에 TypeScript 추가하기

> Create React App을 사용하지 않는 프로젝트에서 Typescript를 추가하는 방법이다.

최신 버전 Typescript 설치

```sh
yarn add --dev typescript
# or
npm install --save-dev typescript
```

 `package.json`파일`"script"`에 `"tsc"` 추가

```json
{
  // ...
  "scripts": {
    "build": "tsc",    // ...
  },
  // ...
}
```



### TypeScript 컴파일러 설정하기

 `tsconfig.json`에 tsc 설정을 해야 한다. 

```sh
yarn run tsc --init
# or
npx tsc --init
```

[컴파일러 옵션 확인](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

tsc를 통해 생성된 js 파일과 소스코드를 구분하기 위해서 다음과 같은 작업을 한다.

- 모든 소스코드는 `src` 디렉토리에 넣는다.

```
├── package.json
├── src
│   └── index.ts
└── tsconfig.json
```

- 소스코드 경로와 컴파일을 통해 생성된 코드 경로를 작성한다.

```json
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"    // ...
  },
}
```

 `rootDir`는 소스코드 경로, `outDir`는 tsc를 통해 생성된 코드 경로이다.

`build` 폴더는 `.gitignore`에 추가한다.

개발하기 편하게 `tsconfig.json`파일이 설정된 다음 문서를 참고할 수 있다.

[TypeScript React Starter](https://github.com/Microsoft/TypeScript-React-Starter/blob/master/tsconfig.json)



### 파일 확장자

`.ts`는 TypeScript 파일 기본 확장자이다.

`.tsx`는 `JSX` 문법이 포함된 코드를 위한 확장자이다.



### TypeScript 실행하기

```sh
yarn build
# or
npm run build
```



### 타입 정의

다른 패키지의 오류와 힌트를 출력하기 위해 컴파일러는 선언 파일에 의존한다. 

선언 파일은 라이브러리에 대한 모든 타입 정보를 제공한다. 프로젝트의 npm에 라이브러리에 대한 선언파일이 있다면 해당하는 JavaScript 라이브러리를 사용할 수 있다.

라이브러리에 대한 선언을 가져올 수 있는 방법은 두가지가 있다.

#### Bundled

라이브러리가 자신의 선언 파일을 번들한다. 라이브러리가 번들된 타입을 가지고있는지 확인하려면 프로젝트 내에 `index.d.ts` 파일을 보면 된다. 

#### [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)

선언 파일을 번들하지 않은 라이브러리를 위한 거대 저장소이다. 이 저장소의 선언은 Microsoft와 오픈소스 기여자들에 의해 관리되는 크라우드 소스이다. 

예를 들어 React는 자체 선언 파일을 번들하지 않는 대신 다읍과 같이 DefinitelyTyped를 통해 다운받을 수 있다.

```sh
yarn add --dev @types/react
# or
npm i --save-dev @types/react
```

**Local Declarations** 

사용하고 싶은 패키지가 타입 선언 파일을 번들하지도 않고 DefinitelyTyped에서 제공하지도 않는 경우 로컬 타입 선언 파일을 가질 수 있다. 

`declarations.d.ts` 파일을 sourse 디렉토리의 루트에 생성하고 선언하면 된다. 

```tsx
declare module 'querystring' {
  export function stringify(val: object): string;
  export function parse(val: string): object;
}
```



[참고]

- [TypeScript Documentation: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Documentation: Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
- [TypeScript Documentation: React and Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)



## ReScript

> [ReScript](https://rescript-lang.org/)는 JavaScript로 컴파일되는 타입이 있는 언어이다. 

핵심 기능 중 몇 가지는 100% 타입 커버리지가 보장된다는 점과 first-class로 JSX를 지원하며, JS와 TS로 작성된 React 코드베이스와의 통합을 허용하기 위한 [React 전용 바인딩](https://rescript-lang.org/docs/react/latest/introduction)이 있다.

이미 작성된 JS와 React 코드베이스에 ReScript를 통합하는 방법에 대한 더 자세한 정보는 [여기](https://rescript-lang.org/docs/manual/latest/installation#integrate-into-an-existing-js-project)에서 찾을 수 있다.



## Kotlin

> [Kotlin](https://kotlinlang.org/)은 JetBrains이 개발한 정적 타입 언어이다. Kotlin의 타깃 플랫폼은 JVM, Android, LLVM, JavaScript이다.

JetBrains은 React 커뮤니티를 위해 [React bindings](https://github.com/JetBrains/kotlin-wrappers)나 [Create React Kotlin App](https://github.com/JetBrains/create-react-kotlin-app)와 같은 몇몇 도구를 개발, 유지하고 있다. Create React Kotlin App은 별다른 빌드 설정 없이 Kotlin으로 React 앱을 개발할 수 있도록 도와준다.



## 다른 언어들

JavaScript로 컴파일 할 수 있다면 다른 정적 타입 언어들도 React와 호환할 수 있다. 

예를 들면 [F#/Fable](https://fable.io/)를 기반으로한 [elmish-react](https://elmish.github.io/react)가 있다. 
