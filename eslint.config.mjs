
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default testlint.config(
{  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.url,
   },
    files:['**/*.ts'],
    extends:
    [
        eslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,
        eslintConfigPrettier
    ],
    rules:{
        "no-console":"error",
        qoutes:["error","single", {allowTemplateLiterals:true}],
    }
}}
);