'use server';

import { prisma } from '@fgsn/database';
import { revalidatePath } from 'next/cache';

export async function getAssignedMatchesForScorer(userId: string) {
    return await prisma.match.findMany({
        where: {
            scorers: {
                some: { userId }
            }
        },
        include: {
            tournament: true,
            teams: {
                include: { team: true },
                orderBy: { displayOrder: 'asc' }
            }
        },
        orderBy: { startTime: 'asc' }
    });
}
