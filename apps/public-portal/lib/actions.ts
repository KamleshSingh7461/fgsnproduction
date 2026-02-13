'use server';

import { prisma } from '@fgsn/database';
import { revalidatePath } from 'next/cache';

export async function getLiveMatches() {
    return await prisma.match.findMany({
        include: {
            teams: {
                include: { team: true }
            },
            tournament: true
        },
        orderBy: { startTime: 'desc' }
    });
}

export async function getMatchDetails(id: string) {
    return await prisma.match.findUnique({
        where: { id },
        include: {
            teams: {
                include: { team: true }
            },
            tournament: true,
            comments: {
                orderBy: { createdAt: 'desc' },
                take: 50
            }
        }
    });
}

export async function postComment(matchId: string, userName: string, content: string) {
    const comment = await prisma.comment.create({
        data: {
            matchId,
            userName,
            content
        }
    });
    revalidatePath(`/match/${matchId}`);
    return comment;
}
