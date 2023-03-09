#!/usr/bin/env node --no-warnings

import fs from "fs";
import path from "path";
import packageInfo from "../package.json" assert { type: "json" };
import { program } from "commander";
import chalk from "chalk";
import templateFunc from "./templateFunc.js";
import {
  STYLETYPE_DEFAULT,
  DIRECTORY_DEFAULT,
  LANGTYPE_DEFAULT,
} from "./constant.js";

const exist = (dir) => {
  try {
    fs.accessSync(
      dir,
      fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK
    );
    return true;
  } catch (err) {
    return false;
  }
};

const mkdir = (dir) => {
  const dirname = path
    .relative(".", path.normalize(dir))
    .split(path.sep)
    .filter((p) => !!p);

  dirname.forEach((_, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);

    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeCompFilePath = (compName, langType, directory) => {
  return langType === "js"
    ? path.join(directory, `${compName}.jsx`)
    : path.join(directory, `${compName}.tsx`);
};

const makeStyleFilePath = (compName, styleType, directory) => {
  return styleType === "css"
    ? path.join(directory, `${compName}.css`)
    : path.join(directory, `${compName}.scss`);
};

const makeCompTemplate = (compName, langType, styleType) => {
  const method = langType + styleType;
  if (!templateFunc[method]) return false;
  return templateFunc[method](compName);
};

const makeStyleTemplate = (compName, styleType) => {
  if (!templateFunc[styleType]) return false;
  return templateFunc[styleType](compName);
};

const createComp = (compName, langType, styleType, directory) => {
  mkdir(directory);

  if (langType !== "js" && langType !== "ts")
    return console.error(chalk.bold.red("언어 타입은 ts, js 중 하나입니다."));

  if (styleType !== "css" && styleType !== "emotion")
    return console.error(chalk.bold.red("스타일 타입을 확인 후 입력해주세요"));

  // comp 생성
  const compFilePath = makeCompFilePath(compName, langType, directory);

  if (exist(compFilePath))
    return console.error(
      chalk.bold.red(`이미 ${compFilePath}에 파일이 존재합니다.`)
    );

  const tpl = makeCompTemplate(compName, langType, styleType);

  if (!tpl)
    return console.error(
      chalk.bold.red("언어 타입과 스타일 타입을 확인해주세요.")
    );

  fs.writeFileSync(compFilePath, tpl);
  console.log(chalk.green(compFilePath, "생성완료"));

  // style 생성
  if (styleType === "css" || styleType === "scss") {
    const styleFilePath = makeStyleFilePath(compName, styleType, directory);

    if (exist(styleFilePath))
      return console.error(
        chalk.bold.red(`이미 ${styleFilePath}에 파일이 존재합니다.`)
      );

    const tpl = makeStyleTemplate(compName, styleType);

    if (!tpl)
      return console.error(chalk.bold.red("스타일 타입을 확인해주세요."));

    fs.writeFileSync(styleFilePath, tpl);
    console.log(chalk.green(styleFilePath, "생성완료"));
  }
};

program //
  .version(`${packageInfo.version}`, "-v, --version")
  .name("recomp");

program
  .command("create <compname>")
  .usage(
    "<compname> --langtype [langtype] --styletype [styletype] --directory [directory] "
  )
  .description("컴포넌트를 생성합니다.")
  .option(
    "-l, --langtype [langype]",
    "사용하는 언어 타입(js, ts)을 입력하세요."
  )
  .option("-s, --styletype [styletype]", "사용하는 스타일 타입을 입력하세요.")
  .option("-d --directory [directory]", "생성할 디렉토리 경로를 입력하세요")
  .action((compname, options) => {
    if (!/^[A-Z]/.test(compname))
      return console.error(
        chalk.bold.red("컴포넌트의 이름은 대문자로 시작해야 합니다.")
      );

    let langtype;
    let styletype;
    let directory;

    if (exist("./recomp.config.json")) {
      const config = JSON.parse(
        fs.readFileSync("./recomp.config.json").toString()
      );

      langtype = config.langType || LANGTYPE_DEFAULT;
      styletype = config.styleType || STYLETYPE_DEFAULT;
      directory = config.directory || DIRECTORY_DEFAULT;
    }

    console.log(options);
    langtype = options.langtype ? options.langtype : langtype;
    styletype = options.styletype ? options.styletype : styletype;
    directory = options.directory ? options.directory : directory;

    console.log("compname:", chalk.hex("#7cddf7")(compname));
    console.log("langtype:", chalk.hex("#7cddf7")(langtype));
    console.log("styletype:", chalk.hex("#7cddf7")(styletype));
    console.log("directory:", chalk.hex("#7cddf7")(directory));
    createComp(compname, langtype, styletype, directory);
  });

program.parse(process.argv);
