# Template

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
pnpm exec lint-staged
```

Adiciona ao objeto raiz do `package.json`:

```[json]
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "vitest related --run"
    ]
  }
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
 * NUNCA vazam para o navegador.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // Supabase Service Role (Apenas para tarefas administrativas de super-admin, NUNCA usar em ações de tenant)
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  // Sentry DSN para logs de erro
  SENTRY_DSN: z.string().url().optional(),
})

/**
 * Schema para variáveis de ambiente do Cliente.
 * Prefixadas com NEXT_PUBLIC_ para o Next.js injetar no bundle.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
})

const _serverEnv = serverSchema.safeParse(process.env)

// Mapeamento estático obrigatório para o Next.js
const _clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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

## Configurando o sistema de interceptação de erros globais

### 1. Instalando o Ecossistema de Logs e Ações

```[bash]
pnpm add pino@^9.0.0 next-safe-action@^7.0.0 @sentry/nextjs@^8.0.0
pnpm add -D pino-pretty@^11.0.0
```

### 2. Criando o Logger Estruturado (Pino)

Crie o arquivo `src/lib/logger.js`:

```[javascript]
import pino from 'pino'
import { env } from '../env.js'

/**
 * Configuração do stream do logger baseada no ambiente.
 * Em desenvolvimento, usa o pino-pretty para legibilidade.
 * Em produção, escreve JSON puro em stdout (mais rápido e estruturado).
 * @type {import('pino').LoggerOptions | import('pino').DestinationStream}
 */
const streamConfig =
  env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'HH:MM:ss Z',
          },
        },
      }
    : {}

/**
 * Instância global do logger da aplicação.
 * Deve ser utilizada em vez do console.log para qualquer registro no backend.
 * * @type {import('pino').Logger}
 */
export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: ['req.headers.authorization', 'password', 'token', 'apiKey'], // Proteção contra vazamento
  ...streamConfig,
})
```

### 3. Configurando o Interceptador Global (Safe Action)

Crie o arquivo `src/lib/safe-action.js`:

```[javascript]
import { createSafeActionClient } from 'next-safe-action'
import * as Sentry from '@sentry/nextjs'
import { logger } from './logger.js'

/**
 * Cliente seguro base para todas as Server Actions da aplicação.
 * Intercepta erros globais, loga via Pino, reporta ao Sentry e devolve
 * uma mensagem genérica para o frontend, ocultando detalhes de infraestrutura.
 * * @type {import('next-safe-action').SafeActionClient}
 */
export const actionClient = createSafeActionClient({
  /**
   * Handler global interceptador de erros não tratados.
   * Executa sempre que uma action lança uma exceção (throw Error).
   * * @param {Error} e - O erro capturado na action
   * @returns {string} Mensagem segura para ser exibida na UI
   */
  handleServerError: (e) => {
    // 1. Log detalhado no servidor (invisível para o cliente)
    logger.error({
      err: e,
      message: e.message,
      stack: e.stack,
      context: 'ServerActionError'
    }, 'Erro não tratado capturado na Server Action')

    // 2. Reporta para as autoridades (Sentry)
    Sentry.captureException(e)

    // 3. Resposta mascarada (O que o cliente vê)
    // Se for um erro específico nosso (ex: custom throw), podemos verificar instâncias aqui depois.
    return 'Ocorreu um erro interno ao processar sua solicitação. Nossa equipe já foi notificada.'
  },
})
```

## Configura Supabase

### 1. Instalação dos SDKs do Supabase

Utilizaremos o pacote oficial de SSR (Server-Side Rendering) que gerencia automaticamente a conversão de cookies entre o navegador e o servidor.

```[bash]
pnpm add @supabase/supabase-js@^2.45.0 @supabase/ssr@^0.5.0
```

### 2. Criar os Clientes SSR (`src/lib/supabase/`)

Este arquivo será usado em Server Components, Route Handlers e Server Actions.

Crie `src/lib/supabase/server.js`

```[javascript]
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env } from '../../env.js'

/**
 * Cria uma instância do Supabase configurada para rodar no Servidor (Node.js).
 * Interage com a sessão do usuário lendo e gravando cookies.
 * * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} Instância autenticada do Supabase
 */
export const createClient = async () => {
  // No Next.js 15, cookies() é assíncrono!
  const cookieStore = await cookies()

  return createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      /**
       * Lê todos os cookies da requisição.
       * @returns {import('@supabase/ssr').Cookie[]}
       */
      getAll() {
        return cookieStore.getAll()
      },
      /**
       * Define múltiplos cookies na resposta.
       * @param {import('@supabase/ssr').Cookie[]} cookiesToSet - Array de cookies a serem definidos
       */
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // O método setAll pode ser chamado de dentro de um Server Component.
          // Se isso ocorrer, o Next.js lança um erro silencioso, pois Server Components
          // não podem mutar headers. O middleware irá capturar e tratar a atualização do cookie.
        }
      },
    },
  })
}
```

### 3. O Cliente de Navegador (`client.js`)

Usado apenas quando você precisa interagir com o banco diretamente de um componente marcado com `"use client"`.

Crie `src/lib/supabase/client.js`

```[javascript]
import { createBrowserClient } from '@supabase/ssr'
import { env } from '../../env.js'

/**
 * Cria uma instância do Supabase configurada para rodar no Cliente (Navegador).
 * Utiliza variáveis de ambiente expostas (NEXT_PUBLIC_).
 * * @returns {import('@supabase/supabase-js').SupabaseClient} Instância pública do Supabase
 */
export const createClient = () => {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
```

### 4. O Cliente de Middleware (`middleware.js`)

Este é vital para manter a sessão ativa (refresh token) e impedir que usuários deslogados acessem rotas protegidas antes de a página renderizar.

Crie `src/lib/supabase/middleware.js`.

```[javascript]

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { env } from '../../env.js'

/**
 * Atualiza a sessão do usuário interceptando a requisição na Edge.
 * Deve ser chamado de dentro do arquivo src/middleware.js raiz.
 * * @param {import('next/server').NextRequest} request - Requisição original
 * @returns {Promise<import('next/server').NextResponse>} Resposta com cookies atualizados
 */
export const updateSession = async (request) => {
  // Cria uma resposta base que podemos mutar
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        // Atualiza os cookies na requisição (para que Server Components vejam a nova sessão)
        for (const { name, value, options } of cookiesToSet) {
          request.cookies.set(name, value)
        }

        // Clona a resposta e injeta os novos cookies para enviar ao navegador
        supabaseResponse = NextResponse.next({ request })

        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options)
        }
      },
    },
  })

  // Esta chamada é crucial: ela aciona a lógica interna do Supabase
  // que verifica a validade do token e faz o refresh se necessário.
  await supabase.auth.getUser()

  return supabaseResponse
}

```

## Criar o arquivo de Refresh de rotas `src/middleware.js`

```[javascript]
import { updateSession } from './lib/supabase/middleware.js'

/**
 * Interceptador de Fronteira (Proxy / Middleware).
 * Atua antes que a requisição chegue ao Next.js Router.
 * @param {import('next/server').NextRequest} request - Requisição entrante
 * @returns {Promise<import('next/server').NextResponse>} Resposta mutada com cookies de sessão atualizados
 */
export async function middleware(request) {
  return await updateSession(request)
}

/**
 * Configuração de rotas alvo.
 * Otimiza a performance ao evitar o bloqueio em requisições de assets estáticos.
 */
export const config = {
  matcher: [
    /*
     * Intercepta tudo, EXCETO requisições que deem match com:
     * - _next/static (arquivos JavaScript e CSS gerados no build)
     * - _next/image (imagens processadas sob demanda)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Padrões de extensões de arquivo finais (.svg, .png, .jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```
