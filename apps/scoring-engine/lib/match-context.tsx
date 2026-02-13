'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getScorerRole, getMatchMetadata } from './actions';
import {
    MatchStateDTO,
    CricketBallDTO,
    CricketStateDTO,
    BasketballStateDTO,
    FootballStateDTO,
    VolleyballStateDTO,
    SportType,
    MatchMetadataDTO,
    VolleyballRulesDTO,
    VolleyballPlayerStatsDTO,
    TeamDetailDTO,
    CricketPlayerDTO,
    FootballPlayerDTO,
    BasketballPlayerStatsDTO
} from '@fgsn/dtos';

// --- Dummy Data Generators (Production Level) ---

const generateTeam = (sport: SportType, side: 'home' | 'away'): TeamDetailDTO => {
    const names: Record<string, { home: { name: string, short: string }, away: { name: string, short: string } }> = {
        cricket: { home: { name: 'India', short: 'IND' }, away: { name: 'Australia', short: 'AUS' } },
        football: { home: { name: 'Manchester City', short: 'MCI' }, away: { name: 'Real Madrid', short: 'RMA' } },
        basketball: { home: { name: 'LA Lakers', short: 'LAL' }, away: { name: 'Boston Celtics', short: 'BOS' } },
        volleyball: { home: { name: 'Brazil', short: 'BRA' }, away: { name: 'Poland', short: 'POL' } },
        tennis: { home: { name: 'Nadal', short: 'NAD' }, away: { name: 'Djokovic', short: 'DJO' } },
        custom: { home: { name: 'Home Team', short: 'HOM' }, away: { name: 'Away Team', short: 'AWY' } }
    };
    const t = names[sport]?.[side] || names['custom'][side];
    return {
        id: `${side}-team`,
        name: t.name,
        shortName: t.short,
        primaryColor: side === 'home' ? '#10b981' : '#3b82f6',
    };
};

const createInitialCricketState = (): CricketStateDTO => {
    const homeTeam = generateTeam('cricket', 'home');
    const awayTeam = generateTeam('cricket', 'away');

    const createPlayer = (id: string, name: string, role: string): CricketPlayerDTO => ({
        id, name, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false,
        role: role as any
    });

    const homePlayers = [
        createPlayer('h1', 'Rohit Sharma', 'Batsman'),
        createPlayer('h2', 'Yashasvi Jaiswal', 'Batsman'),
        createPlayer('h3', 'Virat Kohli', 'Batsman'),
        createPlayer('h4', 'Suryakumar Yadav', 'Batsman'),
        createPlayer('h5', 'Rishabh Pant', 'Wicketkeeper'),
        createPlayer('h6', 'Hardik Pandya', 'All-Rounder'),
        createPlayer('h7', 'Ravindra Jadeja', 'All-Rounder'),
        createPlayer('h8', 'Axar Patel', 'All-Rounder'),
        createPlayer('h9', 'Kuldeep Yadav', 'Bowler'),
        createPlayer('h10', 'Jasprit Bumrah', 'Bowler'),
        createPlayer('h11', 'Arshdeep Singh', 'Bowler'),
    ];

    const awayPlayers = [
        createPlayer('a1', 'Travis Head', 'Batsman'),
        createPlayer('a2', 'David Warner', 'Batsman'),
        createPlayer('a3', 'Mitchell Marsh', 'All-Rounder'),
        createPlayer('a4', 'Steve Smith', 'Batsman'),
        createPlayer('a5', 'Glenn Maxwell', 'All-Rounder'),
        createPlayer('a6', 'Marcus Stoinis', 'All-Rounder'),
        createPlayer('a7', 'Tim David', 'Batsman'),
        createPlayer('a8', 'Matthew Wade', 'Wicketkeeper'),
        createPlayer('a9', 'Pat Cummins', 'Bowler'),
        createPlayer('a10', 'Mitchell Starc', 'Bowler'),
        createPlayer('a11', 'Adam Zampa', 'Bowler'),
    ];

    return {
        overs: '0.0',
        runRate: 0,
        striker: homePlayers[0],
        nonStriker: homePlayers[1],
        bowler: { id: awayPlayers[10].id, name: awayPlayers[10].name, overs: 0, maidens: 0, dots: 0, runs: 0, wickets: 0, economy: 0 },
        thisOver: [],
        partnerships: { runs: 0, balls: 0, batsman1Id: homePlayers[0].id, batsman1Runs: 0, batsman2Id: homePlayers[1].id, batsman2Runs: 0 },
        ballHistory: [],
        teams: {
            home: { ...homeTeam, players: homePlayers },
            away: { ...awayTeam, players: awayPlayers }
        },
        inningsTranscript: [],
        overHistory: [],
        matchSituation: { isFreeHit: false },
        projections: { atCurrentRate: 0, at6RPO: 0, at8RPO: 0, at10RPO: 0 },
        fielding: { currentBowlerEnd: 'North', activeFielders: [] },
        milestones: [],
        wagonWheel: [],
        pitchMap: [],
        drs: { battingTeamReviews: 2, bowlingTeamReviews: 2 },
        matchFlow: {
            extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0, total: 0 },
            fallOfWickets: [],
            powerplay: { isActive: true, type: 'P1', oversRemaining: 6 }
        }
    };
};

const createInitialFootballState = (): FootballStateDTO => {
    const homeTeam = generateTeam('football', 'home');
    const awayTeam = generateTeam('football', 'away');

    const createPlayer = (id: string, name: string, num: string, pos: 'GK' | 'DEF' | 'MID' | 'FWD'): FootballPlayerDTO => ({
        id, name, number: num, position: pos, isStarter: true
    });

    const homePlayers: FootballPlayerDTO[] = [
        createPlayer('h1', 'Ederson', '31', 'GK'),
        createPlayer('h2', 'Walker', '2', 'DEF'),
        createPlayer('h3', 'Dias', '3', 'DEF'),
        createPlayer('h4', 'Akanji', '25', 'DEF'),
        createPlayer('h5', 'Gvardiol', '24', 'DEF'),
        createPlayer('h6', 'Rodri', '16', 'MID'),
        createPlayer('h7', 'De Bruyne', '17', 'MID'),
        createPlayer('h8', 'Foden', '47', 'MID'),
        createPlayer('h9', 'Silva', '20', 'MID'),
        createPlayer('h10', 'Doku', '11', 'FWD'),
        createPlayer('h11', 'Haaland', '9', 'FWD'),
    ];

    const awayPlayers: FootballPlayerDTO[] = [
        createPlayer('a1', 'Courtois', '1', 'GK'),
        createPlayer('a2', 'Carvajal', '2', 'DEF'),
        createPlayer('a3', 'Rudiger', '22', 'DEF'),
        createPlayer('a4', 'Militao', '3', 'DEF'),
        createPlayer('a5', 'Mendy', '23', 'DEF'),
        createPlayer('a6', 'Valverde', '15', 'MID'),
        createPlayer('a7', 'Camavinga', '12', 'MID'),
        createPlayer('a8', 'Bellingham', '5', 'MID'),
        createPlayer('a9', 'Rodrygo', '11', 'FWD'),
        createPlayer('a10', 'Vinicius Jr', '7', 'FWD'),
        createPlayer('a11', 'Mbappe', '9', 'FWD'),
    ];

    return {
        clock: { period: '1H', gameTime: '00:00', extraTime: 0, isRunning: false },
        score: { home: 0, away: 0 },
        teams: {
            home: { ...homeTeam, players: homePlayers },
            away: { ...awayTeam, players: awayPlayers }
        },
        stats: {
            home: { possession: 50, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, offsides: 0 },
            away: { possession: 50, shots: 0, shotsOnTarget: 0, corners: 0, fouls: 0, offsides: 0 }
        },
        events: { goals: [], cards: [], subs: [] },
        lineups: { home: homePlayers.map(p => p.id), away: awayPlayers.map(p => p.id) }
    };
};

const createInitialBasketballState = (): BasketballStateDTO => {
    const homeTeam = generateTeam('basketball', 'home');
    const awayTeam = generateTeam('basketball', 'away');

    const createPlayer = (id: string, name: string, num: string, pos: any): BasketballPlayerStatsDTO => ({
        id, name, number: num, position: pos, points: 0, minutes: 0, fieldGoals: { made: 0, att: 0 }, threePointers: { made: 0, att: 0 },
        freeThrows: { made: 0, att: 0 }, rebounds: { off: 0, def: 0, total: 0 }, assists: 0, steals: 0, blocks: 0, turnovers: 0,
        fouls: { personal: 0, technical: 0 }, isOnFloor: true
    });

    const homePlayers = [
        createPlayer('h1', 'LeBron James', '23', 'SF'),
        createPlayer('h2', 'Anthony Davis', '3', 'C'),
        createPlayer('h3', 'D\'Angelo Russell', '1', 'PG'),
        createPlayer('h4', 'Austin Reaves', '15', 'SG'),
        createPlayer('h5', 'Rui Hachimura', '28', 'PF'),
        // Bench
        createPlayer('h6', 'Jarred Vanderbilt', '2', 'PF'),
        createPlayer('h7', 'Gabe Vincent', '7', 'PG'),
        createPlayer('h8', 'Taurean Prince', '12', 'SF'),
        createPlayer('h9', 'Cam Reddish', '5', 'SG'),
        createPlayer('h10', 'Jaxson Hayes', '11', 'C'),
    ];

    const awayPlayers = [
        createPlayer('a1', 'Jayson Tatum', '0', 'SF'),
        createPlayer('a2', 'Jaylen Brown', '7', 'SG'),
        createPlayer('a3', 'Jrue Holiday', '4', 'PG'),
        createPlayer('a4', 'Kristaps Porzingis', '8', 'C'),
        createPlayer('a5', 'Derrick White', '9', 'PG'),
        // Bench
        createPlayer('a6', 'Al Horford', '42', 'C'),
        createPlayer('a7', 'Payton Pritchard', '11', 'PG'),
        createPlayer('a8', 'Sam Hauser', '30', 'SF'),
        createPlayer('a9', 'Luke Kornet', '40', 'C'),
        createPlayer('a10', 'Oshae Brissett', '12', 'PF'),
    ];

    return {
        clock: { period: 'Q1', gameTime: '12:00', shotClock: 24, isClockRunning: false },
        possession: { teamId: 'home-team', arrow: 'home' },
        teams: {
            home: { ...homeTeam, score: 0, scoreByPeriod: { q1: 0, q2: 0, q3: 0, q4: 0, ot: [] }, fouls: { total: 0, technical: 0 }, stats: { fieldGoals: { made: 0, att: 0 }, threePointers: { made: 0, att: 0 }, freeThrows: { made: 0, att: 0 }, rebounds: { off: 0, def: 0, total: 0 }, assists: 0, steals: 0, blocks: 0, turnovers: 0 }, players: homePlayers },
            away: { ...awayTeam, score: 0, scoreByPeriod: { q1: 0, q2: 0, q3: 0, q4: 0, ot: [] }, fouls: { total: 0, technical: 0 }, stats: { fieldGoals: { made: 0, att: 0 }, threePointers: { made: 0, att: 0 }, freeThrows: { made: 0, att: 0 }, rebounds: { off: 0, def: 0, total: 0 }, assists: 0, steals: 0, blocks: 0, turnovers: 0 }, players: awayPlayers }
        },
        matchStatus: { isInBonus: { home: false, away: false }, timeoutsRemaining: { home: 7, away: 7 } },
        matchFlow: { leadTracker: { currentLead: 0, largestLead: { home: 0, away: 0 }, leadChanges: 0, ties: 0 }, scoreHistory: [] },
        events: [],
        lineups: { home: homePlayers.map(p => p.id), away: awayPlayers.map(p => p.id) }
    };
};

const createInitialVolleyballState = (rules?: VolleyballRulesDTO): VolleyballStateDTO => {
    const homeTeam = generateTeam('volleyball', 'home');
    const awayTeam = generateTeam('volleyball', 'away');
    const config = rules || { totalSets: 5, pointsPerSet: 25, pointsDecidingSet: 15 };

    const homePlayers = Array.from({ length: 12 }, (_, i) => ({
        id: `h${i + 1}`, name: `Player ${i + 1}`, number: `${i + 1}`, position: 'OH' as const,
        points: 0, kills: 0, blocks: 0, aces: 0, digs: 0, assists: 0, errors: 0
    }));

    const awayPlayers = Array.from({ length: 12 }, (_, i) => ({
        id: `a${i + 1}`, name: `Player ${i + 1}`, number: `${i + 1}`, position: 'OH' as const,
        points: 0, kills: 0, blocks: 0, aces: 0, digs: 0, assists: 0, errors: 0
    }));

    return {
        sets: [],
        currentSet: 1,
        score: { home: 0, away: 0 },
        servingTeam: 'home',
        rotations: {
            home: homePlayers.slice(0, 6).map(p => p.id),
            away: awayPlayers.slice(0, 6).map(p => p.id),
        },
        substitutions: { home: 0, away: 0 },
        timeouts: { home: 0, away: 0 },
        config,
        teams: {
            home: { ...homeTeam, players: homePlayers },
            away: { ...awayTeam, players: awayPlayers }
        },
        events: []
    };
};

const createInitialState = (sport: SportType = 'cricket'): MatchStateDTO => {
    let liveData: any;
    if (sport === 'cricket') liveData = createInitialCricketState();
    else if (sport === 'basketball') liveData = createInitialBasketballState();
    else if (sport === 'football') liveData = createInitialFootballState();
    else if (sport === 'volleyball') liveData = createInitialVolleyballState();

    return {
        matchId: 'match_001',
        sport,
        status: 'live',
        meta: {
            tournamentName: 'Freedom Global Trophy',
            venue: { name: 'International Stadium', city: 'Metropolis', capacity: 50000 },
            startTime: new Date().toISOString(),
            officials: { referees: ['System Ref'], umpires: [], scorer: 'System' }
        },
        scoreSummary: { home: '0', away: '0' },
        liveData: liveData || createInitialCricketState()
    };
};

interface MatchContextType {
    isLoading: boolean;
    match: MatchStateDTO;
    assignedRole: string | null;
    user: any | null;
    submitBall: (ball: CricketBallDTO) => void;
    submitBasket: (points: 1 | 2 | 3, team: 'home' | 'away', isMake: boolean, playerId?: string) => void;
    handleFoul: (team: 'home' | 'away', playerId?: string, type?: 'personal' | 'technical') => void;
    submitBasketballStat: (teamId: 'home' | 'away', playerId: string, statType: 'rebound' | 'assist' | 'steal' | 'block' | 'turnover', subType?: 'off' | 'def') => void;
    submitTimeout: (teamId: 'home' | 'away') => void;
    submitSubstitution: (teamId: 'home' | 'away', playerInId: string, playerOutId: string) => void;
    toggleClock: () => void;
    resetShotClock: (seconds?: number) => void;
    setClockTime: (time: string) => void;
    switchSport: (sport: SportType) => void;
    // Football Methods
    submitGoal: (teamId: string, playerId: string) => void;
    submitCard: (teamId: string, playerId: string, type: 'yellow' | 'red') => void;
    // Volleyball Methods
    submitPoint: (team: 'home' | 'away') => void;
    submitRotation: (team: 'home' | 'away') => void;
    submitVolleyballStat: (type: 'ace' | 'block' | 'kill' | 'dig' | 'error', team: 'home' | 'away', playerId?: string) => void;
    updateVolleyballConfig: (config: VolleyballRulesDTO) => void;
    updateVolleyballPlayer: (teamId: 'home' | 'away', playerId: string, updates: Partial<VolleyballPlayerStatsDTO>) => void;

    // Undo/Redo
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
    const [match, setMatch] = useState<MatchStateDTO>(createInitialState());
    const [assignedRole, setAssignedRole] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [history, setHistory] = useState<MatchStateDTO[]>([]);
    const [future, setFuture] = useState<MatchStateDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const socketRef = useRef<Socket | null>(null);

    // Track URL params for stable effect dependencies
    const [urlMatchId, setUrlMatchId] = useState<string | null>(null);
    const [urlToken, setUrlToken] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setUrlMatchId(params.get('matchId'));
        setUrlToken(params.get('token'));
    }, []);

    // Session and Metadata Recovery
    useEffect(() => {
        if (!urlMatchId) return;

        let currentUserId: string | null = null;
        if (urlToken) {
            localStorage.setItem('fgsn_session', urlToken);
            try {
                const decoded = JSON.parse(atob(urlToken));
                setUser(decoded);
                currentUserId = decoded.userId;
            } catch (e) {
                console.error("Token decode failure", e);
            }
        } else {
            const session = localStorage.getItem('fgsn_session');
            if (session) {
                try {
                    const decoded = JSON.parse(atob(session));
                    setUser(decoded);
                    currentUserId = decoded.userId;
                } catch (e) {
                    console.error("Session decode failure", e);
                }
            }
        }

        getMatchMetadata(urlMatchId).then(meta => {
            if (meta) {
                let initialState: MatchStateDTO | null = null;
                const recordSport = meta.sport.toLowerCase() as SportType;

                if (meta.liveData) {
                    try {
                        const parsed = typeof meta.liveData === 'string'
                            ? JSON.parse(meta.liveData)
                            : meta.liveData;

                        // paranoid check: does the hydrated data match the sport record and have basic structure?
                        let isStructurallySound = false;
                        if (parsed && typeof parsed === 'object' && parsed.sport === recordSport) {
                            const ld = parsed.liveData;
                            if (ld && typeof ld === 'object') {
                                if (recordSport === 'volleyball') {
                                    isStructurallySound = !!(ld.teams && ld.rotations && ld.score);
                                } else if (recordSport === 'basketball') {
                                    isStructurallySound = !!(ld.teams && ld.clock);
                                } else if (recordSport === 'cricket') {
                                    isStructurallySound = !!(ld.teams && ld.striker);
                                } else {
                                    isStructurallySound = !!ld.teams; // basic requirement for all
                                }
                            }
                        }

                        if (isStructurallySound) {
                            initialState = parsed;
                            initialState!.matchId = meta.id; // force matchId sync
                        } else {
                            console.warn("Hydrated data sport mismatch or missing core structures (teams/liveData)", {
                                hydrated: parsed?.sport,
                                expected: recordSport,
                                hasTeams: !!parsed?.liveData?.teams
                            });
                        }
                    } catch (e) {
                        console.error("Failed to parse liveData JSON", e);
                    }
                }

                let isFreshMatch = false;
                if (!initialState) {
                    initialState = createInitialState(recordSport);
                    initialState.matchId = meta.id;
                    isFreshMatch = true;
                }

                // --- REALISTIC ROSTER INJECTION ---
                // Only inject if it's a fresh match or we have no events recorded yet
                const hasEvents = !!(initialState.liveData as any).events?.length || !!(initialState.liveData as any).ballHistory?.length;

                if (!hasEvents && (meta as any).teams && (meta as any).teams.length > 0) {
                    const homeEntry = (meta as any).teams.find((t: any) => t.slotLabel === 'Home') || (meta as any).teams[0];
                    const awayEntry = (meta as any).teams.find((t: any) => t.slotLabel === 'Away') || (meta as any).teams[1];

                    if (homeEntry && awayEntry) {
                        const sportsData = initialState.liveData as any;

                        // Localized Roster Mapper
                        const mapRoster = (players: any[], sport: SportType) => {
                            return players.map((p: any, idx: number) => {
                                if (sport === 'volleyball') {
                                    return {
                                        id: p.id, name: p.name, number: `${idx + 1}`, position: 'OH',
                                        points: 0, kills: 0, blocks: 0, aces: 0, digs: 0, assists: 0, errors: 0
                                    };
                                } else if (sport === 'basketball') {
                                    return {
                                        id: p.id, name: p.name, number: `${idx + 1}`, position: 'SF',
                                        points: 0, fieldGoals: { made: 0, att: 0 }, threePointers: { made: 0, att: 0 },
                                        freeThrows: { made: 0, att: 0 }, rebounds: { off: 0, def: 0, total: 0 },
                                        assists: 0, steals: 0, blocks: 0, turnovers: 0, fouls: { personal: 0, technical: 0 },
                                        minutes: 0, isOnFloor: idx < 5
                                    };
                                } else if (sport === 'cricket') {
                                    return {
                                        id: p.id, name: p.name, role: 'Batsman', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, isOut: false
                                    };
                                }
                                return { id: p.id, name: p.name, number: `${idx + 1}` };
                            });
                        };

                        // Sync Home Team
                        if (sportsData.teams?.home) {
                            sportsData.teams.home.name = homeEntry.team.name;
                            sportsData.teams.home.shortName = homeEntry.team.shortName || homeEntry.team.name.substring(0, 3).toUpperCase();
                            if (homeEntry.team.players?.length) {
                                sportsData.teams.home.players = mapRoster(homeEntry.team.players, recordSport);

                                // Initial tactical setup
                                if (recordSport === 'volleyball' && !sportsData.events?.length) {
                                    sportsData.rotations.home = sportsData.teams.home.players.slice(0, 6).map((p: any) => p.id);
                                }
                                if (recordSport === 'basketball' && !sportsData.events?.length) {
                                    sportsData.lineups.home = sportsData.teams.home.players.slice(0, 5).map((p: any) => p.id);
                                }
                            }
                        }

                        // Sync Away Team
                        if (sportsData.teams?.away) {
                            sportsData.teams.away.name = awayEntry.team.name;
                            sportsData.teams.away.shortName = awayEntry.team.shortName || awayEntry.team.name.substring(0, 3).toUpperCase();
                            if (awayEntry.team.players?.length) {
                                sportsData.teams.away.players = mapRoster(awayEntry.team.players, recordSport);

                                if (recordSport === 'volleyball' && !sportsData.events?.length) {
                                    sportsData.rotations.away = sportsData.teams.away.players.slice(0, 6).map((p: any) => p.id);
                                }
                                if (recordSport === 'basketball' && !sportsData.events?.length) {
                                    sportsData.lineups.away = sportsData.teams.away.players.slice(0, 5).map((p: any) => p.id);
                                }
                            }
                        }
                    }
                }

                // Final metadata sync
                initialState.sport = recordSport;
                initialState.meta = {
                    tournamentName: (meta.tournament as any)?.name || 'General Tournament',
                    venue: { name: meta.venue || 'TBA', city: '', capacity: 0 },
                    startTime: meta.startTime ? new Date(meta.startTime).toISOString() : new Date().toISOString(),
                    officials: { referees: [], umpires: [], scorer: '' }
                };

                setMatch(initialState);
                setIsLoading(false);

                if (currentUserId) {
                    getScorerRole(meta.id, currentUserId).then(setAssignedRole);
                }

                // If it was a fresh match or we just injected rosters, we should save it once
                // so the overlay and refreshes see the actual teams/players immediately.
                // We'll use a timeout to ensure assignedRole has a chance to update
                if (isFreshMatch || !hasEvents) {
                    setTimeout(() => {
                        // This broadcast will only succeed if assignedRole becomes 'SCORER'
                        broadcast(initialState!);
                    }, 2000);
                }
            } else {
                console.error("Match metadata not found for ID:", urlMatchId);
                setIsLoading(false);
            }
        }).catch(err => {
            console.error("Error fetching match metadata:", err);
            setIsLoading(false);
        });
    }, [urlMatchId, urlToken]);

    // Socket Initialization
    useEffect(() => {
        if (!urlMatchId) return;

        // Socket setup - pointing to the dedicated relay server on 3005
        const socket = io('http://localhost:3005');
        socketRef.current = socket;

        socket.emit('join-match', urlMatchId);

        socket.on('match-updated', (updatedMatch: MatchStateDTO) => {
            if (updatedMatch.matchId === urlMatchId) {
                setMatch(updatedMatch);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [urlMatchId]);

    // Timer Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (match.sport === 'basketball' || match.sport === 'football') {
            const isRunning =
                match.sport === 'basketball' ? (match.liveData as any)?.clock?.isClockRunning :
                    match.sport === 'football' ? (match.liveData as any)?.clock?.isRunning :
                        false;

            if (isRunning) {
                interval = setInterval(() => {
                    setMatch(prev => {
                        const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
                        if (next.sport === 'basketball') {
                            const bball = next.liveData as BasketballStateDTO;
                            const [mins, secs] = bball.clock.gameTime.split(':').map(Number);
                            let totalSecs = mins * 60 + secs;

                            if (totalSecs > 0) {
                                totalSecs -= 1;
                                const nMins = Math.floor(totalSecs / 60);
                                const nSecs = totalSecs % 60;
                                bball.clock.gameTime = `${nMins}:${nSecs.toString().padStart(2, '0')}`;

                                if (bball.clock.shotClock !== null && bball.clock.shotClock > 0) {
                                    bball.clock.shotClock -= 1;
                                } else if (bball.clock.shotClock === 0) {
                                    bball.clock.isClockRunning = false;
                                    // Add shot clock violation event if needed
                                }
                            } else {
                                bball.clock.isClockRunning = false;
                            }
                        } else if (next.sport === 'football') {
                            const football = next.liveData as FootballStateDTO;
                            const [mins, secs] = football.clock.gameTime.split(':').map(Number);
                            let totalSecs = mins * 60 + secs;
                            totalSecs += 1;
                            const nMins = Math.floor(totalSecs / 60);
                            const nSecs = totalSecs % 60;
                            football.clock.gameTime = `${nMins}:${nSecs.toString().padStart(2, '0')}`;
                        }

                        // We don't broadcast every second to avoid overhead, maybe every 2 or 5?
                        // Actually, for real-time overlay, we might need every second.
                        // Let's broadcast every second for now.
                        const channel = new BroadcastChannel('fgsn_microservice_bus');
                        channel.postMessage({ type: 'MATCH_UPDATE', payload: next });
                        channel.close();

                        return next;
                    });
                }, 1000);
            }
        }
        return () => clearInterval(interval);
    }, [match.sport,
    match.sport === 'basketball' ? (match.liveData as any)?.clock?.isClockRunning :
        match.sport === 'football' ? (match.liveData as any)?.clock?.isRunning :
            false
    ]);

    // Broadcast Sync
    useEffect(() => {
        const channel = new BroadcastChannel('fgsn_microservice_bus');
        channel.onmessage = (event) => {
            if (event.data?.type === 'MATCH_UPDATE') {
                setMatch(event.data.payload);
            }
            if (event.data?.type === 'SWITCH_SPORT') {
                setMatch(createInitialState(event.data.sport));
            }
        };
        return () => channel.close();
    }, []);

    const saveToHistory = (currentState: MatchStateDTO) => {
        setHistory(prev => {
            const newHistory = [...prev, JSON.parse(JSON.stringify(currentState))];
            if (newHistory.length > 50) newHistory.shift();
            return newHistory;
        });
        setFuture([]);
    };

    const undo = () => {
        if (assignedRole !== 'SCORER') return;
        if (history.length === 0) return;
        const previousState = history[history.length - 1];
        const newHistory = history.slice(0, -1);
        setFuture(prev => [match, ...prev]);
        setHistory(newHistory);
        setMatch(previousState);
        broadcast(previousState);
    };

    const redo = () => {
        if (assignedRole !== 'SCORER') return;
        if (future.length === 0) return;
        const nextState = future[0];
        const newFuture = future.slice(1);
        setHistory(prev => [...prev, match]);
        setFuture(newFuture);
        setMatch(nextState);
        broadcast(nextState);
    };

    const broadcast = async (newState: MatchStateDTO) => {
        if (assignedRole !== 'SCORER') return;
        const channel = new BroadcastChannel('fgsn_microservice_bus');
        channel.postMessage({ type: 'MATCH_UPDATE', payload: newState });
        channel.close();

        // Socket.io Broadcast
        socketRef.current?.emit('update-match', {
            matchId: newState.matchId,
            state: newState
        });

        try {
            await fetch('/api/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newState)
            });
        } catch (e) { /* Console logs removed for brevity */ }
    };

    const switchSport = (sport: SportType) => {
        if (assignedRole !== 'SCORER') return;
        const newState = createInitialState(sport);
        // Reset History
        setHistory([]);
        setFuture([]);
        setMatch(newState);
        broadcast(newState);

        const channel = new BroadcastChannel('fgsn_microservice_bus');
        channel.postMessage({ type: 'SWITCH_SPORT', sport });
        channel.close();
    };

    const submitBall = (ball: CricketBallDTO) => {
        if (assignedRole !== 'SCORER') return;
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'cricket') return prev;

            const cricket = next.liveData as CricketStateDTO;
            const striker = cricket.striker;
            const bowler = cricket.bowler;

            const isWide = ball.extras?.type === 'wide';
            const isNoBall = ball.extras?.type === 'no-ball';
            const isLegal = !isWide && !isNoBall;

            const penalty = (isWide || isNoBall) ? (ball.extras?.runs || 1) : 0;
            const batRuns = isWide ? 0 : ball.runsScored;
            const totalRuns = batRuns + penalty;

            if (!isWide) {
                striker.runs += batRuns;
                striker.balls += 1;
                if (batRuns === 4) striker.fours += 1;
                if (batRuns === 6) striker.sixes += 1;
                striker.strikeRate = Number(((striker.runs / striker.balls) * 100).toFixed(2));

                const milestones = [50, 100, 150, 200];
                milestones.forEach(m => {
                    if (striker.runs >= m && (striker.runs - batRuns) < m) {
                        cricket.milestones.push({ playerId: striker.id, description: `${striker.name} reaches ${m}!`, type: 'batting' });
                    }
                });
            }

            if (isLegal) {
                const currentBalls = Math.round((bowler.overs % 1) * 10) + 1;
                if (currentBalls === 6) bowler.overs = Math.floor(bowler.overs) + 1;
                else bowler.overs = Math.floor(bowler.overs) + (currentBalls / 10);
                if (totalRuns === 0) bowler.dots += 1;
            }
            bowler.runs += totalRuns;
            if (ball.wicket?.isWicket) bowler.wickets += 1;

            const totalBalls = (Math.floor(bowler.overs) * 6) + Math.round((bowler.overs % 1) * 10);
            if (totalBalls > 0) bowler.economy = Number(((bowler.runs / totalBalls) * 6).toFixed(2));

            if (isWide) cricket.matchFlow.extras.wides += penalty;
            if (isNoBall) cricket.matchFlow.extras.noBalls += penalty;
            cricket.matchFlow.extras.total += penalty;

            const [total, wkts] = (next.scoreSummary.home.includes('/') ? next.scoreSummary.home : "0/0").split('/').map(Number);
            const newScore = total + totalRuns;
            const newWkts = ball.wicket?.isWicket ? wkts + 1 : wkts;
            next.scoreSummary.home = `${newScore}/${newWkts}`;

            if (isLegal) {
                const overs = parseFloat(cricket.overs);
                const ballsInOver = Math.round((overs % 1) * 10) + 1;
                if (ballsInOver === 6) {
                    cricket.overs = `${Math.floor(overs) + 1}.0`;

                    // Calculate Over Stats
                    const lastEntry = cricket.inningsTranscript[cricket.inningsTranscript.length - 1];
                    const prevScore = lastEntry ? lastEntry.totalScoreAtEnd : 0;
                    const prevWickets = cricket.inningsTranscript.reduce((acc, curr) => acc + curr.wicketsLost, 0);

                    const runsInOver = newScore - prevScore;
                    const wicketsInOver = newWkts - prevWickets;

                    cricket.inningsTranscript.push({
                        overNumber: Math.floor(overs) + 1,
                        runsConceded: runsInOver,
                        wicketsLost: wicketsInOver,
                        totalScoreAtEnd: newScore
                    });
                } else {
                    cricket.overs = `${Math.floor(overs)}.${ballsInOver}`;
                }
                cricket.thisOver.push(ball.wicket?.isWicket ? 'W' : (totalRuns > 0 ? `${totalRuns}` : '•'));
            } else {
                cricket.thisOver.push(isWide ? `${penalty}wd` : `${penalty}nb`);
            }

            const matchTotalBalls = (Math.floor(parseFloat(cricket.overs)) * 6) + Math.round((parseFloat(cricket.overs) % 1) * 10);
            if (matchTotalBalls > 0) {
                cricket.runRate = Number(((newScore / matchTotalBalls) * 6).toFixed(2));
                const remainingBalls = (20 * 6) - matchTotalBalls;
                cricket.projections.atCurrentRate = Math.round(newScore + (cricket.runRate * (remainingBalls / 6)));
                cricket.projections.at6RPO = Math.round(newScore + (6 * (remainingBalls / 6)));
                cricket.projections.at8RPO = Math.round(newScore + (8 * (remainingBalls / 6)));
                cricket.projections.at10RPO = Math.round(newScore + (10 * (remainingBalls / 6)));
            }

            cricket.partnerships.runs += totalRuns;
            if (isLegal) cricket.partnerships.balls += 1;
            cricket.ballHistory.push(ball);

            if ((batRuns % 2 !== 0) || (isLegal && Math.round((parseFloat(cricket.overs) % 1) * 10) === 0)) {
                const temp = JSON.parse(JSON.stringify(cricket.striker));
                cricket.striker = cricket.nonStriker;
                cricket.nonStriker = temp;
            }

            broadcast(next);
            return next;
        });
    };

    const submitBasket = (points: 1 | 2 | 3, team: 'home' | 'away', isMake: boolean, playerId?: string) => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'basketball') return prev;

            const bball = next.liveData as BasketballStateDTO;
            const t = bball.teams[team];
            const player = playerId ? t.players.find(p => p.id === playerId) : null;

            if (points === 1) {
                t.stats.freeThrows.att += 1;
                if (player) player.freeThrows = { ...(player.freeThrows || { made: 0, att: 0 }), att: (player.freeThrows?.att || 0) + 1 };
                if (isMake) {
                    t.stats.freeThrows.made += 1;
                    t.score += 1;
                    if (player) {
                        player.points += 1;
                        player.freeThrows.made += 1;
                    }
                }
            } else if (points === 3) {
                t.stats.threePointers.att += 1;
                t.stats.fieldGoals.att += 1;
                if (player) {
                    player.threePointers = { ...(player.threePointers || { made: 0, att: 0 }), att: (player.threePointers?.att || 0) + 1 };
                    player.fieldGoals = { ...(player.fieldGoals || { made: 0, att: 0 }), att: (player.fieldGoals?.att || 0) + 1 };
                }
                if (isMake) {
                    t.stats.threePointers.made += 1;
                    t.stats.fieldGoals.made += 1;
                    t.score += 3;
                    if (player) {
                        player.points += 3;
                        player.threePointers.made += 1;
                        player.fieldGoals.made += 1;
                    }
                }
            } else {
                t.stats.fieldGoals.att += 1;
                if (player) {
                    player.fieldGoals = { ...(player.fieldGoals || { made: 0, att: 0 }), att: (player.fieldGoals?.att || 0) + 1 };
                }
                if (isMake) {
                    t.stats.fieldGoals.made += 1;
                    t.score += 2;
                    if (player) {
                        player.points += 2;
                        player.fieldGoals.made += 1;
                    }
                }
            }

            if (isMake) {
                bball.events.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'basket',
                    teamId: team,
                    playerId,
                    points,
                    minute: bball.clock.gameTime,
                    description: `${points}PT Score by ${player?.name || 'Team'}`
                });
            }

            const p = bball.clock.period;
            if (p === 'Q1') t.scoreByPeriod.q1 = t.score;
            else if (p === 'Q2') t.scoreByPeriod.q2 = t.score - t.scoreByPeriod.q1;
            else if (p === 'Q3') t.scoreByPeriod.q3 = t.score - (t.scoreByPeriod.q1 + t.scoreByPeriod.q2);
            else if (p === 'Q4') t.scoreByPeriod.q4 = t.score - (t.scoreByPeriod.q1 + t.scoreByPeriod.q2 + t.scoreByPeriod.q3);

            const homeScore = bball.teams.home.score;
            const awayScore = bball.teams.away.score;
            const prevLead = bball.matchFlow.leadTracker.currentLead;
            const newLead = homeScore - awayScore;

            if ((prevLead > 0 && newLead < 0) || (prevLead < 0 && newLead > 0)) bball.matchFlow.leadTracker.leadChanges += 1;
            if (newLead === 0 && prevLead !== 0) bball.matchFlow.leadTracker.ties += 1;

            bball.matchFlow.leadTracker.currentLead = newLead;
            if (newLead > bball.matchFlow.leadTracker.largestLead.home) bball.matchFlow.leadTracker.largestLead.home = newLead;
            if (Math.abs(newLead) > bball.matchFlow.leadTracker.largestLead.away && newLead < 0) bball.matchFlow.leadTracker.largestLead.away = Math.abs(newLead);

            next.scoreSummary.home = `${homeScore}`;
            next.scoreSummary.away = `${awayScore}`;

            // Add to Score History
            bball.matchFlow.scoreHistory.push({
                timestamp: bball.clock.gameTime,
                homeScore: homeScore,
                awayScore: awayScore,
                period: bball.clock.period
            });

            broadcast(next);
            return next;
        });
    };

    const handleFoul = (team: 'home' | 'away', playerId?: string, type: 'personal' | 'technical' = 'personal') => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'basketball') return prev;
            const bball = next.liveData as BasketballStateDTO;

            const t = bball.teams[team];
            if (type === 'technical') t.fouls.technical += 1;
            else t.fouls.total += 1;

            if (playerId) {
                const player = t.players.find(p => p.id === playerId);
                if (player) {
                    if (type === 'technical') player.fouls.technical += 1;
                    else player.fouls.personal += 1;
                }
            }

            if (t.fouls.total >= 5) bball.matchStatus.isInBonus[team] = true;

            bball.events.push({
                id: Math.random().toString(36).substr(2, 9),
                type: 'foul',
                teamId: team,
                playerId,
                minute: bball.clock.gameTime,
                description: `${type.toUpperCase()} Foul - ${playerId || 'Team'}`
            });

            broadcast(next);
            return next;
        });
    };

    const submitBasketballStat = (teamId: 'home' | 'away', playerId: string, statType: 'rebound' | 'assist' | 'steal' | 'block' | 'turnover', subType?: 'off' | 'def') => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'basketball') return prev;
            const bball = next.liveData as BasketballStateDTO;
            const t = bball.teams[teamId];
            const player = t.players.find(p => p.id === playerId);

            if (statType === 'rebound') {
                if (subType === 'off') {
                    t.stats.rebounds.off += 1;
                    if (player) player.rebounds.off += 1;
                } else {
                    t.stats.rebounds.def += 1;
                    if (player) player.rebounds.def += 1;
                }
                t.stats.rebounds.total += 1;
                if (player) player.rebounds.total += 1;
            } else {
                const key = statType === 'assist' ? 'assists' : statType === 'turnover' ? 'turnovers' : statType;
                (t.stats as any)[key] += 1;
                if (player) (player as any)[key] += 1;
            }

            bball.events.push({
                id: Math.random().toString(36).substr(2, 9),
                type: statType,
                teamId,
                playerId,
                minute: bball.clock.gameTime,
                description: `${statType.toUpperCase()} by ${player?.name || 'Player'}`
            });

            broadcast(next);
            return next;
        });
    };

    const submitTimeout = (teamId: 'home' | 'away') => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;

            if (next.sport === 'basketball') {
                const bball = next.liveData as BasketballStateDTO;
                if (bball.matchStatus.timeoutsRemaining[teamId] > 0) {
                    bball.matchStatus.timeoutsRemaining[teamId] -= 1;
                    bball.events.push({
                        id: Math.random().toString(36).substr(2, 9),
                        type: 'timeout',
                        teamId,
                        minute: bball.clock.gameTime,
                        description: `TIMEOUT - ${teamId.toUpperCase()}`
                    });
                }
            } else if (next.sport === 'volleyball') {
                const vb = next.liveData as VolleyballStateDTO;
                if (vb.timeouts[teamId] < 2) {
                    vb.timeouts[teamId]++;
                    vb.events.push({
                        id: `to_${Date.now()}`,
                        type: 'timeout',
                        teamId,
                        description: `Timeout ${teamId.toUpperCase()} (${vb.timeouts[teamId]}/2)`,
                        set: vb.currentSet,
                        score: { ...vb.score }
                    });
                }
            }
            // Football usually doesn't track timeouts in this context

            broadcast(next);
            return next;
        });
    };

    const submitSubstitution = (teamId: 'home' | 'away', playerInId: string, playerOutId: string) => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;

            if (next.sport === 'basketball') {
                const bball = next.liveData as BasketballStateDTO;
                const t = bball.teams[teamId];
                const playerIn = t.players.find(p => p.id === playerInId);
                const playerOut = t.players.find(p => p.id === playerOutId);

                if (playerIn) playerIn.isOnFloor = true;
                if (playerOut) playerOut.isOnFloor = false;

                bball.lineups[teamId] = bball.lineups[teamId].filter(id => id !== playerOutId);
                bball.lineups[teamId].push(playerInId);

                bball.events.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'substitution',
                    teamId,
                    playerInId,
                    playerOutId,
                    minute: bball.clock.gameTime,
                    description: `SUB: ${playerIn?.name} in for ${playerOut?.name}`
                });
            } else if (next.sport === 'volleyball') {
                const vb = next.liveData as VolleyballStateDTO;
                const rotIdx = vb.rotations[teamId].indexOf(playerOutId);
                if (rotIdx !== -1) {
                    const pIn = vb.teams[teamId].players.find(p => p.id === playerInId);
                    const pOut = vb.teams[teamId].players.find(p => p.id === playerOutId);

                    vb.rotations[teamId][rotIdx] = playerInId;

                    // Libero check: Replacements involving a Libero do not count towards the 6-sub limit
                    const isLiberoIn = pIn?.position === 'L';
                    const isLiberoOut = pOut?.position === 'L';

                    if (!isLiberoIn && !isLiberoOut) {
                        vb.substitutions[teamId]++;
                    }

                    vb.events.push({
                        id: `sub_${Date.now()}`,
                        type: 'sub',
                        teamId,
                        description: `Sub: ${pIn?.name} for ${pOut?.name}`,
                        set: vb.currentSet,
                        score: { ...vb.score }
                    });
                }
            }

            broadcast(next);
            return next;
        });
    };

    const submitGoal = (teamId: string, playerId: string) => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'football') return prev;
            const football = next.liveData as FootballStateDTO;

            const goal = { teamId, playerId, minute: parseInt(football.clock.gameTime.split(':')[0]) || 0 };
            football.events.goals.push(goal);

            if (teamId === 'home') football.score.home += 1;
            else football.score.away += 1;

            next.scoreSummary.home = `${football.score.home}`;
            next.scoreSummary.away = `${football.score.away}`;

            broadcast(next);
            return next;
        });
    };

    const submitCard = (teamId: string, playerId: string, type: 'yellow' | 'red') => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'football') return prev;
            const football = next.liveData as FootballStateDTO;

            football.events.cards.push({
                teamId, playerId, type,
                minute: parseInt(football.clock.gameTime.split(':')[0]) || 0
            });

            broadcast(next);
            return next;
        });
    };

    const resetShotClock = (seconds: number = 24) => {
        saveToHistory(match);
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport !== 'basketball') return prev;
            (next.liveData as BasketballStateDTO).clock.shotClock = seconds;
            broadcast(next);
            return next;
        });
    };

    const setClockTime = (time: string) => {
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport === 'basketball') {
                (next.liveData as BasketballStateDTO).clock.gameTime = time;
            } else if (next.sport === 'football') {
                (next.liveData as FootballStateDTO).clock.gameTime = time;
            }
            broadcast(next);
            return next;
        });
    };

    const toggleClock = () => {
        setMatch(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            if (next.sport === 'basketball') {
                (next.liveData as BasketballStateDTO).clock.isClockRunning = !(next.liveData as BasketballStateDTO).clock.isClockRunning;
            } else if (next.sport === 'football') {
                (next.liveData as FootballStateDTO).clock.isRunning = !(next.liveData as FootballStateDTO).clock.isRunning;
            }
            broadcast(next);
            return next;
        });
    };

    // --- Volleyball Logic ---

    const submitPoint = (team: 'home' | 'away') => {
        saveToHistory(match);
        setMatch(prev => {
            if (prev.sport !== 'volleyball') return prev;
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            const vb = next.liveData as VolleyballStateDTO;

            // Log event FIRST (before set win check/reset)
            vb.events.push({
                id: `evt_${Date.now()}`,
                type: 'point',
                teamId: team,
                description: `Point ${team.toUpperCase()}`,
                set: vb.currentSet,
                score: { ...vb.score }
            });

            // Increment score & handle rotation/set win
            applyVolleyballScore(vb, team, next);

            broadcast(next);
            return next;
        });
    };

    const applyVolleyballScore = (vb: VolleyballStateDTO, scoringTeam: 'home' | 'away', next: MatchStateDTO) => {
        vb.score[scoringTeam]++;

        // Side-out logic (if receiving team wins point)
        if (vb.servingTeam !== scoringTeam) {
            vb.servingTeam = scoringTeam;
            // Rotate team
            const roster = vb.rotations[scoringTeam];
            const first = roster.shift();
            if (first) roster.push(first);
        }

        // Check Set Win
        const config = vb.config;
        const isDecidingSet = vb.currentSet === config.totalSets;
        const pointsToWin = isDecidingSet ? config.pointsDecidingSet : config.pointsPerSet;

        const myScore = vb.score[scoringTeam];
        const oppScore = vb.score[scoringTeam === 'home' ? 'away' : 'home'];

        if (myScore >= pointsToWin && (myScore - oppScore) >= 2) {
            // Set Won
            vb.sets.push({ home: vb.score.home, away: vb.score.away });
            vb.currentSet++;
            vb.score = { home: 0, away: 0 };

            // Reset vars for new set
            vb.substitutions = { home: 0, away: 0 };
            vb.timeouts = { home: 0, away: 0 };

            // Update Summary
            const homeSets = vb.sets.filter(s => s.home > s.away).length;
            const awaySets = vb.sets.filter(s => s.away > s.home).length;
            next.scoreSummary = { home: homeSets.toString(), away: awaySets.toString() };
        }
    };

    const submitRotation = (team: 'home' | 'away') => {
        saveToHistory(match);
        setMatch(prev => {
            if (prev.sport !== 'volleyball') return prev;
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            const vb = next.liveData as VolleyballStateDTO;
            const roster = vb.rotations[team];
            const first = roster.shift();
            if (first) roster.push(first); // Manual rotation
            broadcast(next);
            return next;
        });
    };

    const submitVolleyballStat = (type: 'ace' | 'kill' | 'block' | 'error' | 'dig', team: 'home' | 'away', playerId?: string) => {
        saveToHistory(match);
        setMatch(prev => {
            if (prev.sport !== 'volleyball') return prev;
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            const vb = next.liveData as VolleyballStateDTO;

            // 1. Update Player Stats
            if (playerId) {
                const player = vb.teams[team].players.find(p => p.id === playerId);
                if (player) {
                    if (type === 'ace') { player.aces++; player.points++; }
                    else if (type === 'kill') { player.kills++; player.points++; }
                    else if (type === 'block') { player.blocks++; player.points++; }
                    else if (type === 'dig') { player.digs++; }
                    else if (type === 'error') { player.errors++; }
                }
            }

            // 2. Log Event (BEFORE potentially resetting for new set)
            vb.events.push({
                id: `evt_${Date.now()}`,
                type,
                teamId: team,
                playerId,
                description: `${type.toUpperCase()} by ${playerId ? vb.teams[team].players.find(p => p.id === playerId)?.name : team}`,
                set: vb.currentSet,
                score: { ...vb.score }
            });

            // 3. Score Logic
            let scoringTeam: 'home' | 'away' | null = null;
            if (['ace', 'kill', 'block'].includes(type)) {
                scoringTeam = team;
            } else if (type === 'error') {
                scoringTeam = team === 'home' ? 'away' : 'home';
            }

            // 4. Apply Score & Rotation if needed
            if (scoringTeam) {
                applyVolleyballScore(vb, scoringTeam, next);
            }

            broadcast(next);
            return next;
        });
    };

    const updateVolleyballPlayer = (teamId: 'home' | 'away', playerId: string, updates: Partial<VolleyballPlayerStatsDTO>) => {
        saveToHistory(match);
        setMatch(prev => {
            if (prev.sport !== 'volleyball') return prev;
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            const vb = next.liveData as VolleyballStateDTO;
            const player = vb.teams[teamId].players.find(p => p.id === playerId);
            if (player) {
                Object.assign(player, updates);
            }
            broadcast(next);
            return next;
        });
    };

    const updateVolleyballConfig = (config: VolleyballRulesDTO) => {
        saveToHistory(match);
        setMatch(prev => {
            if (prev.sport !== 'volleyball') return prev;
            const next = JSON.parse(JSON.stringify(prev)) as MatchStateDTO;
            (next.liveData as VolleyballStateDTO).config = config;
            broadcast(next);
            return next;
        });
    };

    return (
        <MatchContext.Provider value={{
            isLoading, match, assignedRole, user, submitBall, submitBasket, handleFoul, toggleClock, switchSport,
            submitGoal, submitCard, submitBasketballStat, submitTimeout, submitSubstitution,
            resetShotClock, setClockTime,
            // Volleyball
            submitPoint, submitRotation, submitVolleyballStat, updateVolleyballConfig, updateVolleyballPlayer,
            // Undo/Redo
            undo, redo, canUndo: history.length > 0, canRedo: future.length > 0
        }}>
            {children}
        </MatchContext.Provider>
    );
}

export function useMatch() {
    const context = useContext(MatchContext);
    if (!context) throw new Error("useMatch must be used within MatchProvider");
    return context;
}
