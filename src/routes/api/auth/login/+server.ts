import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { findUserByEmailDao } from '$lib/dao/user.dao';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET || 'your-secret-key';

export async function POST({ request }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		const user = await findUserByEmailDao(email);

		if (!user || !(await Bun.password.verify(password, user.password))) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		const token = jwt.sign(
			{
				userId: user.id
			},
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

		return json({
			token
		});
	} catch (error) {
		console.error('Login error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
