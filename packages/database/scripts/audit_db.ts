import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.user.findMany({ where: { name: 'Avdhut' } });
    console.log('--- USERS NAMED AVDHUT ---');
    console.log(JSON.stringify(users, null, 2));

    const assignments = await prisma.userTournamentAssignment.findMany({
        include: { tournament: true, user: true }
    });
    console.log('\n--- ALL ASSIGNMENTS ---');
    console.log(JSON.stringify(assignments.map(a => ({
        user: a.user.name,
        email: a.user.email,
        tournament: a.tournament.name,
        role: a.role
    })), null, 2));

    const tournaments = await prisma.tournament.findMany({
        orderBy: { createdAt: 'desc' }
    });
    console.log('\n--- ALL TOURNAMENTS ---');
    console.log(JSON.stringify(tournaments.map(t => ({ id: t.id, name: t.name })), null, 2));
}

check().finally(() => prisma.$disconnect());
