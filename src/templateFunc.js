export const jsemotion = (compName) => {
  const lowercase = compName[0].toLowerCase() + compName.slice(1);

  return `
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

export default function ${compName}() {
  return <div css={${lowercase}Css}></div>;
}

const ${lowercase}Css = css\`\`;
`;
};

export const tsemotion = (compName) => {
  const lowercase = compName[0].toLowerCase() + compName.slice(1);

  return `
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, css } from "@emotion/react";

interface ${compName}Props {}

export default function ${compName}({}:${compName}Props) {
  return <div css={${lowercase}Css}></div>;
}

const ${lowercase}Css = css\`\`;
`;
};

const templateFunc = {
  jsemotion,
  tsemotion,
};

export default templateFunc;
