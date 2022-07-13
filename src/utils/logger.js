import winston from 'winston';
const { combine, timestamp, printf, colorize } = winston.format;

const infoFilter = winston.format((info, opts) => {
  return info.level === 'info' ? info : false;
});

const warnFilter = winston.format((info, opts) => {
  return info.level === 'warn' ? info : false;
});

const errorFilter = winston.format((info, opts) => {
  return info.level === 'error' ? info : false;
});

const { LOG_LEVEL: logLevel } = import('../../config.js');

export default winston.createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    printf((msg) => `[${msg.timestamp}] ${msg.level.toUpperCase()}: ${msg.message}`)
  ),
  transports: [
    new winston.transports.Console({
      level: logLevel,
      format: colorize({ all: true }),
    }),
    // new winston.transports.File({
    //   level: 'info',
    //   filename: `${process.cwd()}/logs/info.log`,
    //   format: combine(infoFilter()),
    //   maxsize: 5120000,
    //   maxFiles: 3,
    //   tailable: true,
    // }),
    new winston.transports.File({
      level: 'warn',
      format: combine(warnFilter()),
      filename: `${process.cwd()}/logs/warn.log`,
      maxsize: 5120000,
      maxFiles: 3,
      tailable: true,
    }),
    new winston.transports.File({
      level: 'error',
      format: combine(errorFilter()),
      filename: `${process.cwd()}/logs/error.log`,
      maxsize: 5120000,
      maxFiles: 3,
      tailable: true,
    }),
  ],
});
