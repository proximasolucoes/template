import { updateSession } from './lib/supabase/middleware.js'

/**
 * Interceptador de Fronteira (Proxy / Middleware).
 * Atua antes que a requisição chegue ao Next.js Router.
 * @param {import('next/server').NextRequest} request - Requisição entrante
 * @returns {Promise<import('next/server').NextResponse>} Resposta mutada com cookies de sessão atualizados
 */
export async function middleware(request) {
  // ⚠️ IMPORTANTE: Mude o nome da função para 'middleware' se mantiver o Next.js 15
  // A catraca de autenticação: intercepta e faz o refresh automático do JWT do Supabase
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
