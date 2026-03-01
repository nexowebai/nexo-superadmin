# Nexo Admin Frontend

A FAANG-level React admin panel for the Nexo enterprise data management platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

### Theme Management
All colors and design tokens are centralized in `src/styles/design-tokens.css`.

**Light/Dark Mode:**
- Theme is managed via `ThemeContext`
- Only adds/removes `light-mode` class on `<body>`
- No JavaScript theme switching - pure CSS

### Color Tokens
```css
--ds-bg-base       /* Primary background */
--ds-text-primary  /* Primary text */
--ds-brand-500     /* Primary brand color */
--ds-success-base  /* Success semantic color */
--ds-chart-1       /* Chart color 1 */
```

## 🎭 Animation System

Motion presets are in `src/lib/motion.js`:

```jsx
import { fadeInUp, staggerContainer } from '@lib/motion';

<motion.div {...fadeInUp}>
  Animated content
</motion.div>
```

## 📦 Project Structure

```
src/
├── app/           # Redux store config
├── assets/        # Static assets
├── components/    # Reusable components
│   ├── ui/        # Core UI (Button, Card, Input)
│   ├── layout/    # Layout (Sidebar, Header)
│   └── common/    # Business components
├── config/        # App configuration
├── constants/     # Constants (roles, status)
├── context/       # React contexts
├── features/      # Feature modules
├── guards/        # Route guards
├── hooks/         # Custom hooks
├── lib/           # Utilities (motion, chart-theme)
├── routes/        # App routing
├── services/      # API services
├── styles/        # Global CSS
└── utils/         # Helper functions
```

## 🛠 Tech Stack

- **React 18** with Vite
- **Redux Toolkit** + **Zustand** for state
- **React Query** for server state
- **Framer Motion** for animations
- **Recharts** for charts
- **React Router v6** for routing
- **Sonner** for toasts
- **Lucide React** for icons

## 📝 Code Standards

- Component files: `ComponentName.jsx`
- Style files: `ComponentName.css`
- No inline styles for visual design
- All colors from CSS variables
- Skeleton loaders built into components
