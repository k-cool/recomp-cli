## recomp-cli

리액트로 개발하다보면 컴포넌트를 만드는 작업이 매우 형식적이고 반복된다고 느껴졌습니다.
그래서 명령어 한 줄로 원하는 형태의 리액트 컴포넌트를 원하는 위치에 생성할 수 있으면 편리하고 작업 시간을 절약해줄 것이라 생각하여 만들어 보았습니다.
작업하면서 이런 기능도 있으면 좋겠다 하는 것들을 이것 저것 추가해보았습니다.
간단한 프로그램이지만 많이 사용해 주시면 감사하겠습니다!

<br>

## 설치법

```shell
npm install -g recomp-cli
```

<br>

## 사용법

### 종합 예시

```shell
recomp create {component name} -l ts -s emotion -d src/components
```

- 위 명령어를 터미널에 입력하면 src/components 경로에 emotion모듈이 적용된 typescript 컴포넌트 파일을 입력한 이름으로 자동으로 생성합니다.
- 컴포넌트 이름은 필수로 입력해야 합니다.
- 플래그 옵션은 생략이 가능하며 생략시 기본값이 적용됩니다.
- 기본값은 각각 js, css, '.' 입니다.

<br>

### recomp.config.json

- 프로젝트 경로에 recomp.config.json 파일을 생성하면 플래그 명령어를 별도로 입력하지 않아도 됩니다.

```json
{
  "language": "KR",
  "langType": "ts",
  "styleType": "emotion",
  "directory": "src/components",
  "customTemplate": "template/customTemplate.js"
}
```

```shell
recomp create Button
```

- 컴포넌트 이름만 입력하면 지정된 위치에 컴포넌트가 자동으로 프리셋 됩니다!
- language 설정은 콘솔창에 에러 및 안내 언어 설정이며, 현재 영어(EN), 한국어(KR)을 지원하고 있습니다.(기본값은 process.env.LANG을 따릅니다.)
- recomp.config.json에 모든 설정을 할 필요는 없습니다. 설정한 옵션만 적용되며 이외는 기본값을 따릅니다.

<br>

### 생성 기본

```shell
recomp create {component name}
```

<br>

### 사용언어 지정

```shell
recomp create {component name} -l ts
```

- 지원 👉 js, ts

<br>

### 스타일 타입 지정

```shell
recomp create {component name} -s emotion
```

- 지원 👉 css, emotion
- 다른 스타일 라이브러리도 원하면 추후 지원하겠습니다.

<br>

### 경로설정

```shell
recomp create {component name} -d src/components
```

<br>

### 커스텀 템플릿

```shell
recomp create {component name} -c template/custumTemplate.js
```

- 파일 경로와 파일명은 자유롭게 지정 가능합니다.

<br>

#### 템플릿 파일 양식

```js
export const template = {
  component: (compName) => `
// your custom component
export default function ${compName}() {
  return <div className="${compName}"></div>;
}
`,
  css: () => `
  // your custom css
  .recomp {
    display: flex;
  }
  `,
};
```

- 정상적으로 참조가 가능하도록 파일 양식에 객체명과 프로퍼티명 그리고 export 방식등의 샘플 형식을 유지해주세요
- 콜백함수의 첫번째 인수로 컴포넌트 명이 전달됩니다.
