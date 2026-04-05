# Nexo Admin Production-Grade Architecture

This document outlines the high-level, 15-year architect-level standards enforced on this codebase.

## 🏛️ Core Principles

1.  **Monolithic Decomposition**: No single file exceeds 150 lines. Complex logic is delegated to headless hooks.
2.  **Unidirectional Data Flow**: State flows from TanStack Query (Server) or Core Context (Auth/Session) down to Pure Components.
3.  **Strict Layering**:
    - **Core (`src/core/`)**: Foundation (Auth, Session, Global API Client, Shared Contexts).
    - **Features (`src/features/`)**: High-level domain-driven modules. Self-contained with their own services, hooks, components, and docs.
    - **UI Atoms (`src/components/ui/`)**: Reusable, modular primitive UI elements.
    - **Shared Utils (`src/core/utils/`)**: Project-wide formatting and helper functions.

## 📂 Structural Standards

### Feature Isolation Pattern

Every feature folder (e.g., `src/features/organizations`) MUST follow this layout:

- `services/`: Feature-exclusive API client methods (thin wrappers around `@api`).
- `hooks/`: Feature business logic. Orchestrates API calls and local state. Uses naming like `use{Feature}Page.js`.
- `components/`: UI components. Split into sub-folders if more than 5.
- `pages/`: Route-level entry points. Primarily orchestrates hooks and sub-components.
- `constants/`: Feature configs, table settings, and static data.
- `styles/`: Localized CSS for the feature.
- `docs/`: README.md describing internal data flow via Mermaid.

### API Handling Standards

- **Client**: Standardized `apiClient` with interceptors for 401 handling, bearer tokens, and session expiry.
- **Services**: Services return Promises and do NOT handle UI notifications. Notifications are handled in Hooks/Components via `notify.promise`.
- **Query Keys**: Centralized in `@lib/queryClient.js` to ensure cache consistency.

## 🚀 Optimized Workflow (TURBO-ALL)

1.  **Identify Feature Boundaries**: Keep domain logic inside the feature folder.
2.  **Abstract State**: If a component has >5 pieces of state or >5 handlers, move them to a headless hook.
3.  **Optimize Rendering**: Use `useMemo` for heavy data transformations and `useCallback` for event handlers passed to deep children.
4.  **Atomic UI**: Never duplicate button or input styles. Create or extend components in `@components/ui`.

---

_Archived by Antigravity AI Blueprint - 2026_
