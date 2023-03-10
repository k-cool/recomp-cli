export const template = {
  component: (compName) => `
// your custom component
export default function ${compName}() {
  return <div className="${compName}"></div>;
}
`,
  css: (compName) => `
  // your custom css
  .${compName} {}
  `,
};
