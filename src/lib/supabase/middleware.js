import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { env as environment } from '../../environment.js'

/**
 * Atualiza a sessão do usuário interceptando a requisição na Edge.
 * Deve ser chamado de dentro do arquivo src/middleware.js raiz.
 * @param {import('next/server').NextRequest} request - Requisição original
 * @returns {Promise<import('next/server').NextResponse>} Resposta com cookies atualizados
 */
export const updateSession = async (request) => {
  // Cria uma resposta base que podemos mutar
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Atualiza os cookies na requisição (para que Server Components vejam a nova sessão)
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }

          // Clona a resposta e injeta os novos cookies para enviar ao navegador
          supabaseResponse = NextResponse.next({ request })

          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        },
      },
    },
  )

  // Esta chamada é crucial: ela aciona a lógica interna do Supabase
  // que verifica a validade do token e faz o refresh se necessário.
  await supabase.auth.getUser()

  return supabaseResponse
}
