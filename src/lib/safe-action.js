import { createSafeActionClient } from "next-safe-action";
import * as Sentry from "@sentry/nextjs";
import { logger } from "./logger.js";

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
    logger.error(
      {
        err: e,
        message: e.message,
        stack: e.stack,
        context: "ServerActionError",
      },
      "Erro não tratado capturado na Server Action",
    );

    // 2. Reporta para as autoridades (Sentry)
    Sentry.captureException(e);

    // 3. Resposta mascarada (O que o cliente vê)
    // Se for um erro específico nosso (ex: custom throw), podemos verificar instâncias aqui depois.
    return "Ocorreu um erro interno ao processar sua solicitação. Nossa equipe já foi notificada.";
  },
});
