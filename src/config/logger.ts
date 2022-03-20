import winston from 'winston'

const { createLogger, format, transports } = winston
const { combine, timestamp, json, metadata } = format
const { Console } = transports

const logs: winston.transport[] = []

logs.push(new Console())

// Note: Order matters!
const defaultFormat = combine(metadata(), timestamp(), json())

export default createLogger({
  transports: logs,
  exceptionHandlers: logs,
  level: process.env.LOG_LEVEL || 'info',
  format: defaultFormat
})
