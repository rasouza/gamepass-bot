import Sentry from 'config/sentry'
import messageHandler from 'handlers/message'
import readyHandler from 'handlers/ready'
import { client } from 'services/discord'

client.on('ready', readyHandler)
client.on('message', messageHandler)

process.on('unhandledRejection', (error) => {
  Sentry.captureException(error)
  throw error
})

process.on('uncaughtException', (error) => {
  Sentry.captureException(error)
  throw error
})
