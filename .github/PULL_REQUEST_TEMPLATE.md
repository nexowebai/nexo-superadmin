# 🚀 NEXO-ADMIN PR CHECKLIST

## 📋 General Information
- **Feature Name**: [Feature name here]
- **Type**: (Feat/Fix/Refactor/Style)

## ✅ Strict Architecture Compliance
- [ ] NO `async/await` used (only `.then().catch()`).
- [ ] NO Optional Chaining (`?.`) used.
- [ ] NO console logs in code.
- [ ] ALL files are under 150 lines.
- [ ] Each file has a single responsibility.
- [ ] Feature follows the 5-folder structure (`ui/`, `components/`, `hooks/`, `services/`, `styles/`).

## 🎨 Design & Logic
- [ ] All colors and spacing come from global theme tokens.
- [ ] Component is optimized with React Query (if applicable).
- [ ] Types are strictly defined (No `any`).

## ⚙️ Testing
- [ ] Verified locally with `npm run dev`.
- [ ] ESLint passes locally with no warnings.

---
**Why this PR matters:**
[Detailed explanation of the changes and their impact on scalability]
