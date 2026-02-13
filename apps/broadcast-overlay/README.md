# FGSN Broadcast Overlay 📺

The **Broadcast Overlay** is a high-performance graphics renderer designed for professional live stream integration. it consumes real-time match data and renders TV-grade scoreboards with zero latency.

## 🚀 Performance Optimization (60 FPS)
This microservice is optimized for smooth, stutter-free rendering in broadcast software (e.g., OBS, vMix).

*   **GPU Acceleration**: Uses `will-change: transform, opacity` hints to force hardware rendering on all dynamic elements.
*   **Memoized Components**: Leverages `React.memo` to eliminate unnecessary re-renders of the scoreboard when non-visual data changes.
*   **Low-Latency Polling**: Implements a high-frequency **500ms** sync layer with intelligent state guarding.
*   **Vector Scaling**: All graphics are SVG and CSS-driven for perfect clarity at any resolution (720p to 4K).

---

## 🎨 Unified Graphics Engine
A single application that dynamically switches layout based on the sport state.

### Cricket Layout
- [x] **Dynamic Lower Third**: Displays runs, wickets, and overs.
- [x] **Milestone Popups**: Animated alerts for 50s, 100s, and wickets.
- [x] **Ball Speed**: Real-time speed flashes triggered by the scorer.
- [x] **Over Tracker**: Visual log of the current over's progress.

### Basketball Layout
- [x] **FIBA-Grade Scoreboard**: Period scores and team totals.
- [x] **Live Clocks**: Synchronized Game Clock and Red-Alert Shot Clock.
- [x] **Bonus Indicators**: Pulsing alerts when a team is in the foul bonus.
- [x] **Possession Logic**: Animated indicators for ball control.

---

## 🛠️ Usage
1.  Ensure the **Scoring Engine** is running on Port 3002.
2.  Navigate to `http://localhost:3003` in a browser or browser-source.
3.  The overlay will automatically wait for a signal and render the graphics.

**Design System**: Premium Glassmorphism (via `packages/ui`).
