import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

/**
 * Schema para variáveis de ambiente do Cliente.
 * O Next.js exige o prefixo NEXT_PUBLIC_ para expor ao navegador.
 */
const clientSchema = z.object({
  // NEXT_PUBLIC_SUPABASE_URL: z.string().url(), // Descomentaremos depois
  // NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const _serverEnv = serverSchema.safeParse(process.env);

const _clientEnv = clientSchema.safeParse({
  // NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
});

if (!_serverEnv.success || !_clientEnv.success) {
  console.error("Erro crítico: Variáveis de ambiente ausentes ou inválidas:");
  if (!_serverEnv.success) console.error(_serverEnv.error.format());
  if (!_clientEnv.success) console.error(_clientEnv.error.format());
  throw new Error("Falha na inicialização: Variáveis de ambiente inválidas.");
}

export const env = {
  ..._serverEnv.data,
  ..._clientEnv.data,
};
