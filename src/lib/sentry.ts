import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

export function startTransaction(name: string) {
  const transaction = Sentry.startTransaction({
    op: 'transaction',
    name
  })

  Sentry.configureScope((scope) => {
    scope.setSpan(transaction)
  })

  return transaction
}

export default Sentry
