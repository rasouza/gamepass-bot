const { createLogger, format, transports } = require('winston')
const logDnaWinston = require('logdna-winston');
const devFormat = require('winston-dev-format')

const { combine, timestamp, json, metadata, colorize } = format
const { Console } = transports

const isLocal = process.env.NODE_ENV === 'local'

const tty = new Console()
const logDNA = new logDnaWinston({
  key: process.env.LOGDNA_KEY,
  indexMeta: true,
  handleExceptions: true,
  app: 'gamepass-bot'
})

// Note: Order matters!
const defaultFormat = combine(
  metadata(),
  timestamp(),
  json()
)

const localFormat = combine(
  colorize(),
  devFormat()
)

module.exports = createLogger({
  transports: [tty, logDNA],
  exceptionHandlers: [tty],
  level: process.env.LOG_LEVEL || 'info',
  format: isLocal ? localFormat : defaultFormat
})
