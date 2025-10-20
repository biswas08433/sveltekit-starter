import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { findUserByIdDao } from '$lib/dao/user.dao';
import { env } from '$env/dynamic/private';
import logger from '$lib/logger';

const JWT_SECRET = env.JWT_SECRET || 'your-secret-key';

export const handle: Handle = async ({ event, resolve }) => {
	logger.info(`REQ: ${event.request.method} ${event.url.pathname}`);

	const token = event.cookies.get('auth_token');
	if (token) {
		try {
			const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
			const user = await findUserByIdDao(payload.userId);

			if (user) {
				event.locals.user = {
					id: user.id
				};
			}
		} catch (error) {
			logger.error('Error verifying JWT token: ' + error);
			event.cookies.delete('auth_token', { path: '/' });
		}
	}
	const response = await resolve(event);
	logger.info(`RES: ${event.request.method} ${event.url.pathname} - ${response.status}`);
	return response;
};
