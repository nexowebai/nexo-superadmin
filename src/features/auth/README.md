# Technical Specification: AUTH

![Architecture](https://img.shields.io/badge/Pattern-Clean_Architecture-blue)
![Quality](https://img.shields.io/badge/Audit-Needs_Refactor-red)
![Complexity](https://img.shields.io/badge/Logic_Nodes-11-blueviolet)

## 🏛️ Domain Architecture

### Execution Sequence
How the view orchestrates logic through the headless hook layer.

```mermaid
sequenceDiagram
    participant P as ForgotPasswordPage.jsx
    participant H as useForgotPasswordPage.js
    participant S as authService.js
    participant API as Supabase/API

    P->>H: Initialize hook & states
    H->>S: Fetch domain datasets
    S->>API: Execute query command
    API-->>S: Return recordset
    S-->>H: Normalize for view model
    H-->>P: Reactive update to UI
```

### Dependency Topology
A visual map of file-level relationships within the auth module.

```mermaid
graph TD
    classDef page fill:#f9f,stroke:#333,stroke-width:2px;
    classDef hook fill:#bbf,stroke:#333,stroke-width:2px;
    classDef service fill:#bfb,stroke:#333,stroke-width:2px;

    ForgotPasswordPage[ForgotPasswordPage.jsx]:::page
    ForgotPasswordPage --> useForgotPasswordPage
    LoginPage[LoginPage.jsx]:::page
    LoginPage --> useLoginPage
    ResetPasswordPage[ResetPasswordPage.jsx]:::page
    ResetPasswordPage --> useResetPasswordPage
    SetPasswordPage[SetPasswordPage.jsx]:::page
    index[index.jsx]:::page
    useAuthMutations(useAuthMutations.js):::hook
    useAuthMutations --> authService
    useForgotPasswordPage(useForgotPasswordPage.js):::hook
    useForgotPasswordPage --> authService
    useLoginPage(useLoginPage.js):::hook
    useLoginPage --> authService
    useProfile(useProfile.js):::hook
    useProfile --> authService
    useResetPasswordPage(useResetPasswordPage.js):::hook
    useResetPasswordPage --> authService
    authService{authService.js}:::service
    authService --> API_Client((Global API Client))
```

## 📂 Implementation Audit

### 📄 Presentation (Pages)
| Entity | Logic Link | Complexity |
| :--- | :--- | :--- |
| `ForgotPasswordPage.jsx` | Direct | 125 LoC |
| `LoginPage.jsx` | Direct | 130 LoC |
| `ResetPasswordPage.jsx` | Direct | 171 LoC |
| `SetPasswordPage.jsx` | Isolated | 262 LoC |
| `index.jsx` | Isolated | 5 LoC |

### ⚓ Headless Logic (Hooks)
| Controller | Domain Exports | Status |
| :--- | :--- | :--- |
| `useAuthMutations.js` | 4 handlers | Stable |
| `useForgotPasswordPage.js` | 1 handlers | Stable |
| `useLoginPage.js` | 1 handlers | Stable |
| `useProfile.js` | 1 handlers | Stable |
| `useResetPasswordPage.js` | 1 handlers | Stable |

### ⚡ Infrastructure (Services)
| Provider | Connectivity | Exports |
| :--- | :--- | :--- |
| `authService.js` | Global API | 1 methods |

## 🎓 Technical Interview Highlights
- **Layered Decoupling**: The View Layer (5 nodes) has zero knowledge of API protocols, interacting only through `useAuthMutations`.
- **Service Abstraction**: `authService` encapsulates all Supabase/REST logic, allowing for provider-agnostic business logic.
- **State Management**: Uses TanStack Query for server state and local useState/useReducer for UI-only transient states.

---
*Verified by Nexo Engineering Standards v5.0 | 2026*
