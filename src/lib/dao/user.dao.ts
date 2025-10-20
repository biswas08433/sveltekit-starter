import type { Prisma, User } from '@prisma/client';
import { prisma } from './db';

export type CreateUserDto = Prisma.UserCreateInput;
export type UpdateUserDto = Prisma.UserUpdateInput;

export const createUserDao = async (data: CreateUserDto): Promise<User | null> => {
	const user = await prisma.user.create({
		data
	});

	return user;
};

export const findUserByIdDao = async (id: number): Promise<User | null> => {
	const user = await prisma.user.findUnique({
		where: { id }
	});

	return user;
};

export const findUserByEmailDao = async (email: string): Promise<User | null> => {
	const user = await prisma.user.findUnique({
		where: { email }
	});
	return user;
};

export const updateUserDao = async (id: number, updateData: UpdateUserDto): Promise<User> => {
	const user = await prisma.user.update({
		where: { id },
		data: updateData
	});

	return user;
};

export const deleteUserDao = async (id: number): Promise<User> => {
	const user = await prisma.user.delete({
		where: { id }
	});

	return user;
};
