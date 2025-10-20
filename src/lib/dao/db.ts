import logger from '$lib/logger';
import { PrismaClient } from '@prisma/client';

declare global {
	var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env['NODE_ENV'] === 'development') {
	global.prisma = prisma;
}

export const connectDB = async () => {
	try {
		await prisma.$connect();
		logger.info('Prisma connected to MongoDB');
	} catch (err) {
		logger.error('Failed to connect to database: ' + err);
		process.exit(1);
	}
};

export const disconnectDB = async () => {
	try {
		await prisma.$disconnect();
		logger.info('Prisma disconnected from MongoDB');
	} catch (err) {
		logger.error('Error disconnecting from database: ' + err);
	}
};
