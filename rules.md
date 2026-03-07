# Nexo Super-Admin Architecture & UI/UX Rules

Follow these rules strictly to maintain the institutional-grade quality of the Nexo Super-Admin platform.

## 1. Architectural Integrity
- **Logic Isolation**: Never include business logic, complex state management, or data transformations directly in UI components. Use custom hooks (`useFeature.js`) for all logic.
- **Presentational Orchestration**: Main page components (`Pages/*.jsx`) must act as pure orchestrators, delegating logic to hooks and UI fragmentation to components.
- **Component Fragmentation**: No file should exceed 200 lines. If a component grows, fragment it into smaller, manageable sub-components in the `components/` directory of the feature.
- **Centralized Constants**: All mock data, configuration options, tabs, and status mappings must reside in a `constants/*Data.js` file within the feature folder.
- **API Integration Readiness**: Hooks must be designed to consume TanStack Query, providing a clean interface for UI components regardless of whether data is mocked or real.

## 2. Design System & UI/UX
- **Border Radius**: standard `md` radius (approx 8px-12px) across all cards, buttons, inputs, and modals.
- **Theme Resilience**: Use CSS variables or theme tokens (`var(--primary)`, `var(--bg-surface)`) for all colors. Ensure every component is clearly visible in both Light and high-contrast Dark modes.
- **Institutional Clarity**: Avoid "techy" or developer-centric language. Use professional, operationally focused terminology (e.g., "Infrastructure Status", "Audit Inspector", "State Commit").
- **Aesthetic Premium**: Use subtle micro-animations (Framer Motion), glassmorphism hints, and institutional-grade typography. No standard browser defaults.
- **Visual Feedback**: Every interactive element must have clear hover and active states. Transitions should be smooth (300ms default).

## 3. Component Standards
- **DataTable**: Use the centralized `DataTable` component for all lists. Fragment column definitions into `useMemo` within the table component or hook.
- **Modals**: Use the standard `Modal` system for all details and forms. Modals should be fragmented into their own components if they are complex.
- **Empty & Loading States**: Always provide high-fidelity empty states (with icons and descriptions) and skeletal loading states for every data-driven view.

## 4. Code Quality
- **Clean Imports**: Group imports by: React/Libraries, Layout/Common UI, Feature-specific components, Styles/Utils.
- **No Unused Code**: Instantly delete any unused components, CSS files, or redundant logic identified during refactoring.
- **Institutional Signage**: Use Lucide-react icons consistently for all action signals and telemetry indicators.

---

*Note: Any deviation from these rules is considered technical debt and must be refactored immediately.*
