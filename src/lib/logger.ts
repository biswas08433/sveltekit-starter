import { env } from '$env/dynamic/private';
import pino, { type Logger } from 'pino';

// Create a shared logger instance
const logger: Logger = pino({
	level: env.LOG_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:standard',
			ignore: 'pid,hostname'
		}
	}
});

export default logger;
