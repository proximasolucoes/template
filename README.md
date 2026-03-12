# Saas - Agente Comercial

## Passo a Passo

Um breve Footprint de como foi desenvolvido a base deste projeto.

### 1. Inicializando o Projeto Next.js 15 (Sem TypeScript e Sem Tailwind 4)

```[bash]
pnpm create next-app@15 saas-agente-comercial \
  --javascript \
  --app \
  --src-dir \
  --turbopack \
  --import-alias "@/*" \
  --no-tailwind \
  --no-eslint

cd saas-agente-comercial
```

### 2. Configurando Tailwind CSS v3.4

```[bash]
pnpm add -D tailwindcss@^3.4.17 postcss@^8 autoprefixer@^10

pnpm exec tailwindcss init -p
```

### 3. Instalando o Arsenal de Qualidade (ESLint 9 + Plugins)

```[bash]
pnpm add -D eslint@^9.0.0 \
  @eslint/js \
  eslint-plugin-react \
  eslint-plugin-react-hooks \
  eslint-plugin-jsx-a11y \
  eslint-plugin-import \
  eslint-plugin-security \
  eslint-plugin-sonarjs \
  eslint-plugin-unicorn \
  eslint-plugin-jsdoc \
  eslint-plugin-no-secrets \
  @eslint/compat \
  globals
```

### 4. Criando o `eslint.config.js` (Flat Config)

```[javascript]
import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import noSecretsPlugin from 'eslint-plugin-no-secrets';
import { fixupPluginRules } from '@eslint/compat';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  securityPlugin.configs.recommended,
  sonarjsPlugin.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': fixupPluginRules(reactHooksPlugin),
      security: securityPlugin,
      sonarjs: sonarjsPlugin,
      unicorn: unicornPlugin,
      jsdoc: jsdocPlugin,
      'no-secrets': noSecretsPlugin,
    },
    rules: {
      // — Qualidade geral —
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // — Segurança —
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-possible-timing-attacks': 'error',
      'no-secrets/no-secrets': 'error',
      'sonarjs/no-hardcoded-passwords': 'error',

      // — Complexidade e manutenção —
      'sonarjs/cognitive-complexity': ['error', 15],
      'sonarjs/no-duplicate-string': ['error', { threshold: 3 }],
      'sonarjs/no-identical-functions': 'error',
      'complexity': ['error', 10],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['error', { max: 50 }],

      // — JSDoc obrigatório em funções exportadas —
      'jsdoc/require-jsdoc': ['error', {
        publicOnly: true,
        require: { FunctionDeclaration: true, ArrowFunctionExpression: true }
      }],
      'jsdoc/require-param': 'error',
      'jsdoc/require-returns': 'error',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-returns-type': 'error',

      // — React —
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // — Unicorn (boas práticas modernas) —
      'unicorn/no-array-for-each': 'error',
      'unicorn/prefer-module': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/no-null': 'warn',
      'unicorn/prevent-abbreviations': 'warn',
    },
  },
  {
    // Ignorar pastas de build e configuração nativa do Next
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'public/**'],
  }
];

```

## Configuração de Linting e Hooks do Git

### 1. Instalar Prettier, Lint-Staged e o Integrador

```[bash]
pnpm add -D prettier@^3.0.0 lint-staged@^15.0.0 eslint-config-prettier@^9.0.0
```

### 2. Atualizar o `eslint.config.js`

```[javascript]
// Adicione este import no topo do arquivo:
import eslintConfigPrettier from 'eslint-config-prettier';

// ... (resto dos seus imports)

export default [
  // ... (todas as configurações anteriores do passo passado)

  // Adicione esta linha como o ÚLTIMO item do array exportado:
  eslintConfigPrettier,
];
```

### 3. Configurar o Prettier

```[javascript]
/** @type {import("prettier").Config} */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
}
```

### 4. Configurar o `lint-staged`

Crie um arquivo `.lintstagedrc.js` na raiz.

```[javascript]
export default {
  // Para arquivos JS/JSX, roda o linter consertando o possível, depois formata
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write'
  ],
  // Para arquivos de configuração e markdown, apenas formata
  '*.{json,md}': [
    'prettier --write'
  ]
}
```

### 5. Inicializar e Configurar o Husky

```[bash]
pnpm add -D husky@^9.0.0
pnpm exec husky init
```

Isso criará uma pasta .husky/ com um arquivo chamado pre-commit. Abra esse arquivo .husky/pre-commit e substitua o conteúdo gerado por este:

```[bash]
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
```

E depois execute:

```[bash]
pnpm exec lint-staged
```

## Validação de Variáveis de Ambiente (Zod)

### 6. Instalar o Zod

```[bash]
pnpm add zod@^3.0.0
```

### 7. Criar a Fonte de Verdade (`src/env.js`)

```[javascript]
import { z } from 'zod'

/**
 * Schema para variáveis de ambiente do Servidor.
 * Estas chaves NUNCA chegam ao bundle do navegador.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // SUPABASE_SERVICE_ROLE_KEY: z.string().min(1), // Descomentaremos depois
})

/**
 * Schema para variáveis de ambiente do Cliente.
 * O Next.js exige o prefixo NEXT_PUBLIC_ para expor ao navegador.
 */
const clientSchema = z.object({
  // NEXT_PUBLIC_SUPABASE_URL: z.string().url(), // Descomentaremos depois
  // NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

const _serverEnv = serverSchema.safeParse(process.env)

// Rigor técnico: O Next.js substitui variáveis NEXT_PUBLIC_ em tempo de build
// via análise estática. Desestruturar process.env quebra isso.
// Por isso, precisamos mapear as chaves do cliente manualmente.
const _clientEnv = clientSchema.safeParse({
  // NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
})

if (!_serverEnv.success || !_clientEnv.success) {
  console.error('❌ Erro crítico: Variáveis de ambiente ausentes ou inválidas:')
  if (!_serverEnv.success) console.error(_serverEnv.error.format())
  if (!_clientEnv.success) console.error(_clientEnv.error.format())
  throw new Error('Falha na inicialização: Variáveis de ambiente inválidas.')
}

/**
 * Objeto central com todas as variáveis validadas.
 */
export const env = {
  ..._serverEnv.data,
  ..._clientEnv.data,
}
```
