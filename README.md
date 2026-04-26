# Nexo Super-Admin | Engineering Portal

![Architecture](https://img.shields.io/badge/Architecture-Institutional-6366f1)
![Performance](https://img.shields.io/badge/Performance-Optimal-brightgreen)
![Security](https://img.shields.io/badge/Security-Audit_Passed-blue)

> **Vision**: To engineer a production-grade admin ecosystem that scales to 15 years of operational life. This portal serves as the single source of truth for our architectural standards and module health.

---

## 🏛️ System Topology
The following high-level visualization shows the unidirectional data flow and strict layering of the Nexo ecosystem.

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#6366f1', 'primaryTextColor': '#fff', 'primaryBorderColor': '#4338ca', 'lineColor': '#818cf8', 'secondaryColor': '#f8fafc', 'tertiaryColor': '#e2e8f0'}}}%%
graph LR
    subgraph View_Layer
        direction TB
        A[Pages] --> B[UI Components]
    end
    
    subgraph Logic_Layer
        direction TB
        C[Headless Hooks] --> D[State Orchestrators]
    end
    
    subgraph Infrastructure_Layer
        direction TB
        E[Service Providers] --> F[Global API Client]
    end
    
    View_Layer --"Logic Request"--> Logic_Layer
    Logic_Layer --"Data Sync"--> Infrastructure_Layer
```

---

## 📂 Feature Module Inventory
Automated audit of all system modules. This registry is synchronized on every local commit.

<!-- FEATURE_INVENTORY_START -->
| Status | Module | Complexity | Nodes | Topology |
| :--- | :--- | :--- | :--- | :--- |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **ADMINS** | 538 LoC | 5 | [Open Spec](./src/features/admins/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **AUTH** | 1130 LoC | 11 | [Open Spec](./src/features/auth/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **BILLING** | 377 LoC | 2 | [Open Spec](./src/features/billing/README.md) |
| ![Stable](https://img.shields.io/badge/-Stable-6366f1) | **CONTENT** | 283 LoC | 2 | [Open Spec](./src/features/content/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **DASHBOARD** | 787 LoC | 4 | [Open Spec](./src/features/dashboard/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **LOGS** | 667 LoC | 4 | [Open Spec](./src/features/logs/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **NOTIFICATIONS** | 512 LoC | 4 | [Open Spec](./src/features/notifications/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **ORGANIZATIONS** | 2452 LoC | 10 | [Open Spec](./src/features/organizations/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **PAYMENTS** | 756 LoC | 3 | [Open Spec](./src/features/payments/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **REQUESTS** | 646 LoC | 5 | [Open Spec](./src/features/requests/README.md) |
| ![Refactor](https://img.shields.io/badge/-Refactor-ef4444) | **SETTINGS** | 870 LoC | 6 | [Open Spec](./src/features/settings/README.md) |
| ![Stable](https://img.shields.io/badge/-Stable-6366f1) | **USERS** | 13 LoC | 1 | [Open Spec](./src/features/users/README.md) |
<!-- FEATURE_INVENTORY_END -->

---

## 🛠️ Engineering Standards

### 🛡️ Zero-Conflict Workflow
This project uses **Husky + Nexo Vision Engine** to ensure that documentation is always up-to-date locally. No more merge conflicts on READMEs.
- Documentation is generated at `git commit`.
- Architectural audits run before the code reaches the server.

### 🚀 Technical Stack
- **Engine**: Vite + React 18
- **Orchestration**: TanStack Query + TanStack Router
- **Visuals**: Framer Motion + Vanilla CSS Variables
- **Reliability**: Strictly Enforced 150-LoC File Limit

---
*Senior Lead Architect: Nexo Engineering AI*
