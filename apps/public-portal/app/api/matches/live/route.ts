import { NextResponse } from 'next/server';
import { getLiveMatches } from '@/lib/actions';

export async function GET() {
    try {
        const matches = await getLiveMatches();
        return NextResponse.json(matches);
    } catch (error) {
        console.error('Error fetching live matches:', error);
        return NextResponse.json([], { status: 500 });
    }
}
