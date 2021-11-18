# Static Type Checking

[Flow](https://flow.org/), [TypeScript](https://www.typescriptlang.org/)와 같은 static type checker를 통해 **코드 실행 전 타입 문제**를 잡아낼 수 있으며 자동완성 등의 기능을 통해 **개발자 작업 흐름을 개선**할 수 있다. 문서에서는 PropTypes보다 Flow/TypeScript를 사용하길 권장하고 있다.

## Flow

> Facebook에서 개발

Flow를 사용하기 위한 단계는 다음과 같다.

### Adding Flow to a Project

설치

```bash
yarn add --dev flow-bin
or
npm install --save-dev flow-bin
```

script 추가

```json
// package.json
"scripts": {
  "flow": "flow",
  // ...
},
```

flow 환경설정 파일 만들기

```bash
yarn run flow init
or
npm run flow init
```

### Stripping Flow Syntax from the Compiled Code

- CRA : 미리 세팅되어 있음
- Babel : `@babel/preset-flow` 프리셋 설치 & `.babelrc` 설정

  ```json
  {
    "presets": [
      "@babel/preset-flow", // flow 문법 사용 가능하게 해줌
      "react" // 필수는 아니지만, 자주 함께 사용함
    ]
  }
  ```

### Running Flow

```bash
yarn flow
or
npm run flow
```

### Adding Flow Type Annotations

- 파일 최상단에 `// @flow` 주석을 추가하면, 해당 파일에 대하여 타입을 체크한다.
- [`.flowconfig`](https://flow.org/en/docs/config/options/#toc-all-boolean) 설정을 통하여 주석에 상관 없이 모든 파일들을 체크할 수도 있다.

## TypeScript

> Microsoft에서 개발

TypeScript는 JavaScript의 typed superset이며 자체 컴파일러를 가지고 있다. TypeScript를 사용하기 위해서는 다음 단계를 거쳐야 한다.

### Using TypeScript with Create React App

다음 명령어를 통해 TypeScript를 지원하는 새 프로젝트를 생성하고, 별도의 설정 없이 TypeScript를 사용할 수 있다.

```bash
npx create-react-app my-app --template typescript

```

### Adding TypeScript to a Project

설치

```bash
yarn add --dev typescript
or
npm install --save-dev typescript
```

script 추가 (TypeScript를 설치하면 `tsc` 명령어에 접근할 수 있다)

```json
// package.json
"scripts": {
  "build": "tsc",
  // ...
},
```

### Configuring the TypeScript Compiler

TypeScript 컴파일러에게 무엇을 해야할지 설정해주기 위해 `tsconfig.json` 파일을 생성해야 한다.

아래 명령어를 실행하면 `tsconfig.json` 파일을 생성할 수 있다.

```bash
yarn run tsc --init
or
npx tsc --init
```

`tsconfig.json`를 아래와 같이 설정하면 `rootDir` 경로에서 `outDir`로 컴파일(TypeScript to JavaScript)된다.

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  }
}
```

### File extensions

- `.ts` : TypeScript 파일 기본 확장자
- `.tsx` : TypeScript 파일 중 JSX 문법이 포함된 코드를 위한 확장자

### Running TypeScript

다음 명령어를 통해 TypeScript 컴파일을 수행할 수 있다.

```bash
yarn build
or
npm run build
```

### Type Definitions

라이브러리를 사용할 때 타입 선언은 다음과 같이 가져올 수 있다.

- Bundled : 라이브러리가 자신의 선언 파일을 번들한다. (그저 다운받고 올바르게 사용하면 된다.)
  - 프로젝트 내에 `index.d.ts` 파일이 존재하거나 `package.json` 파일의 `typings`/`types` 필드 아래에 정의되어 있다면 번들된 타입을 가지고 있는 라이브러리이다.
- DefinitelyTyped : 번들하지 않은 라이브러리는 `@types/react`와 같은 패키지를 다운받아 사용할 수 있다.
- Local Declarations : `declarations.d.ts` 파일을 생성하여 로컬 타입 선언 파일을 가질 수 있다.
