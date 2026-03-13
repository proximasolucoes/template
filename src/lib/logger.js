import pino from 'pino'
import { env as environment } from '../environment.js'

/**
 * Configuração do stream do logger baseada no ambiente.
 * Em desenvolvimento, usa o pino-pretty para legibilidade.
 * Em produção, escreve JSON puro em stdout (mais rápido e estruturado).
 * @type {import('pino').LoggerOptions | import('pino').DestinationStream}
 */

const streamConfig =
  environment.NODE_ENV === 'development'
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
 * @type {import('pino').Logger}
 */
export const logger = pino({
  level: environment.NODE_ENV === 'development' ? 'debug' : 'info',
  redact: ['req.headers.authorization', 'password', 'token', 'apiKey'], // Proteção contra vazamento
  ...streamConfig,
})
