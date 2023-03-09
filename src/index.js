#!/usr/bin/env node --no-warnings

import fs from "fs";
import path from "path";
import packageInfo from "../package.json" assert { type: "json" };
import { program } from "commander";
import chalk from "chalk";
import templateFunc from "./templateFunc.js";
import { exist, mkdir } from "./util.js";
import TEXT_KEY, {
  STYLETYPE_DEFAULT,
  DIRECTORY_DEFAULT,
  LANGTYPE_DEFAULT,
} from "./constant.js";

let config;
if (exist("./recomp.config.json"))
  config = JSON.parse(fs.readFileSync("./recomp.config.json").toString());

const lang = config.language
  ? config.language
  : process.env.LANG.startsWith("kr")
  ? "KR"
  : "EN";

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
    return console.error(chalk.bold.red(TEXT_KEY[lang].langTypeErr));

  if (styleType !== "css" && styleType !== "emotion")
    return console.error(chalk.bold.red(TEXT_KEY[lang].styleTypeErr));

  // comp 생성
  const compFilePath = makeCompFilePath(compName, langType, directory);

  if (exist(compFilePath))
    return console.error(chalk.bold.red(TEXT_KEY[lang].exFile(compFilePath)));

  const tpl = makeCompTemplate(compName, langType, styleType);

  if (!tpl)
    return console.error(chalk.bold.red(TEXT_KEY[lang].langStyleTypeErr));

  fs.writeFileSync(compFilePath, tpl);
  console.log(chalk.green(TEXT_KEY[lang].created(compFilePath)));

  // style 생성
  if (styleType === "css" || styleType === "scss") {
    const styleFilePath = makeStyleFilePath(compName, styleType, directory);

    if (exist(styleFilePath))
      return console.error(
        chalk.bold.red(TEXT_KEY[lang].exFile(styleFilePath))
      );

    const tpl = makeStyleTemplate(compName, styleType);

    if (!tpl) return console.error(chalk.bold.red(TEXT_KEY[lang].styleTypeErr));

    fs.writeFileSync(styleFilePath, tpl);
    console.log(chalk.green(TEXT_KEY[lang].created(styleFilePath)));
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

    let langtype = options.langtype || config.langType || LANGTYPE_DEFAULT;
    let styletype = options.styletype || config.styleType || STYLETYPE_DEFAULT;
    let directory = options.directory || config.directory || DIRECTORY_DEFAULT;

    console.log("compname:", chalk.hex("#7cddf7")(compname));
    console.log("langtype:", chalk.hex("#7cddf7")(langtype));
    console.log("styletype:", chalk.hex("#7cddf7")(styletype));
    console.log("directory:", chalk.hex("#7cddf7")(directory));
    createComp(compname, langtype, styletype, directory);
  });

program.parse(process.argv);
