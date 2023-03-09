export const jscss = (compName) => {
  return `import React from "react";
import './${compName}.css'

export default function ${compName}() {
  return <div className="${compName}"></div>;
}
`;
};

export const tscss = (compName) => {
  return `import React from "react";
import './${compName}.css'

interface ${compName}Props {}

export default function ${compName}({}:${compName}Props) {
  return <div className="${compName}"></div>;
}
`;
};

export const css = (compName) => `.${compName} {}`;

export const jsemotion = (compName) => {
  const lowercase = compName[0].toLowerCase() + compName.slice(1);

  return `/** @jsxRuntime classic */
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

  return `/** @jsxRuntime classic */
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
  css,
  jscss,
  tscss,
  jsemotion,
  tsemotion,
};

export default templateFunc;
