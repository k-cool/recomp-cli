#!/usr/bin/env node --no-warnings

import fs from "fs";
import path from "path";
import packageInfo from "../package.json" assert { type: "json" };
// dependancy
import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import templateFunc from "./templateFunc.js";

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

const makeFilePath = (type, compName, directory) => {
  return type === "js"
    ? path.join(directory, `${compName}.jsx`)
    : path.join(directory, `${compName}.tsx`);
};

const makeTemplate = (type, compName, css) => {
  const method = type + css;
  if (!templateFunc[method]) return false;
  return templateFunc[method](compName);
};

const createComp = (type, compName, css, directory) => {
  mkdir(directory);

  if (type !== "js" && type !== "ts")
    return console.error(
      chalk.bold.red("타입은 html, express-router 중 하나입니다.")
    );

  const filePath = makeFilePath(type, compName, directory);

  if (exist(filePath))
    console.error(chalk.bold.red("이미 해당 파일이 존재합니다."));
  else {
    const tpl = makeTemplate(type, compName, css);

    if (!tpl)
      return console.error(chalk.bold.red("올바른 css 타입을 넣어주세요"));

    fs.writeFileSync(filePath, tpl);
    console.log(chalk.green(filePath, "생성완료"));
  }
};

// createComp(type, compName, directory);

program //
  .version(`${packageInfo.version}`, "-v, --version")
  .name("recomp");

program
  .command("create <type> <compname>")
  .usage("<type> <compname> --csstype [csstype] --directory [directory]")
  .description("컴포넌트를 생성합니다.")
  .option(
    "-c, --csstype [csstype]",
    "사용하는 css 타입을 입력하세요.",
    "emotion"
  )
  .option(
    "-d --directory [directory]",
    "생성할 디렉토리 경로를 입력하세요",
    "."
  )
  .action((type, compname, options) => {
    console.log(type, compname, options);
    const { csstype, directory } = options;
    createComp(type, compname, csstype, directory);
  });

program.parse(process.argv);
