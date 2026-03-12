import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { env as environment } from '../../environment.js'

/**
 * Cria uma instância do Supabase configurada para rodar no Servidor (Node.js).
 * Interage com a sessão do usuário lendo e gravando cookies.
 * @returns {Promise<import('@supabase/supabase-js').SupabaseClient>} Instância autenticada do Supabase
 */
export const createClient = async () => {
  // No Next.js 15, cookies() é assíncrono!
  const cookieStore = await cookies()

  return createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
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
    },
  )
}
