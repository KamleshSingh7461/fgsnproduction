# FGSN Scoring Engine 🧠

The **Scoring Engine** is the central state machine of the FGSN platform. It handles all real-time scoring data entry, validates sport-specific rules, and broadcasts the current match state to the rest of the microservices.

## 🏏 Cricket Scoring Logic
The engine implements a professional-grade cricket state machine with the following rules:

### 🔄 State Persistence & Synchronization
- **Database-Driven Persistence**: Refactored the `/api/state` endpoint to save match state directly into the Prisma `liveData` column. This replaces the unstable "shared file" approach and ensures each match has its own durable, isolated state.
- **Roster-Aware Hydration**: Corrected the `MatchProvider` initialization to only inject rosters for fresh matches, preventing existing scores and stats from being wiped on refresh.
- **Cross-App Parity**: Updated the Broadcast Overlay to hydrate its state from the Prisma database, ensuring perfect synchronization with the Scorer's tactical interface.
- **Initial Sync Trigger**: Added an automatic broadcast upon first load to ensure realistic rosters are immediately persisted and visible across the network.
*   **Over Completion**: Triggers innings transcripts and bowler rotation every 6 legal deliveries.
*   **Advanced Tracking**: Wagons wheels, pitch maps, and DRS review counters.

---

## 🏀 Basketball Scoring Logic
A high-frequency engine supporting instantaneous game state synchronization.

### Key Logic Features
*   **Clock Controller**: Start/Stop/Reset logic for Game Time and Shot Clock.
*   **Point Attribution**: 1pt (FT), 2pt (FG), and 3pt (3FG) with real-time efficiency calculation.
*   **Foul States**: Automatic calculation of team fouls per period to trigger **BONUS** status.
*   **Possession**: Manual and automatic possession arrow handling.

---

## 🔄 Broadcast State Bus
The engine publishes state updates to the `fgsn_microservice_bus` (BroadcastChannel API).

**Outgoing Event**: `MATCH_UPDATE`
**Payload**: `MatchStateDTO`

---

## 🛠️ Tech Stack
*   **Framework**: Next.js 14+ (App Router).
*   **State**: React Context + Custom `useMatch` hook.
*   **Styles**: Shared UI package with Tailwind CSS v4.

**Port**: 3002
