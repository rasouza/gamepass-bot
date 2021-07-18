import winston from 'winston'
import LogDnaWinston from 'logdna-winston'
import devFormat from 'winston-dev-format'

const { createLogger, format, transports } = winston
const { combine, timestamp, json, metadata, colorize } = format
const { Console } = transports

const isLocal = process.env.NODE_ENV === 'local'

const tty = new Console()
const logDNA = new LogDnaWinston({
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

export default createLogger({
  transports: [tty, logDNA],
  exceptionHandlers: [tty],
  level: process.env.LOG_LEVEL || 'info',
  format: isLocal ? localFormat : defaultFormat
})
