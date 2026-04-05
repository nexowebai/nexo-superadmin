---
title: shadcn/ui
description: Deep knowledge of shadcn/ui components, patterns, and best practices.
---

This skill provides deep knowledge about shadcn/ui components, patterns, and best practices. It enables the assistant to find, install, compose, and customize components using correct APIs and patterns.

## 🚀 Capabilities

- **Automated Installation**: Know how to run `npx shadcn@latest add [component]` to fetch primitives.
- **Project Context**: Always read `components.json` to understand the framework, Tailwind configuration, and aliases.
- **Composition Patterns**: Use shadcn/ui composition rules like `FieldGroup` for forms and semantic colors.
- **Theming**: Manage CSS variables, dark mode, and component variants in `tailwind.config.js` and `global.css`.

## 🛠️ Usage Patterns

### Adding Components
Always use the CLI to add components first:
```bash
npx shadcn@latest add button card dialog
```

### Component Structure
Ensure components are placed in the path defined in `components.json` (usually `src/components/ui`).

### Customization
Customize components by modifying the generated files directly in `src/components/ui` while maintaining the underlying logic.

## 📝 Rules for Shadcn/UI
1. **Never** rewrite the logic of shadcn primitives unless explicitly asked.
2. **Always** check `components.json` before adding new components.
3. **Use** the `cn()` utility for merging class names.
4. **Follow** the accessibility (Radix UI) standards baked into shadcn.

## 🔗 Links
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
