import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,
  {
    ignores: ["birthday_gift/**", "portofolio/**", ".next/**", "out/**"],
  },
];

export default eslintConfig;
