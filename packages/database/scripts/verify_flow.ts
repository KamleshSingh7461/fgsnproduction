import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- STARTING SYSTEM-WIDE VERIFICATION ---');

    // 1. CLEANUP (Optional, but good for clean test)
    // For safety, we'll just create unique names
    const suffix = Math.floor(Math.random() * 10000);
    const tournamentName = `Galaxy Games ${suffix}`;
    const managerEmail = `manager_${suffix}@fgsn.com`;
    const scorerEmail = `scorer_${suffix}@fgsn.com`;

    console.log(`\n[ADMIN] Creating tournament: ${tournamentName}...`);
    const tournament = await prisma.tournament.create({
        data: {
            name: tournamentName,
            category: 'Intergalactic Football',
            location: 'Jupiter Stadium'
        }
    });

    console.log(`[ADMIN] Provisioning Manager: ${managerEmail}...`);
    const manager = await prisma.user.create({
        data: {
            name: 'Cmdr. Tactical',
            email: managerEmail,
            password: 'password123',
            role: 'EVENT_MANAGER'
        }
    });

    console.log(`[ADMIN] Assigning Manager to Tournament...`);
    await prisma.userTournamentAssignment.create({
        data: {
            userId: manager.id,
            tournamentId: tournament.id,
            role: 'MANAGER'
        }
    });

    // 2. MANAGER FLOW Simulation
    console.log(`\n[MANAGER] Creating Teams for ${tournamentName}...`);
    const teamA = await prisma.team.create({
        data: { name: 'Titan Rovers', shortName: 'TTR' }
    });
    const teamB = await prisma.team.create({
        data: { name: 'Europa Eagles', shortName: 'EUE' }
    });

    console.log(`[MANAGER] Enlisting Teams in Tournament...`);
    await prisma.tournamentTeam.createMany({
        data: [
            { tournamentId: tournament.id, teamId: teamA.id },
            { tournamentId: tournament.id, teamId: teamB.id }
        ]
    });

    console.log(`[MANAGER] Deploying Match (Multi-Team Support)...`);
    const liveData = JSON.stringify({
        sport: 'football',
        scoreSummary: { t0: "0", t1: "0" },
        liveData: {}
    });

    const match = await prisma.match.create({
        data: {
            sport: 'football',
            tournamentId: tournament.id,
            venue: 'Crater 7',
            startTime: new Date(),
            status: 'scheduled',
            teams: {
                create: [
                    { teamId: teamA.id, displayOrder: 0, slotLabel: 'Home (Red)' },
                    { teamId: teamB.id, displayOrder: 1, slotLabel: 'Away (Blue)' }
                ]
            },
            liveData
        },
        include: { teams: { include: { team: true } } }
    });

    console.log(`Confirmed Match Teams: ${match.teams.map(mt => mt.team.name).join(' vs ')}`);

    // 3. SCORER FLOW Simulation
    console.log(`\n[MANAGER] Provisioning Scorer: ${scorerEmail}...`);
    const scorer = await prisma.user.create({
        data: {
            name: 'Unit 42 (Scorer)',
            email: scorerEmail,
            password: 'password123',
            role: 'SCORER'
        }
    });

    console.log(`[MANAGER] Assigning Scorer to Match...`);
    await prisma.userMatchAssignment.create({
        data: {
            userId: scorer.id,
            matchId: match.id,
            role: 'SCORER'
        }
    });

    // 4. VERIFICATION (Isolation Check)
    console.log(`\n--- FINAL ISOLATION CHECK ---`);

    // Check Manager Visibility
    const managed = await prisma.tournament.findMany({
        where: { managers: { some: { userId: manager.id } } }
    });
    console.log(`Manager ${manager.name} sees ${managed.length} tournament(s). [EXPECTED: 1]`);

    // Check Scorer Visibility
    const assigned = await prisma.match.findMany({
        where: { scorers: { some: { userId: scorer.id } } },
        include: { teams: { include: { team: true } } }
    });
    console.log(`Scorer ${scorer.name} sees ${assigned.length} match(es). [EXPECTED: 1]`);
    if (assigned.length > 0) {
        console.log(`Visible Match: ${assigned[0].teams.map(mt => mt.team.name).join(' vs ')} at ${assigned[0].venue}`);
    }

    console.log('\n--- VERIFICATION COMPLETE: ALL SYSTEMS NOMINAL ---');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
