
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkIds() {
    console.log('--- ALL USERS (SCORERS) ---');
    const scorers = await prisma.user.findMany({ where: { role: 'SCORER' } });
    console.log(JSON.stringify(scorers.map(u => ({ id: u.id, email: u.email, name: u.name })), null, 2));

    console.log('\n--- ALL MATCHES ---');
    const matches = await prisma.match.findMany();
    console.log(JSON.stringify(matches.map(m => ({ id: m.id, sport: m.sport, venue: m.venue })), null, 2));

    console.log('\n--- ALL ASSIGNMENTS ---');
    const assignments = await prisma.userMatchAssignment.findMany();
    console.log(JSON.stringify(assignments, null, 2));
}

checkIds().catch(console.error).finally(() => prisma.$disconnect());
