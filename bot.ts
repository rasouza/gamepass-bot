
import messageHandler from './src/handlers/message'
import readyHandler from './src/handlers/ready'

import dotenv from 'dotenv'
dotenv.config()

import Sentry from './src/config/sentry' // eslint-disable-line import/first
import { client } from './src/services/discord'// eslint-disable-line import/first

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
