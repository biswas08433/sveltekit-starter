import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { createUserDao, findUserByEmailDao } from '$lib/dao/user.dao';

const JWT_SECRET = env.JWT_SECRET || 'your-secret-key';

export async function POST({ request }) {
	try {
		const { email, password } = await request.json();

		if (!email || !password) {
			return json({ error: 'Email and password are required' }, { status: 400 });
		}

		const existingUser = await findUserByEmailDao(email);
		if (existingUser) {
			return json({ error: 'Email already exists' }, { status: 409 });
		}

		const newUser = await createUserDao({
			email,
			password: await Bun.password.hash(password)
		});

		if (!newUser) {
			return json({ error: 'Failed to create user' }, { status: 500 });
		}

		const token = jwt.sign(
			{
				userId: newUser.id
			},
			JWT_SECRET,
			{ expiresIn: '24h' }
		);

		return json({
			token
		});
	} catch (error) {
		console.error('Register error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}
