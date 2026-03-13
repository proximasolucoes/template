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

const _serverEnvironment = serverSchema.safeParse(process.env)

// Mapeamento estático obrigatório para o Next.js
const _clientEnvironment = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
})

if (!_serverEnvironment.success || !_clientEnvironment.success) {
  console.error('Erro crítico: Variáveis de ambiente ausentes ou inválidas:')
  if (!_serverEnvironment.success) {
    console.error(_serverEnvironment.error.format())
  }
  if (!_clientEnvironment.success) {
    console.error(_clientEnvironment.error.format())
  }
  throw new Error('Falha na inicialização: Variáveis de ambiente inválidas.')
}

/**
 * Objeto central com todas as variáveis validadas.
 */
export const environment = {
  ..._serverEnvironment.data,
  ..._clientEnvironment.data,
}
