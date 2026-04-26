# Nexo Super-Admin | Engineering Specification

![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)
![Version](https://img.shields.io/badge/Version-3.1.0-blue)
![Quality](https://img.shields.io/badge/Code_Quality-Institutional-gold)
![License](https://img.shields.io/badge/License-Proprietary-red)

## System Vision
The Nexo Super-Admin is a mission-critical infrastructure dashboard designed for extreme reliability and operational transparency. This repository enforces a strictly layered architectural pattern, ensuring that business logic is fully decoupled from the view layer and infrastructure providers.

---

## Technical Specification

### Architectural Core
- **Logic Layer**: Headless React Hooks orchestrate 100% of the application's state and business rules.
- **Service Layer**: Centralized API providers manage data normalization and external connectivity (Supabase/Rest).
- **View Layer**: Atomic UI components, fragmented for maximum reusability and strictly restricted to <150 lines per file.

### Technology Stack
| Category | Technology |
| :--- | :--- |
| **Framework** | React 18 (Vite) |
| **State Management** | TanStack Query v5 |
| **Routing** | TanStack Router |
| **UI/UX** | Framer Motion + Vanilla CSS Tokens |
| **Visualization** | Recharts / Visx |

---

## Operational Health Audit

### Feature Module Registry
The following table summarizes the health and architectural compliance of the system's core modules.

<!-- FEATURE_INVENTORY_START -->
| Status | Feature Module | Logic Density | Nodes | Specs |
| :--- | :--- | :--- | :--- | :--- |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **ADMINS** | 538 LoC | 5 | [Detailed Specs](./src/features/admins/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **AUTH** | 1130 LoC | 11 | [Detailed Specs](./src/features/auth/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **BILLING** | 377 LoC | 2 | [Detailed Specs](./src/features/billing/README.md) |
| ![Stable](https://img.shields.io/badge/-Stable-brightgreen) | **CONTENT** | 283 LoC | 2 | [Detailed Specs](./src/features/content/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **DASHBOARD** | 787 LoC | 4 | [Detailed Specs](./src/features/dashboard/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **LOGS** | 667 LoC | 4 | [Detailed Specs](./src/features/logs/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **NOTIFICATIONS** | 512 LoC | 4 | [Detailed Specs](./src/features/notifications/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **ORGANIZATIONS** | 2452 LoC | 10 | [Detailed Specs](./src/features/organizations/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **PAYMENTS** | 756 LoC | 3 | [Detailed Specs](./src/features/payments/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **REQUESTS** | 646 LoC | 5 | [Detailed Specs](./src/features/requests/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-red) | **SETTINGS** | 870 LoC | 6 | [Detailed Specs](./src/features/settings/README.md) |
| ![Stable](https://img.shields.io/badge/-Stable-brightgreen) | **USERS** | 13 LoC | 1 | [Detailed Specs](./src/features/users/README.md) |
<!-- FEATURE_INVENTORY_END -->

---

## Deployment & Development

### Local Environment Setup
```bash
# Initialize dependency tree
npm install

# Execute development environment
npm run dev

# Perform architectural audit
npm run lint
```

### CI/CD Pipeline
Every pull request and merge to `main` undergoes an automated **Technical Documentation Sync**. This ensures that the system's topology and Mermaid diagrams are always perfectly aligned with the source code.

---
*Technical Lead: Nexo Engineering AI | Internal Documentation*
