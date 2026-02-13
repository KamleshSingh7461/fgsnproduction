export type SportType = 'cricket' | 'football' | 'basketball' | 'tennis' | 'volleyball' | 'custom';
export type MatchStatus = 'scheduled' | 'live' | 'break' | 'finished' | 'abandoned';

// --- Shared Core DTOs ---

export interface CreateMatchDTO {
    sport: SportType;
    homeTeamId: string;
    awayTeamId: string;
    tournamentId: string;
    venue: string;
    startTime: string; // ISO String
}

export interface TeamDetailDTO {
    id: string;
    name: string;
    shortName: string;
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
}

export interface MatchOfficialsDTO {
    referees: string[]; // Names
    umpires: string[];
    scorer: string;
    matchCommissioner?: string;
}

export interface VenueDTO {
    name: string;
    city?: string;
    capacity?: number;
    weather?: {
        temp: number;
        condition: string; // "Sunny", "Rain"
    };
}

export interface MatchMetadataDTO {
    tournamentName: string;
    venue: VenueDTO;
    startTime: string;
    officials: MatchOfficialsDTO;
}

export interface MatchStateDTO {
    matchId: string;
    sport: SportType;
    status: MatchStatus;
    meta: MatchMetadataDTO;
    scoreSummary: {
        home: string; // "120/4" or "85"
        away: string;
    };
    liveData: CricketStateDTO | BasketballStateDTO | FootballStateDTO | VolleyballStateDTO; // Union Type
}

// --- Volleyball Specific DTOs ---

export interface VolleyballRulesDTO {
    totalSets: 3 | 5; // Best of 3 or 5
    pointsPerSet: number; // e.g. 25
    pointsDecidingSet: number; // e.g. 15
}

export interface VolleyballPlayerStatsDTO {
    id: string;
    name: string;
    number: string;
    position: 'OH' | 'MB' | 'OPP' | 'S' | 'L' | 'DS'; // Outside Hitter, Middle Blocker, etc.
    points: number;
    kills: number;
    blocks: number;
    aces: number;
    digs: number;
    assists: number;
    errors: number;
}

export interface VolleyballEventDTO {
    id: string;
    type: 'point' | 'sub' | 'timeout' | 'card' | 'ace' | 'kill' | 'block' | 'error' | 'dig';
    teamId: string;
    playerId?: string;
    description: string;
    set: number;
    score: { home: number; away: number };
}

export interface VolleyballStateDTO {
    sets: { home: number; away: number }[]; // Scores for each set
    currentSet: number; // 1-5
    score: {
        home: number;
        away: number;
    };
    servingTeam: 'home' | 'away';
    rotations: {
        home: string[]; // Array of 6 player IDs on court (zones 1-6)
        away: string[];
    };
    substitutions: {
        home: number;
        away: number;
    };
    timeouts: {
        home: number;
        away: number;
    };
    config: VolleyballRulesDTO;
    teams: {
        home: TeamDetailDTO & { players: VolleyballPlayerStatsDTO[] };
        away: TeamDetailDTO & { players: VolleyballPlayerStatsDTO[] };
    };
    events: VolleyballEventDTO[];
}


// --- Football Specific DTOs ---

export interface FootballGoalDTO {
    playerId: string;
    assistPlayerId?: string;
    minute: number;
    extraMinute?: number;
    teamId: string;
}

export interface FootballCardDTO {
    playerId: string;
    type: 'yellow' | 'red';
    minute: number;
    extraMinute?: number;
    teamId: string;
}

export interface FootballSubstitutionDTO {
    playerInId: string;
    playerOutId: string;
    minute: number;
    teamId: string;
}

export interface FootballPlayerDTO {
    id: string;
    name: string;
    number: string;
    position: 'GK' | 'DEF' | 'MID' | 'FWD';
    isStarter: boolean;
}

export interface FootballStateDTO {
    clock: {
        period: '1H' | 'HT' | '2H' | 'FT' | 'E1' | 'E2' | 'P';
        gameTime: string; // "45:00"
        extraTime: number; // Added time (e.g., 4 mins)
        isRunning: boolean;
    };
    score: {
        home: number;
        away: number;
    };
    teams: {
        home: TeamDetailDTO & { players: FootballPlayerDTO[] };
        away: TeamDetailDTO & { players: FootballPlayerDTO[] };
    };
    stats: {
        home: FootballTeamStatsDTO;
        away: FootballTeamStatsDTO;
    };
    events: {
        goals: FootballGoalDTO[];
        cards: FootballCardDTO[];
        subs: FootballSubstitutionDTO[];
    };
    lineups: {
        home: string[]; // Player IDs
        away: string[];
    };
}

export interface FootballTeamStatsDTO {
    possession: number; // Percentage
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
    offsides: number;
}


// --- Cricket Specific DTOs ---

export interface CricketBallDTO {
    ballNumber: number;
    bowlerId: string;
    strikerId: string;
    nonStrikerId: string;
    runsScored: number;
    extras?: {
        type: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
        runs: number;
    };
    wicket?: {
        isWicket: boolean;
        type?: 'bowled' | 'caught' | 'lbw' | 'run-out';
    };
    // Broadcast Physics
    speedKmph?: number;
    stumpHeight?: number;
    pitchCoordinates?: { x: number; y: number };
    shotCoordinates?: { angle: number; distance: number };
}

export interface CricketPlayerDTO extends PlayerStatsDTO {
    role: 'Batsman' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper';
}

export interface CricketStateDTO {
    overs: string;
    runRate: number;
    striker: PlayerStatsDTO;
    nonStriker: PlayerStatsDTO;
    bowler: BowlerStatsDTO;
    thisOver: string[];
    partnerships: PartnershipDTO;
    ballHistory: CricketBallDTO[];

    teams: {
        home: TeamDetailDTO & { players: CricketPlayerDTO[] };
        away: TeamDetailDTO & { players: CricketPlayerDTO[] };
    };

    // --- 100% COMPLIANCE ADDITIONS ---
    inningsTranscript: {
        overNumber: number;
        runsConceded: number;
        wicketsLost: number;
        totalScoreAtEnd: number;
    }[];
    overHistory: {
        overNumber: number;
        runs: number;
        wickets: number;
        totalRuns: number;
    }[];

    matchSituation: {
        isFreeHit: boolean;
        dlsTarget?: number;
        dlsParScore?: number;
    };

    projections: {
        atCurrentRate: number;
        at6RPO: number;
        at8RPO: number;
        at10RPO: number;
    };

    fielding: {
        currentBowlerEnd: string;
        activeFielders: string[];
    };

    milestones: {
        playerId: string;
        description: string;
        type: 'batting' | 'bowling' | 'team';
    }[];

    // Advanced Broadcast Data
    wagonWheel: {
        batsmanId: string;
        shots: { angle: number; distance: number; runs: number }[];
    }[];
    pitchMap: {
        bowlerId: string;
        deliveries: { x: number; y: number; type: 'pacer' | 'spinner' }[];
    }[];
    drs: {
        battingTeamReviews: number;
        bowlingTeamReviews: number;
        currentReview?: {
            requestedBy: 'batting' | 'bowling';
            type: 'caught' | 'lbw';
            status: 'pending' | 'decision_pending' | 'successful' | 'failed';
        };
    };
    matchFlow: {
        extras: {
            wides: number;
            noBalls: number;
            byes: number;
            legByes: number;
            penalty: number;
            total: number;
        };
        fallOfWickets: {
            wicketNumber: number;
            score: number;
            over: string;
            batsmanId: string;
        }[];
        powerplay: {
            isActive: boolean;
            type: 'P1' | 'P2' | 'P3' | 'Batting' | 'Bowling';
            oversRemaining: number;
        };
    };
}

export interface PlayerStatsDTO {
    id: string;
    name: string;
    runs: number;
    balls: number;
    fours: number; // Added
    sixes: number; // Added
    strikeRate: number;
    isOut: boolean; // Added
}

export interface BowlerStatsDTO {
    id: string;
    name: string;
    overs: number; // 3.2
    maidens: number;
    dots: number; // Added
    runs: number;
    wickets: number;
    economy: number;
}

export interface PartnershipDTO {
    runs: number;
    balls: number;
    batsman1Id: string;
    batsman1Runs: number;
    batsman2Id: string;
    batsman2Runs: number;
}


// --- Basketball Specific DTOs ---

export interface BasketEventDTO {
    playerId: string;
    points: 1 | 2 | 3;
    type: 'field-goal' | 'free-throw';
    outcome: 'make' | 'miss';
    coordinates?: { x: number; y: number };
}

export interface BasketballStateDTO {
    clock: {
        period: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'OT1' | 'OT2';
        gameTime: string; // "10:42"
        shotClock: number | null;
        isClockRunning: boolean;
    };
    possession: {
        teamId: string;
        arrow: 'home' | 'away';
    };
    teams: {
        home: BasketballTeamStateDTO;
        away: BasketballTeamStateDTO;
    };
    matchStatus: {
        isInBonus: { home: boolean; away: boolean };
        timeoutsRemaining: {
            home: number;
            away: number;
        };
    };
    matchFlow: {
        leadTracker: {
            currentLead: number;
            largestLead: { home: number; away: number };
            leadChanges: number;
            ties: number;
        };
        scoreHistory: {
            timestamp: string;
            homeScore: number;
            awayScore: number;
            period: string; // Added period
        }[];
    };
    events: BasketballEventDTO[];
    lineups: {
        home: string[]; // Active player IDs on floor
        away: string[];
    };
}

export interface BasketballTeamStateDTO extends TeamDetailDTO {
    score: number;
    scoreByPeriod: {
        q1: number;
        q2: number;
        q3: number;
        q4: number;
        ot: number[];
    };
    fouls: {
        total: number;
        technical: number;
    };
    stats: {
        fieldGoals: { made: number; att: number };
        threePointers: { made: number; att: number };
        freeThrows: { made: number; att: number };
        rebounds: { off: number; def: number; total: number };
        assists: number;
        steals: number;
        blocks: number;
        turnovers: number;
    };
    players: BasketballPlayerStatsDTO[];
}

export interface BasketballPlayerStatsDTO {
    id: string;
    name: string;
    number: string;
    position: 'PG' | 'SG' | 'SF' | 'PF' | 'C'; // Added
    points: number;
    fieldGoals: { made: number; att: number };
    threePointers: { made: number; att: number };
    freeThrows: { made: number; att: number };
    rebounds: { off: number; def: number; total: number };
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fouls: { personal: number; technical: number };
    minutes: number;
    isOnFloor: boolean;
}

export interface BasketballEventDTO {
    id: string;
    type: 'basket' | 'foul' | 'timeout' | 'substitution' | 'turnover' | 'rebound' | 'assist' | 'steal' | 'block';
    teamId: string;
    playerId?: string;
    playerInId?: string;
    playerOutId?: string;
    points?: number;
    minute: string; // clock time
    description: string;
}

// --- Auth DTOs ---

export interface UserSessionDTO {
    userId: string;
    username: string;
    role: 'super_admin' | 'manager' | 'scorer';
    token: string;
    permissions: string[];
}
