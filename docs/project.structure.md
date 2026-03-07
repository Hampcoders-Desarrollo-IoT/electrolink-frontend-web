---
title: "Project Structure for: ElectroLink (Vue 3)"
date: 2026-03-07
tags:
  - project-structure
  - architecture
  - vue
  - javascript
  - clean-architecture
  - ddd
stack:
  - Vue 3
  - JavaScript
  - PrimeVue 4
  - Pinia
  - Axios
  - vue-i18n
  - json-server

principles:
  - "[[Clean Architecture (variant)]]"
  - "[[Domain-Driven Design (lite)]]"
  - "[[Repository Pattern (abstracted)]]"
  - "[[Assembler Pattern]]"
---

## 1. Philosophy & Guiding Principles

This project structure is based on the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**, adapted for a frontend application with Vue 3. The primary goal is to achieve a strong separation of concerns by isolating the core business logic (domain) from external frameworks and infrastructure (Vue, HTTP).

- **Domain-Centric:** Business rules and entities (such as `User` and `Category`) reside in the `domain/` layer. These are pure JavaScript/TypeScript classes, independent of Vue.
- **Dependency Rule:** Dependencies flow inwards. **Presentation** (Vue components) depends on **Application** (`Store`), which in turn depends on **Infrastructure** (`Api` services). The **Domain** layer depends on nothing.
- **Assembler Pattern:** "Assemblers" (e.g., `SignInAssembler`) are used to convert data between layers, specifically to map API DTOs/Resources (Infrastructure layer) to Entities (Domain layer).
- **API Abstraction:** Data access infrastructure is abstracted via a generic `BaseApi` and `BaseEndpoint`, which handle standard CRUD operations, and specific implementations like `IamApi` that act as a façade or repository.
- **State Management (Pinia):** The `application` layer uses Pinia stores to manage application state, providing a unidirectional data flow.

---

## 2. Folder Structure Tree

```text
.
├── 📄 .env.development         # Environment variables
├── 📄 package.json
├── 📄 vite.config.js           # Vite configuration
├── 📁 public/
│   └── 📁 assets/
│       └── 📁 i18n/            # Translations
├── 📁 server/
│   ├── 📄 db.json              # json-server database
│   └── 📄 routes.json          # json-server routes
└── 📁 src/
    ├── 📁 features/            # Root for all Bounded Contexts
    │   ├── 📁 iam/             # Bounded Context "Identity & Access Management"
    │   │   ├── 📁 application/
    │   │   │   └── 📄 iam.store.js       # App State & Usecase Orchestration
    │   │   ├── 📁 domain/
    │   │   │   ├── � entities/
    │   │   │   │   └── �📄 user.entity.js
    │   │   │   └── 📁 commands/
    │   │   │       ├── 📄 sign-in.command.js
    │   │   │       └── 📄 sign-up.command.js
    │   │   ├── 📁 infrastructure/
    │   │   │   ├── � services/          # API Facades, Guards, Interceptors
    │   │   │   │   ├── 📄 iam-api.service.js
    │   │   │   │   └── 📄 authentication.guard.js
    │   │   │   ├── � assemblers/        # DTO <-> Entity Mappers
    │   │   │   │   └── 📄 user.assembler.js
    │   │   │   └── 📁 resources/         # API Resources / DTOs
    │   │   │       └── 📄 sign-in.resource.js
    │   │   └── 📁 presentation/
    │   │       ├── 📁 components/        # Dumb Components
    │   │       ├── 📁 views/             # Smart Components (Pages)
    │   │       │   └── 📄 sign-in.component.vue
    │   │       └── 📄 iam-routes.js      # Module Routes
    │   │
    │   └── 📁 profiles/         # Bounded Context "Profiles & Preferences"
    │       ├── 📁 application/
    │       ├── 📁 domain/
    │       ├── 📁 infrastructure/
    │       └──  presentation/
    │
    ├── 📁 shared/              # Shared Kernel (Infrastructure + UI)
    │   ├── 📁 infrastructure/
    │   │   ├── � apis/            # Base Abstract API Classes
    │   │   │   ├── 📄 base-api.js
    │   │   │   └── 📄 base-endpoint.js
    │   │   └── 📁 i18n/            # i18n infrastructure
    │   └── 📁 presentation/
    │       ├── 📁 components/          # Reusable UI (Atomic Components)
    │       └── 📁 views/               # Shared & Public Views (Home, etc.)
    │
    ├── 📄 App.vue
    ├── 📄 main.js
    ├── 📄 router.js            # Router configuration (main)
    ├── 📄 pinia.js              # Pinia instance
    ├── 📄 i18n.js               # i18n configuration
    └── 📁 locales/             # Translation files (en.json, es.json)
```

---

## 3. Core Directory Breakdown

- **`/src/features/[context]`**: Each feature directory represents a **Bounded Context** as per DDD principles.

- **`[context]/domain`**: The heart of the application logic.
  - **`entities/`**: Pure business entities (e.g., `Profile`). Independent of frameworks.
  - **`commands/`**: Command objects (e.g., `UpdatePreferencesCommand`) defining user intent.

- **`[context]/infrastructure`**: Handles technical details and external communication.
  - **`resources/`**: DTOs (Data Transfer Objects) mapping to backend response structures.
  - **`assemblers/`**: Mapping logic that converts `Resources` (infrastructure) to `Entities` (domain) and vice-versa.
  - **`services/`**: API Facades (Repositories) extending `BaseApi`. Must use `*-api.service.js` suffix. Also includes route guards and interceptors.

- **`[context]/application`**: The orchestration layer.
  - **`*.store.js`**: Pinia stores that act as state managers and use-case orchestrators.

- **`[context]/presentation`**: The UI layer.
  - **`views/`**: Smart components representing pages or main feature entry points. **Format: `[name].component.vue`**.
  - **`components/`**: Dumb components that are context-specific.

- **`/src/shared`**: Reusable code across multiple contexts (Shared Kernel).
  - **`infrastructure/apis/`**: Core abstractions like `BaseApi` and `BaseEndpoint`.
  - **`presentation/components/`**: Atomic, highly reusable UI components (e.g., `ElButton`).

---

## 4. Data Flow & Architecture Patterns

### Request Flow (UI Action → State Update)

```
1. UI Component (`.vue`) triggers an event:
    @click="onSignIn()"
        ↓

2. Component method calls the 'Store':
    iamStore.signIn(signInCommand);
        ↓

3. Store (Application) updates state (loading) and calls API Service:
    this.iamApiService.signIn(signInCommand).then(...)
        ↓

4. IamApiService (Infrastructure) delegates to Endpoint:
    return this.signInEndpoint.create(signInCommand);
        ↓

5. BaseEndpoint (Infrastructure) makes HTTP call via Axios:
    return http.post(endpointUrl, data)
        ↓

6. On completion, Store (Application) updates state:
    this.user = user;
    this.isAuthenticated = true;

```

### Response Flow (Data Load → UI)

```

1. Store (Application) initiates load:
    this.profilesApiService.getProfile()
        ↓

2. ProfilesApiService (Infrastructure) calls Endpoint:
    return this.profileEndpoint.get()
        ↓

3. The response is processed, and Assembler maps data:
    const resource = response.data;
    return ProfileAssembler.toEntity(resource);
        ↓

4. The Domain Entity returns to Store
        ↓

5. Store (Application) updates state with Entity:
    this.profile = profile;
        ↓

6. UI reads `store.profile` and updates automatically.
```

---

## 5. Key Patterns Applied

1. **[[Clean Architecture (variant)]]**: Strict layer isolation.
2. **[[Repository Pattern]]**: API Services act as repositories.
3. **[[Assembler Pattern]]**: Isolation level between DTOs and entities.
4. **[[Atomic Design (lite)]]**: Standardized UI components in Shared.

---

## 6. Naming Conventions and Trade-offs

| Layer                   | File Pattern       | Example                       |
| :---------------------- | :----------------- | :---------------------------- |
| **Domain**              | `*.entity.js`      | `user.entity.js`              |
| **Domain**              | `*.command.js`     | `sign-in.command.js`          |
| **Infrastructure**      | `*-api.service.js` | `iam-api.service.js`          |
| **Infrastructure**      | `*.assembler.js`   | `user.assembler.js`           |
| **Infrastructure**      | `*.resource.js`    | `user.resource.js`            |
| **Application**         | `*.store.js`       | `iam.store.js`                |
| **Presentation (View)** | `*.component.vue`  | `sign-in.component.vue`       |
| **Presentation (Dumb)** | `*.component.vue`  | `role-selector.component.vue` |
| **Shared UI**           | `el-*.vue`         | `el-button.vue`               |

---

### Pros

- ✅ **High Testability:** Domain and Application layers can be tested in isolation without Vue or HTTP dependencies.
- ✅ **Separation of Concerns:** Business logic is isolated from UI and data access.
- ✅ **Maintainability:** Changing data sources (e.g., API structure) only affects the Infrastructure layer (Assemblers/DTOs), not the Domain or UI.
- ✅ **Reusability:** Base classes (`BaseApi`, `BaseEndpoint`) significantly reduce boilerplate for new entities.

### Cons

- ❌ **Higher Boilerplate:** Requires creating multiple files for each entity (Entity, Resource, Assembler, Endpoint).
- ❌ **Complexity:** May be over-engineering for very simple CRUD features.
- ❌ **Learning Curve:** Developers must understand DDD and Layered Architecture concepts.

---

## 7. When to Use This Structure

### ✅ Use this structure when:

- Building medium-to-large scale Vue applications.
- Business logic is complex and needs isolation.
- Long-term maintenance and scalability are prioritized.
- Validating alignment with other company projects (e.g. Angular) using the same architecture.

### ❌ Consider simpler alternatives when:

- Building a prototype or MVP with tight deadlines.
- The app is very simple (basic CRUD).
- The team is small and unfamiliar with these patterns.

---

## 8. Testing Strategy

### Unit Tests

- **Domain Layer**: Test business logic in Entity classes.
- **Application Layer**: Test Pinia Stores mocking the API services.
- **Infrastructure Layer**: Test Assemblers and API services (using mocks for axios).

### Integration Tests

- Test the flow from Store to API to verifying correct state updates.

### End-to-End Tests

- Test full user flows (Login, CRUD operations) using Cypress or Playwright.

---

## 9. Related Concepts

- [[Clean Architecture]]
- [[Domain-Driven Design]]
- [[Repository Pattern]]
- [[Assembler Pattern]]
- [[Data Transfer Object (DTO)]]
- [[State Management]]
