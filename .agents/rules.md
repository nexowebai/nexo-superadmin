---
description: REACT JS & TAILWIND Optimization and Modularization Governance for Nexo-Admin
---

# 🚀 NEXO-ADMIN REACT JS PROJECT RULES (V3)

## 🛑 STRATOSPHERE CORE RULES
- **No `async/await`**: Use `.then().catch()` ONLY for all API operations and effects.
- **No Optional Chaining (`?.`)**: Use explicit logic/guards to ensure predictability.
- **No Console Logs**: Use only the centralized logging or proper UI error boundaries.
- **Max 150 Lines/File**: STRICT limit. If a file grows beyond 150 lines, it MUST be modularized immediately.
- **One File = One Responsibility**: Single export per component/hook/service to ensure reusability.

## 📁 ARCHITECTURAL STANDARDS
Features MUST be isolated and follow this pattern:
`src/features/{FeatureName}/`
1.  **`services/`**: Feature-specific API calls and data services.
2.  **`hooks/`**: Feature-specific hooks. Complex components (>100 lines) MUST use a headless hook for logic.
3.  **`components/`**: Pure UI or orchestrated components.
4.  **`styles/`**: Dedicated CSS using feature-level scope.
5.  **`docs/`**: Feature-level documentation with Mermaid diagrams.
6.  **`index.js`**: Clean feature exports.

**Core Separation Rule**: Component MUST NOT have API calls or complex logic (>5 lines of state management).
**Headless Hooks**: Logic must be encapsulated in `hooks/use{Feature}Stats.js` or `hooks/use{Component}Table.js`.
**File Limit**: Max 150 lines per file (Strict).

## 🤖 AUTOMATION & BEST PRACTICES
- **React JS & Tailwind**: Core technologies for all UI development.
- **Tailwind Consistency**: Use predefined project theme tokens for colors, spacing, and shadows.
- **Minimal Comments**: The code must be self-documenting through clear naming and modular structure.
- **Clean & Optimized**: Remove all unused variables, dead code, and redundant logic.
- **Single Source of Truth**: Data flow must be unidirectional; avoid state drift between components.

## 🏛️ GOVERNANCE
1. **Clean Code Protocol**: Every commit must ensure the shortest, most efficient logic possible.
2. **Modular Documentation**:
    - Every feature (especially complex ones) MUST include a `docs/` folder.
    - Inside `docs/`, use `.md` files with Mermaid diagrams to explain data flow.
3. **150-Line Threshold**: Any file reaching 150 lines is a signal for immediate refactoring.
4. **Reusable over Redundant**: Common UI patterns should be extracted into the `ui/` or `common/` component layers.
