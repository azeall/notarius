import { defineConfig, globalIgnores } from 'eslint/config'
import { fixupConfigRules } from '@eslint/compat'
import * as espree from 'espree'
import nextVitals from 'eslint-config-next/core-web-vitals'

export default defineConfig([
  ...fixupConfigRules(nextVitals),
  // Next's Babel parser still uses the ESLint 9 scope API; standard JS uses Espree.
  { files: ['**/*.{js,jsx,mjs,cjs}'], languageOptions: { parser: espree } },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts']),
])
