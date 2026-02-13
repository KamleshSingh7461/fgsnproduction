import { NextResponse } from 'next/server';
import { prisma } from '@fgsn/database';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { matchId } = body;

        if (!matchId) {
            return NextResponse.json({ error: 'Missing matchId' }, { status: 400 });
        }

        await prisma.match.update({
            where: { id: matchId },
            data: {
                liveData: JSON.stringify(body)
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("Failed to update match state in DB", e);
        return NextResponse.json({ error: 'Failed to write state' }, { status: 500 });
    }
}
