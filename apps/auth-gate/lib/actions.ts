'use server';

import { prisma } from '@fgsn/database';

export async function login(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }

    // Generate a mock token (in production use JWT)
    const mockToken = Buffer.from(JSON.stringify({
        userId: user.id,
        role: user.role,
        name: user.name
    })).toString('base64');

    return {
        token: mockToken,
        role: user.role,
        name: user.name
    };
}
