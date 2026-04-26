# 🏔️ NEXO ARCHITECT: Design Governance & Engineering Rules

This document defines the strict architectural and design patterns for the Nexo Super-Admin project. All development (human or AI) MUST adhere to these rules to maintain institutional-grade code quality.

## 1. Directory Structure (Domain-Driven)
Features must follow a strict sub-folder hierarchy to prevent component "messiness":
- `src/features/[feature]/components/detail/`: Component-level detail views.
- `src/features/[feature]/components/form/`: Form sections and inputs.
- `src/features/[feature]/components/table/`: Table definitions, columns, and toolbars.
- `src/features/[feature]/components/modals/`: Feature-specific modal containers.
- `src/features/[feature]/styles/`: Modular CSS files (e.g., `org-detail.css`).

## 2. Style Governance (Zero Technical Debt)
- **NO INLINE STYLES**: Using `style={{...}}` is strictly forbidden. Use semantic CSS classes.
- **Variable-First**: Always use project design tokens (`var(--primary)`, `var(--bg-surface)`, `var(--radius-xl)`).
- **Modular CSS**: Components must import their specific style file (e.g., `import "../../styles/org-table.css"`).
- **Shimmer & Motion**: Use `framer-motion` for micro-interactions and `ds-card--shimmer` for containers.

## 3. Component Standards
- **Strict 200-Line Limit**: No component file should exceed **200 lines**. Exceeding this triggers a **Critical Violation** (hard block in Husky).
- **150-Line Warning**: Files between **150-200 lines** are flagged as Warnings. Modularize early to stay under 150.
- **Centralized Skeletons**: Use global skeletons from `@components/skeletons` for loading states.
- **Static Registry**: Shared options (tiers, statuses, labels) must reside in `constants/` files.

## 4. Import Strategy
- Use absolute aliases for clarity:
  - `@components/*`
  - `@features/*`
  - `@utils/*`
  - `@lib/*`
- Relative imports should only be used for sibling files (same folder).

## 5. Automated Review
- **Husky Hooks**: Every commit triggers an architectural audit.
- **Pulse Dashboard**: The `scripts/generate-pulse-dashboard.js` utility generates a feature health report in `index.html`.
- **Violations**: Any deviation from these rules will be flagged by the Nexo Audit Engine.

---
*Authorized by Nexo Command Architect*
