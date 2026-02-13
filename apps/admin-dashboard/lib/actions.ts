'use server';

import { prisma } from '@fgsn/database';
import { revalidatePath } from 'next/cache';

export async function createTournament(formData: FormData) {
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const sport = formData.get('sport') as string;
    const location = formData.get('location') as string;

    if (!name) return;

    await prisma.tournament.create({
        data: {
            name,
            category: category || 'General',
            sport: sport || 'football',
            location
        }
    });

    revalidatePath('/tournaments');
}

export async function deleteTournament(id: string) {
    await prisma.tournament.delete({
        where: { id }
    });
    revalidatePath('/tournaments');
}

export async function getTournaments() {
    return await prisma.tournament.findMany({
        include: {
            managers: {
                include: { user: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

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
        }
    });
}

// --- Team Actions ---

export async function createTeam(formData: FormData) {
    const name = formData.get('name') as string;
    const shortName = formData.get('shortName') as string;

    if (!name) return;

    await prisma.team.create({
        data: { name, shortName }
    });

    revalidatePath('/teams');
}

export async function getTeams() {
    return await prisma.team.findMany({
        include: { players: true },
        orderBy: { name: 'asc' }
    });
}

export async function deleteTeam(id: string) {
    await prisma.team.delete({ where: { id } });
    revalidatePath('/teams');
}

// --- Player Actions ---

export async function createPlayer(formData: FormData) {
    const name = formData.get('name') as string;
    const teamId = formData.get('teamId') as string;
    const sport = formData.get('sport') as string;

    if (!name || !teamId) return;

    await prisma.player.create({
        data: {
            name,
            teamId,
            sport: sport || 'General'
        }
    });

    revalidatePath('/players');
    revalidatePath('/teams');
}

export async function getPlayers() {
    return await prisma.player.findMany({
        include: { team: true },
        orderBy: { name: 'asc' }
    });
}

// --- Match Actions ---

export async function createMatch(formData: FormData) {
    const sport = formData.get('sport') as string;
    const tournamentId = formData.get('tournamentId') as string;
    const venue = formData.get('venue') as string;
    const startTime = formData.get('startTime') as string;

    // Support both old home/away and new generic list (transition)
    const homeTeamId = formData.get('homeTeamId') as string;
    const awayTeamId = formData.get('awayTeamId') as string;
    const teamIdsStr = formData.get('teamIds') as string;

    let teamIds: string[] = [];
    if (teamIdsStr) {
        teamIds = teamIdsStr.split(',').map(id => id.trim()).filter(id => !!id);
    } else if (homeTeamId && awayTeamId) {
        teamIds = [homeTeamId, awayTeamId];
    }

    if (!sport || !tournamentId || teamIds.length < 1) return;

    // Basic initial state based on sport
    const liveData = JSON.stringify({
        sport,
        scoreSummary: teamIds.reduce((acc, _, i) => ({ ...acc, [`t${i}`]: "0" }), {}),
        liveData: {}
    });

    await prisma.match.create({
        data: {
            sport,
            tournamentId,
            venue,
            startTime: new Date(startTime),
            status: 'scheduled',
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
    revalidatePath('/manager');
}

export async function getMatches() {
    return await prisma.match.findMany({
        include: {
            tournament: true,
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

export async function getStats() {
    const [tournamentsCount, teamsCount, liveMatchesCount, tournaments, teams] = await Promise.all([
        prisma.tournament.count(),
        prisma.team.count(),
        prisma.match.count({ where: { status: 'live' } }),
        prisma.tournament.findMany({ select: { id: true, name: true } }),
        prisma.team.findMany({ select: { id: true, name: true } })
    ]);

    return {
        tournaments: tournamentsCount,
        teams: teamsCount,
        liveMatches: liveMatchesCount,
        tournaments_list: tournaments,
        teams_list: teams
    };
}
// --- User Actions ---

export async function getUsers() {
    return await prisma.user.findMany({
        orderBy: { role: 'asc' }
    });
}

export async function getScorers() {
    return await prisma.user.findMany({
        where: { role: 'SCORER' },
        orderBy: { name: 'asc' }
    });
}

export async function createUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;

    if (!email || !password || !role) return;

    await prisma.user.create({
        data: { email, password, name, role }
    });

    revalidatePath('/users');
}

export async function deleteUser(id: string) {
    // Delete related assignments first to avoid constraint violations
    // Use deleteMany for the user as well to make the operation idempotent
    await prisma.$transaction([
        prisma.userTournamentAssignment.deleteMany({ where: { userId: id } }),
        prisma.userMatchAssignment.deleteMany({ where: { userId: id } }),
        prisma.user.deleteMany({ where: { id } })
    ]);
    revalidatePath('/users');
}

// --- Assignment Actions ---

export async function assignManagerToTournament(tournamentId: string, userId: string) {
    await prisma.userTournamentAssignment.upsert({
        where: { userId_tournamentId: { userId, tournamentId } },
        update: { role: 'MANAGER' },
        create: { userId, tournamentId, role: 'MANAGER' }
    });
    revalidatePath('/tournaments');
}

export async function assignScorerToMatch(matchId: string, userId: string, role: string = 'SCORER') {
    await prisma.userMatchAssignment.upsert({
        where: { userId_matchId: { userId, matchId } },
        update: { role },
        create: { userId, matchId, role }
    });
    revalidatePath('/');
    revalidatePath('/manager'); // We will create this page

}

export async function removeManagerFromTournament(tournamentId: string, userId: string) {
    await prisma.userTournamentAssignment.delete({
        where: { userId_tournamentId: { userId, tournamentId } }
    });
    revalidatePath('/tournaments');
}

export async function updateUser(userId: string, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;

    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (role) data.role = role;

    await prisma.user.update({
        where: { id: userId },
        data
    });
    revalidatePath('/users');
}

// --- Tournament-Team Actions ---

export async function addTeamToTournament(tournamentId: string, teamId: string) {
    await prisma.tournamentTeam.upsert({
        where: { tournamentId_teamId: { tournamentId, teamId } },
        create: { tournamentId, teamId },
        update: {}
    });
    revalidatePath('/tournaments');
    revalidatePath('/manager');
}

export async function removeTeamFromTournament(tournamentId: string, teamId: string) {
    await prisma.tournamentTeam.delete({
        where: { tournamentId_teamId: { tournamentId, teamId } }
    });
    revalidatePath('/tournaments');
    revalidatePath('/manager');
}

export async function getTournamentTeams(tournamentId: string) {
    return await prisma.team.findMany({
        where: {
            tournaments: {
                some: { tournamentId }
            }
        },
        include: { players: true }
    });
}

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
    });
}

// --- Automation & Credential Actions ---

function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

export async function createManagerAccount(tournamentId: string, name: string, email: string) {
    const password = generatePassword();

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            role: 'EVENT_MANAGER'
        }
    });

    await prisma.userTournamentAssignment.create({
        data: {
            userId: user.id,
            tournamentId,
            role: 'MANAGER'
        }
    });

    revalidatePath('/tournaments');
    revalidatePath('/manager');

    return { name, email, password };
}

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

    revalidatePath('/manager');
    return team;
}

export async function createPlayerForTeam(teamId: string, name: string) {
    const player = await prisma.player.create({
        data: { name, teamId }
    });
    revalidatePath('/manager');
    return player;
}

export async function createScorerAndAssign(matchId: string, name: string, email: string, role: string = 'SCORER') {
    const password = generatePassword();

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password,
            role: 'SCORER'
        }
    });

    await prisma.userMatchAssignment.create({
        data: {
            userId: user.id,
            matchId,
            role
        }
    });

    revalidatePath('/');
    revalidatePath('/manager');
    revalidatePath('/scorer');

    return { name, email, password };
}
