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
        // Set a timeout to prevent indefinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000); // Give up after 5 seconds

        // Fetch matches in the background after page loads
        fetch('/api/matches/live')
            .then(res => res.json())
            .then(data => {
                clearTimeout(timeout);
                setMatches(data);
                setLoading(false);
            })
            .catch(err => {
                clearTimeout(timeout);
                console.error('Failed to load matches:', err);
                setLoading(false);
            });

        return () => clearTimeout(timeout);
    }, []);

    if (loading || matches.length === 0) {
        return null; // Don't show anything while loading or if no matches
    }

    return <ScoreStrip matches={matches} />;
}
