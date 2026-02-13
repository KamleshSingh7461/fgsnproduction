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
export async function getAllMatches() {
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

export async function getTournaments() {
    return await prisma.tournament.findMany({
        include: {
            matches: true,
            teams: true
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getTournamentDetails(id: string) {
    return await prisma.tournament.findUnique({
        where: { id },
        include: {
            matches: {
                include: {
                    teams: {
                        include: { team: true }
                    }
                },
                orderBy: { startTime: 'desc' }
            },
            teams: {
                include: { team: true }
            }
        }
    });
}

export async function submitContactRequest(data: {
    name: string;
    email: string;
    phone?: string;
    organization?: string;
    message: string;
}) {
    // Validate inputs (basic check)
    if (!data.name || !data.email || !data.message) {
        throw new Error("Missing required fields");
    }

    return await prisma.contactRequest.create({
        data: {
            ...data,
            status: 'PENDING'
        }
    });
}
