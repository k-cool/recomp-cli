#!/usr/bin/env node --no-warnings

import fs from "fs";
import path from "path";
import packageInfo from "../package.json" assert { type: "json" };
// dependancy
import { program } from "commander";
import chalk from "chalk";
import templateFunc from "./templateFunc.js";
import {
  CSSTYPE_DEFAULT,
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
  console.log(dir);
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

const makeFilePath = (compName, langType, directory) => {
  return langType === "js"
    ? path.join(directory, `${compName}.jsx`)
    : path.join(directory, `${compName}.tsx`);
};

const makeTemplate = (compName, langType, css) => {
  const method = langType + css;
  if (!templateFunc[method]) return false;
  return templateFunc[method](compName);
};

const createComp = (compName, langType, css, directory) => {
  mkdir(directory);

  if (langType !== "js" && langType !== "ts")
    return console.error(
      chalk.bold.red("타입은 html, express-router 중 하나입니다.")
    );

  const filePath = makeFilePath(compName, langType, directory);

  if (exist(filePath))
    console.error(chalk.bold.red("이미 해당 파일이 존재합니다."));
  else {
    const tpl = makeTemplate(compName, langType, css);

    if (!tpl)
      return console.error(chalk.bold.red("올바른 css 타입을 넣어주세요"));

    fs.writeFileSync(filePath, tpl);
    console.log(chalk.green(filePath, "생성완료"));
  }
};

program //
  .version(`${packageInfo.version}`, "-v, --version")
  .name("recomp");

program
  .command("create <compname>")
  .usage(
    "<compname> --langtype [langype] --csstype [csstype] --directory [directory] "
  )
  .description("컴포넌트를 생성합니다.")
  .option(
    "-l, --langtype [langype]",
    "사용하는 언어 타입(js, ts)을 입력하세요."
  )
  .option("-c, --csstype [csstype]", "사용하는 css 타입을 입력하세요.")
  .option("-d --directory [directory]", "생성할 디렉토리 경로를 입력하세요")
  .action((compname, options) => {
    if (!/^[A-Z]/.test(compname))
      return console.error(
        chalk.bold.red("컴포넌트의 이름은 대문자로 시작해야 합니다.")
      );

    let langtype;
    let csstype;
    let directory;

    if (exist("./recomp.config.json")) {
      const config = JSON.parse(
        fs.readFileSync("./recomp.config.json").toString()
      );

      langtype = config.langtype || LANGTYPE_DEFAULT;
      csstype = config.csstype || CSSTYPE_DEFAULT;
      directory = config.directory || DIRECTORY_DEFAULT;
    }

    langtype = options.langtype || langtype;
    csstype = options.csstype || csstype;
    directory = options.directory || directory;

    createComp(compname, langtype, csstype, directory);
  });

program.parse(process.argv);
