import { format, createLogger, transports } from 'winston';

const { timestamp, combine, errors, printf } = format;

const logFormat = printf(
  ({ level, timestamp, message, stack }) =>
    `${timestamp}  ${level}  ${message || stack}`,
);

const loghelper = createLogger({
  format: combine(
    timestamp(),
    errors({ stack: true }),
    logFormat,
    format.colorize(),
  ),
  transports: [
    new transports.File({ filename: 'logs/complete.log' }),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

const logHandler = {
  error(level, message) {
    loghelper.error({ level, message });
  },
  log(level, message) {
    loghelper.log({ level, message });
  },
};

export const logger = logHandler;
