import { NextResponse } from 'next/server';
import { prisma } from '@fgsn/database';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const matchId = searchParams.get('matchId');

        if (!matchId) {
            return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
        }

        const match = await prisma.match.findUnique({
            where: { id: matchId },
            select: { liveData: true }
        });

        if (!match || !match.liveData) {
            return NextResponse.json({ error: 'No state found' }, { status: 404 });
        }

        return NextResponse.json(JSON.parse(match.liveData));
    } catch (e) {
        console.error("Failed to read match state from DB", e);
        return NextResponse.json({ error: 'Failed to read state' }, { status: 500 });
    }
}
