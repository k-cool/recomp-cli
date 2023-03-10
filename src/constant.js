export const LANGTYPE_DEFAULT = "js";
export const STYLETYPE_DEFAULT = "css";
export const DIRECTORY_DEFAULT = ".";

const TEXT_KEY = {
  KR: {
    langTypeErr: "언어 타입은 ts, js 중 하나입니다.",
    styleTypeErr: "스타일 타입을 확인 후 입력해주세요",
    langStyleTypeErr: "언어 타입과 스타일 타입을 확인해주세요.",
    shouldUpperCase: "컴포넌트의 이름은 대문자로 시작해야 합니다.",
    noTemplateFile: "템플릿 파일을 찾을 수 없습니다.",
    exFile: (path) => `이미 ${path}에 파일이 존재합니다.`,
    created: (path) => `${path} 생성완료!`,
  },
  EN: {
    langTypeErr: "langtype should be ts or js.",
    styleTypeErr: "please check styletype.",
    langStyleTypeErr: "please check langtype and styletype.",
    shouldUpperCase: "component shoud start with capital letter.",
    noTemplateFile: "can not find template file.",
    exFile: (path) => `${path} already exsists`,
    created: (path) => `${path} created!`,
  },
};

export default TEXT_KEY;
