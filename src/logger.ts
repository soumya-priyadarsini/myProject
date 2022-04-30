import { createLogger, format, transports, LoggerOptions } from 'winston';

const defaultLevel = process.env.LOG_LEVEL || 'info';

const options: LoggerOptions = {
    exitOnError: false,
    level: defaultLevel,
    defaultMeta: { service: '[auth-api]' },
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()]
};

const logger = createLogger(options);

export default logger;
