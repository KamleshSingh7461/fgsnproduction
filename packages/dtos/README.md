# Scoring Engine Data Schema Design 📊

This document outlines the normalized data structure for the FGSN Scoring & Graphics Engine. It is the definitive source for the contracts defined in `@fgsn/dtos`.

## 1. Root Structure
Every match payload follows this strictly typed structure.

```typescript
interface MatchStateDTO {
  matchId: string;
  sport: 'cricket' | 'football' | 'basketball' | 'tennis' | 'custom';
  status: 'scheduled' | 'live' | 'break' | 'finished' | 'abandoned';
  
  // 1. Metadata (Static context)
  meta: MatchMetadataDTO;
  
  // 2. Live Game State (The changing numbers)
  liveData: CricketStateDTO | BasketballStateDTO; // Union Type
  
  // 3. Score Summary (Aggregated for quick display)
  scoreSummary: {
    home: string; // "120/4" or "85"
    away: string;
  };
}
```

---

## 2. Shared Meta Components

### Match Metadata
```typescript
interface MatchMetadataDTO {
  tournamentName: string;
  venue: string;
  startTime: string; // ISO 8601
  officials?: {
    referee?: string;
    umpires?: string[];
  };
}
```

---

## 3. Cricket Specifications (Broadcast Grade)
The Cricket module is 100% compliant with professional broadcasting standards.

### `CricketStateDTO`
*   **`overs`**: String representation (e.g., "14.2").
*   **`runRate`**: Dynamic CRR calculation.
*   **`striker / nonStriker`**: Detailed batting stats (runs, balls, 4s, 6s).
*   **`bowler`**: Dynamic bowling figures (overs, maidens, runs, wickets, economy).
*   **`thisOver`**: Array of ball outcomes for the current over tracker.
*   **`inningsTranscript`**: Historical over-by-over snapshots for Manhattan graphs.
*   **`projections`**: Real-time score predictions at current, 6.0, 8.0, and 10.0 RPO.
*   **`milestones`**: Animated reactive triggers for 50s, 100s, and wickets.
*   **`matchSituation`**: DLS targets, Free Hits, and Powerplay status.

---

## 4. Basketball Specifications (FIBA/NBA Grade)
Designed for high-frequency updates and pixel-perfect clock synchronization.

### `BasketballStateDTO`
*   **`clock`**: 
    *   `period`: Q1, Q2, Q3, Q4, OT.
    *   `gameTime`: Main match timer (e.g., "10:42").
    *   `shotClock`: 24/14 second countdown.
*   **`possession`**: Team ID and direction arrow tracking.
*   **`matchStatus`**: 
    *   `isInBonus`: Automated foul penalty detection (Home/Away).
    *   `timeoutsRemaining`: Tracking for strategic breaks.
*   **`teams`**: 
    *   `scoreByPeriod`: Breakdown of scoring across quarters.
    *   `fouls`: Team foul counters for bonus calculation.
    *   `stats`: Detailed FG%, 3P%, FT%, and rebound tracking.

---

## 5. Event Protocol
All scoring events are logged as atomic units to allow for full match replays and auditing.

```typescript
interface MatchEvent {
  id: string;
  timestamp: string;
  matchTime: string;
  type: 'ball' | 'basket' | 'foul' | 'period-end';
  description: string;
}
```

---

## 🛠️ Package Integration
This schema is exported from `@fgsn/dtos` and utilized by:
1.  **Apps**: `scoring-engine`, `broadcast-overlay`, `admin-dashboard`.
2.  **Logic**: Validated by the `MatchContext` state machines.
3.  **UI**: Driven by the `@fgsn/ui` premium design system.
