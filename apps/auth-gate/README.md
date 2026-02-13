# FGSN Auth-Gate 🔐

The **Auth-Gate** is the centralized authentication and authorization service for the FGSN platform. It acts as the gateway for all internal microservices.

## 🚀 Responsibilities
*   **SSO Management**: Centralized login for Scorers, Managers, and Super Admins.
*   **Session Issuance**: Generates secure tokens for cross-service authentication.
*   **RBAC Enforcement**: Validates user roles and permissions before allowing access to the Brain (Scoring) or Management (Admin) apps.

## 🛠️ Tech Stack
*   **Framework**: Next.js 14+ (App Router).
*   **Role Logic**: Strictly follows the `UserSessionDTO` contract defined in `@fgsn/dtos`.

**Port**: 3000
