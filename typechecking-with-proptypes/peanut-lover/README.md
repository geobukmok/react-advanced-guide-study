# Typescript 란?



Typescript 같은 정적 타입 체커들은 **코드 실행 전에 특정한 타입 문제**를 찾아냅니다. 

또한 자동완성과 같은 기능을 추가하여 **개발자의 작업 흐름을 개선**하기도 합니다. 

이러한 이유로 큰 코드 베이스에서는 `PropTypes`를 사용하는 대신 

TypeScript를 사용하는 것을 추천해 드립니다.



# 설정 방법



`tsconfig.json` 을 생성하려면 아래 명령을 실행하세요.

```bash
yarn run tsc --init
```

 생성된 `tsconfig.json`에서 사용할 수 있는 수 많은 컴파일러 옵션들을 볼 수 있습니다.

많은 옵션 중에서 `rootDir`와 `outDir`를 살펴보려고 합니다. 실제로 컴파일러는 TypeScript파일을 통해 Javascript파일을 생성합니다.

이 과정 중 소스파일과 생성된 파일 간의 혼동을 야기할 수 있습니다.



이를 해결하기 위해 두 단계를 거칩니다.

```
|-- package.json
|-- src
|		 |-- index.ts
|-- tsconfig.json

우선 프로젝트 구조를 아래와 같이 정히합니다. 모든 소스코드는 `src` 디렉토리에 위치시킬 것입니다.
```



그 다음, **소스코드가 어디**있는지, **컴파일을 통해 생성된 코드를 어디**에 위치 시켜야 하는지 컴파러에 서술합니다. 

```json
{
  "compilerOptions": {
    // ...
    "rootDir": "src",
    "outDir": "build"
    // ...
  },
}
```

이제 컴팡리러가 생성된 Javascript 를 `build` 폴더에 위치 시킬 것 입니다. 

일반적으로 생성된 JavaScript 코드를 소스 관리에 두고 싶어 하지 않습니다. 때문에 `build` 폴를 `.gitignore` 파일에 추가하도록 합니다.



# 타입 정의

다른 패키지의 오류와 힌트를 출력하기 위해 컴파일러는 **선언 파일에 의존**합니다. 선언파일은 **라이브러리에 대한 모든 타입 정**보를 제공합니다**. 프로젝트의 npm에 라이브러리에 대한 선언파일이 있다면** 해당하는 Javascript 라이브러리를 사용할 수 있습니다. 



라이브러리에 대한 선언을 가져올 수 있는 방법은 두가지가 있습니다.

`Builded` - **라이브러리가 자신의 선언 파일을 번들**합니다. 이 후 해야할 일은 그저 라이브러를 다운 받고 올바르게 사용하는 것 밖에 할 일이 없기 때문에 사용자에게 좋습니다.

> 간단히 방해 Builded는 *.d.ts 파일도 라이브러리와 함께 제공하는 방식

`DefinitelyTyped` 는 선언 파일을 번들하지 않은 라이브러리를 위한 거대 저장소 입니다.

이 저장소의 선언은 Microsoft와 오픈 소스 기여자들에 의해 관리되는 크라우드 소스입니다. 예를 들어 React 자체 선언파일을 번들하지않습니다. (자바스크립트만 쓰고 싶어할 수도 있기 때문입니다.) 대신 DefinitedlyTyped를 통해 다운 받을 수 있습니다.



`Local Declarations`  - 때때로 사용하고 싶은 패키지가 타입 선언파일을 번들하지도 않고   DefinitelyTyped 에서 제공하지도 않을 수 있습니다. 이러한 경우 로컬 타입 선언파일을 가질 수 있습니다. 이 방법을 사용하려면 `*.d.ts`파일을 source 디렉토리의 루투에 생성합니다. 

```ts
declare module 'querystring' {
	export function stringfy(val: object): string;
	export function parse(val: string): object;
}
```



