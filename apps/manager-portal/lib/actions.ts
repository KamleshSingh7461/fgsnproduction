'use server';

import { prisma } from '@fgsn/database';
import { revalidatePath } from 'next/cache';

// --- Tournament Actions (Restricted to Managed) ---

export async function getManagedTournaments(userId: string) {
    return await prisma.tournament.findMany({
        where: {
            managers: {
                some: { userId }
            }
        },
        include: {
            managers: {
                include: { user: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

// --- Team Actions ---

export async function createTeamAndEnlist(tournamentId: string, name: string, shortName?: string) {
    const team = await prisma.team.create({
        data: { name, shortName }
    });

    await prisma.tournamentTeam.create({
        data: {
            tournamentId,
            teamId: team.id
        }
    });

    revalidatePath('/');
    return team;
}

export async function addTeamToTournament(tournamentId: string, teamId: string) {
    await prisma.tournamentTeam.upsert({
        where: { tournamentId_teamId: { tournamentId, teamId } },
        create: { tournamentId, teamId },
        update: {}
    });
    revalidatePath('/');
}

export async function removeTeamFromTournament(tournamentId: string, teamId: string) {
    await prisma.tournamentTeam.delete({
        where: { tournamentId_teamId: { tournamentId, teamId } }
    });
    revalidatePath('/');
}

export async function getTournamentTeams(tournamentId: string) {
    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        select: { sport: true }
    });

    return await prisma.team.findMany({
        where: {
            tournaments: {
                some: { tournamentId }
            }
        },
        include: {
            players: {
                where: {
                    sport: tournament?.sport || 'General'
                }
            }
        }
    });
}

export async function getGlobalTeams() {
    return await prisma.team.findMany({
        include: { players: true },
        orderBy: { name: 'asc' }
    });
}

// --- Player Actions ---

export async function createPlayerForTeam(teamId: string, name: string, sport: string = 'General') {
    const player = await prisma.player.create({
        data: { name, teamId, sport }
    });
    revalidatePath('/');
    return player;
}

// --- Match Actions ---

export async function createMatch(formData: FormData) {
    const sport = formData.get('sport') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const venue = formData.get('venue') as string;
    const startTime = formData.get('startTime') as string;
    const teamIdsStr = formData.get('teamIds') as string;
    const homeTeamId = formData.get('homeTeamId') as string;
    const awayTeamId = formData.get('awayTeamId') as string;

    let teamIds: string[] = [];
    if (teamIdsStr) {
        teamIds = teamIdsStr.split(',').map(id => id.trim()).filter(id => !!id);
    } else if (homeTeamId && awayTeamId) {
        teamIds = [homeTeamId, awayTeamId];
    }

    if (!sport || !tournamentId || teamIds.length < 1) return;

    const liveData = JSON.stringify({
        sport,
        scoreSummary: teamIds.reduce((acc, _, i) => ({ ...acc, [`t${i}`]: "0" }), {}),
        liveData: {}
    });

    const streamUrl = formData.get('streamUrl') as string;

    await prisma.match.create({
        data: {
            sport,
            tournamentId,
            venue,
            startTime: new Date(startTime),
            status: 'scheduled',
            streamUrl: streamUrl || null,
            teams: {
                create: teamIds.map((teamId, index) => ({
                    teamId,
                    displayOrder: index,
                    slotLabel: index === 0 ? 'Home' : index === 1 ? 'Away' : `Contender ${index + 1}`
                }))
            },
            liveData
        }
    });

    revalidatePath('/');
}

export async function getMatchesByTournament(tournamentId: string) {
    return await prisma.match.findMany({
        where: { tournamentId },
        include: {
            teams: {
                include: { team: true },
                orderBy: { displayOrder: 'asc' }
            },
            scorers: {
                include: { user: true }
            }
        },
        orderBy: { startTime: 'asc' }
    });
}

export async function updateMatchStream(matchId: string, streamUrl: string) {
    await prisma.match.update({
        where: { id: matchId },
        data: { streamUrl: streamUrl || null }
    });
    revalidatePath('/');
}

// --- Scorer & Assignment Actions ---

export async function getScorers() {
    return await prisma.user.findMany({
        where: { role: 'SCORER' },
        orderBy: { name: 'asc' }
    });
}

export async function assignScorerToMatch(matchId: string, userId: string, role: string = 'SCORER') {
    if (!userId) {
        return;
    }
    await prisma.userMatchAssignment.upsert({
        where: { userId_matchId: { userId, matchId } },
        update: { role },
        create: { userId, matchId, role }
    });
    revalidatePath('/');
}

function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function createScorerAndAssign(matchId: string, name: string, email: string, role: string = 'SCORER') {
    const password = generatePassword();
    const user = await prisma.user.create({
        data: { name, email, password, role: 'SCORER' }
    });
    await prisma.userMatchAssignment.create({
        data: { userId: user.id, matchId, role }
    });
    revalidatePath('/');
    return { name, email, password };
}
