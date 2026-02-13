import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial users...')

    // Create Super Admin
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@fgsn.com' },
        update: {},
        create: {
            email: 'superadmin@fgsn.com',
            password: 'password123', // In a real app, hash this!
            name: 'Global Super Admin',
            role: 'SUPER_ADMIN',
        },
    })

    // Create an Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@fgsn.com' },
        update: {},
        create: {
            email: 'admin@fgsn.com',
            password: 'password123',
            name: 'Regional Admin',
            role: 'ADMIN',
        },
    })

    // Create a Scorer
    const scorer = await prisma.user.upsert({
        where: { email: 'scorer@fgsn.com' },
        update: {},
        create: {
            email: 'scorer@fgsn.com',
            password: 'password123',
            name: 'Match Scorer',
            role: 'SCORER',
        },
    })

    // Create a Manager
    const manager = await prisma.user.upsert({
        where: { email: 'manager@fgsn.com' },
        update: {},
        create: {
            email: 'manager@fgsn.com',
            password: 'password123',
            name: 'Tournament Manager',
            role: 'EVENT_MANAGER',
        },
    })

    console.log({ superAdmin, admin, manager, scorer })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
