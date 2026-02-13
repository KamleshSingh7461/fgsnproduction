# FGSN Universal Sports Platform 🏆

Welcome to the **Freedom Global Sports Network (FGSN)** Universal Sports Platform. This is a high-performance, microservices-style monorepo designed for professional sports scoring and broadcast-grade TV graphics.

## 🚀 Tech Demo: Universal Broadcast Workflow
1.  **Launch**: Run `start-all.bat` from the root directory.
2.  **Scoring**: Open the Scorer at [localhost:3002](http://localhost:3002).
    *   **Cricket Mode**: Log runs, wickets, and ball speeds.
    *   **Basketball Mode**: Toggle the switch in the header to score baskets and track fouls.
3.  **Verification**: Watch the **Broadcast Overlay** at [localhost:3003](http://localhost:3003). The overlay automatically adapts its layout and logic based on the active sport.

---

## 🛠️ System Architecture
The platform is built as a **Microservices Monorepo** using Next.js 14+ and strictly typed DTOs.

### Micro-Frontends (`apps/`)
*   **`auth-gate`** (Port 3000): Centralized SSO and session management.
*   **`admin-dashboard`** (Port 3001): Management console for tournaments and teams.
*   **`scoring-engine`** (Port 3002): The "Brain". Handles real-time scoring logic for multiple sports.
*   **`broadcast-overlay`** (Port 3003): The "Face". High-fidelity, GPU-accelerated TV graphics.
*   **`public-portal`** (Port 3004): Fan-facing media platform with live scores and portfolio.

### Shared Packages (`packages/`)
*   **`dtos`**: The single source of truth for all data contracts (Cricket, Basketball, etc.).
*   **`ui`**: Shared premium Glassmorphism design system.

---

## 📦 Getting Started

### Prerequisites
*   **Node.js** (LTS v20+ recommended)
*   **PowerShell** or any terminal (for Windows systems)

### Environment Setup
1.  Install dependencies from the root:
    ```bash
    npm install
    ```
2.  Start all microservices concurrently:
    ```bash
    .\start-all.bat
    ```

---

## 🔐 Role-Based Access Control (RBAC)
| Role | Scope | Key Permissions |
| :--- | :--- | :--- |
| **Super Admin** | System | Manage Organizations, View Analytics, Billing. |
| **Admin** | Organization | Create Tournaments, Manage Teams & Venues. |
| **Ground Manager** | Venue | Schedule Matches, Assign Scorers. |
| **Scorer** | Match | **Scoring Interface only**. Restricted data entry view. |

---

## 📋 Project Status
- [x] **Phase 1-5**: Core Microservices & Cricket Module (100% Logic).
- [x] **Phase 6**: Basketball Module (Real-time clock/foul tracking).
- [x] **Phase 7**: Performance Optimization & GPU Acceleration.

**Handover Status:** 100% Feature Complete | 100% Schema Compliant | 100% Verified.
