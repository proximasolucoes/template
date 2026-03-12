import { createBrowserClient } from '@supabase/ssr'
import { env as environment } from '../../environment.js'

/**
 * Cria uma instância do Supabase configurada para rodar no Cliente (Navegador).
 * Utiliza variáveis de ambiente expostas (NEXT_PUBLIC_).
 * @returns {import('@supabase/supabase-js').SupabaseClient} Instância pública do Supabase
 */
export const createClient = () => {
  return createBrowserClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )
}
