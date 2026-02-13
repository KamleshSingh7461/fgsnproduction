'use server';

import { prisma } from '@fgsn/database';

export async function getScorerRole(matchId: string, userId: string) {
    const assignment = await prisma.userMatchAssignment.findUnique({
        where: {
            userId_matchId: { userId, matchId }
        }
    });

    return assignment?.role || null;
}

export async function getMatchMetadata(matchId: string) {
    return await (prisma.match as any).findUnique({
        where: { id: matchId },
        select: {
            id: true,
            sport: true,
            venue: true,
            startTime: true,
            liveData: true,
            tournament: {
                select: { name: true }
            },
            teams: {
                select: {
                    slotLabel: true,
                    team: {
                        select: {
                            id: true,
                            name: true,
                            shortName: true,
                            players: true
                        }
                    }
                }
            }
        }
    });
}
