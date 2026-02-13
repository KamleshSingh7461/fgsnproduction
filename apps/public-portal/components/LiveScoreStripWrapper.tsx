'use client';

import { useEffect, useState } from 'react';
import { ScoreStrip } from './ScoreStrip';

interface Match {
    id: string;
    sport: string;
    status: string;
    teams: {
        team: {
            name: string;
            shortName?: string;
        };
    }[];
    liveData: string;
    tournament: {
        name: string;
    };
}

export function LiveScoreStripWrapper() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch matches in the background after page loads
        fetch('/api/matches/live')
            .then(res => res.json())
            .then(data => {
                setMatches(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load matches:', err);
                setLoading(false);
            });
    }, []);

    if (loading || matches.length === 0) {
        return null; // Don't show anything while loading
    }

    return <ScoreStrip matches={matches} />;
}
