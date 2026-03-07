---
title: "Project Structure for: daos-learning-center-v2520 (Vue 3)"
date: 2026-02-18
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
├── 📄 .env.development        # Environment variables
├── 📄 package.json
├── 📄 vite.config.js          # Vite configuration
├── 📁 public/
│   └── 📁 assets/
│       └── 📁 i18n/           # Translations
├── 📁 server/
│   ├── 📄 db.json             # json-server database
│   └── 📄 routes.json         # json-server routes
└── 📁 src/
    ├── 📁 iam/                # Bounded Context "Identity & Access Management"
    │   ├── 📁 application/
    │   │   └── 📄 iam.store.js       # App State & Usecase Orchestration
    │   ├── 📁 domain/
    │   │   ├── 📄 user.entity.js     # Domain Entity
    │   │   ├── 📄 sign-in.command.js # Command Object
    │   │   └── 📄 sign-up.command.js
    │   ├── 📁 infrastructure/
    │   │   ├── 📄 iam-api.js         # API Facade / Repository
    │   │   ├── 📄 iam.interceptor.js # Axios Interceptor
    │   │   ├── 📄 authentication.guard.js # Router Guard
    │   │   ├── 📄 sign-in.assembler.js   # DTO <-> Entity Mapper
    │   │   ├── 📄 sign-in.resource.js    # API Resource / DTO
    │   │   └── 📄 user.assembler.js
    │   └── 📁 presentation/
    │       ├── 📁 components/        # Dumb Components
    │       ├── 📁 views/             # Smart Components (Pages)
    │           ├── 📄 sign-in.component.vue
    │           └── 📄 sign-up.component.vue
    │       └── 📄 iam-routes.js      # Module Routes
    │
    ├── 📁 publishing/         # Bounded Context "Publishing"
    │   ├── 📁 application/
    │   │   └── 📄 publishing.store.js
    │   ├── 📁 domain/
    │   │   └── 📄 category.entity.js
    │   ├── 📁 infrastructure/
    │   │   ├── 📄 publishing-api.js
    │   │   ├── 📄 category.assembler.js
    │   │   └── 📄 tutorial.assembler.js
    │   └── 📁 presentation/
    │       └── 📁 views/
    │           └── 📄 category-management.component.vue
    │
    ├── 📁 shared/             # Shared Kernel (Infrastructure + UI)
    │   ├── 📁 infrastructure/
    │   │   ├── 📄 base-api.js          # Base Abstract API Class
    │   │   └── 📄 base-endpoint.js     # Generic CRUD Endpoint Implementation
    │   └── 📁 presentation/
    │       ├── 📁 components/          # Reusable UI (DataManager, etc.)
    │       └── 📁 views/               # Shared & Public Views (Home, About, etc.)
    │           ├── 📄 about.vue
    │           ├── 📄 home.vue
    │           └── 📄 page-not-found.vue
    │
    ├── 📄 App.vue
    ├── 📄 main.js
    ├── 📄 router.js           # Router configuration
    ├── 📄 pinia.js            # Pinia instance
    ├── 📄 i18n.js             # i18n configuration
    └── 📁 locales/            # Translation files (en.json, es.json)
```

---

## 3. Core Directory Breakdown

- **`/src/iam`**: The main module for Identity Management, organized as a **Bounded Context**.
- **`/src/iam/domain`**: The heart of the application.
    - `*.entity.js`: Pure business entities (e.g., `User`). These classes define the data structure and core business logic, independent of Vue or API structures.
    - `*.command.js`: Objects representing user intents or commands (e.g., `SignInCommand`), often used as arguments for use cases.

- **`/src/iam/infrastructure`**: The outermost layer; handles technical details of data access.
    - `*.resource.js`: DTOs (Data Transfer Objects) defining the structure of data exactly as it comes from the API.
    - `*.assembler.js`: Classes responsible for mapping (assembling) between Infrastructure DTOs/Resources and Domain Entities.
    - `iam-api.js`: A "Facade" service acting as a Repository. It composes `BaseEndpoint` instances to provide a cohesive API for the application layer.
    - `BaseEndpoint` (in Shared): Implements generic CRUD logic, abstracting the HTTP client.

- **`/src/iam/application`**: The orchestration layer (Use Cases).
    - `iam.store.js`: Acts as the use case orchestrator and state manager (Pinia). It is injected into the Presentation layer. It calls `IamApi` (Infrastructure) to fetch/modify data and updates the application state so the UI reacts.

- **`/src/iam/presentation`**: The UI layer.
    - `views/`: Vue components (Pages) that the user sees. these components read state from the `Store` and dispatch actions (e.g., `store.signIn(...)`).

- **`/src/publishing`**: The module for content management, organized as a **Bounded Context**.
- **`/src/shared`**: A "Shared Kernel" containing code reusable by multiple contexts.
    - `infrastructure/`: Abstract base classes (`BaseApi`, `BaseEndpoint`) defining contracts for the infrastructure layer.
    - `presentation/`: Shared UI components (`DataManager`) and generic views (Home, About, etc.).

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
       
3. Store (Application) updates state (loading) and calls API:
   this.iamApi.signIn(signInCommand).then(...)
        ↓

4. IamApi (Infrastructure) delegates to Endpoint:
   return this.signInEndpoint.create(signInCommand);
        ↓

5. BaseEndpoint (Infrastructure) makes HTTP call:
   return http.post(endpointUrl, data)
        ↓

6. On completion, Store (Application) updates state:
   this.user = user;
   this.isAuthenticated = true;

```

### Response Flow (Data Load → UI)

```

1. Store (Application) initiates load:
   this.publishingApi.getAllCategories()
        ↓

2. PublishingApi (Infrastructure) calls Endpoint:
   return this.categoriesEndpoint.getAll()
        ↓

3. BaseEndpoint (Infrastructure) makes HTTP call:
   return http.get(this.endpointUrl)
        ↓

4. The response is processed, and Assembler maps data:
   const resources = response.data;
   return resources.map(r => CategoryAssembler.toEntity(r));
        ↓

5. Array of Entities (Domain) returns to Store
        ↓

6. Store (Application) updates state with Entities:
   this.categories = categories;
        ↓

7. UI (`CategoryList`) reads `store.categories` and updates automatically.
```

### Key Patterns Applied

1. **[[Clean Architecture (variant)]]**: Strict separation into layers (Domain, Application, Infrastructure, Presentation).
2. **[[Repository Pattern (abstracted)]]**: `IamApi`/`PublishingApi` act as Repositories, and `BaseEndpoint` abstracts data access implementation.
3. **[[Assembler Pattern]]**: `*.assembler.js` classes map between DTOs (Infrastructure) and Entities (Domain).
4. **[[State Management (Pinia)]]**: Stores centralize application state and use case logic.
5. **[[Shared Kernel]]**: `BaseApi` and generic components reduce boilerplate for new contexts.

---

## 5. Code Examples

### Core Layer (Domain)

```javascript
// /src/iam/domain/user.entity.js
export class User {
  constructor(id = 0, username = "") {
    this.id = id;
    this.username = username;
  }
}
```

### Infrastructure Layer (Assembler & API)

```javascript
// /src/iam/infrastructure/sign-in.assembler.js
import { SignInResource } from "./sign-in.resource.js";

export class SignInAssembler {
  static toResourceFromResponse(response) {
    if (response.status !== 200) {
      return null;
    }
    return new SignInResource(response.data);
  }
}
```

```javascript
// /src/iam/infrastructure/iam-api.js
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

export class IamApi extends BaseApi {
  constructor() {
    super();
    this.signInEndpoint = new BaseEndpoint(this, "/sign-in");
    this.signUpEndpoint = new BaseEndpoint(this, "/sign-up");
  }

  signIn(signInRequest) {
    return this.signInEndpoint.create(signInRequest);
  }
}
```

### Application Layer (Store)

```javascript
// /src/iam/application/iam.store.js
import { defineStore } from "pinia";
import { IamApi } from "../infrastructure/iam-api.js";

export const useIamStore = defineStore("iam", {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    async signIn(signInCommand) {
      const api = new IamApi();
      const result = await api.signIn(signInCommand); // logic to use assembler and update state
    },
  },
});
```

---

## 6. Key Trade-offs

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

---

## 10. Additional Resources

### Official Documentation

- [Vue 3 Documentation](https://vuejs.org/)

- [Pinia State Management](https://pinia.vuejs.org/)

- [Axios](https://axios-http.com/)

### Recommended Libraries/Tools

- **PrimeVue**: UI Components.

- **json-server**: Fake REST API.

---

## 11. Migration Notes

_(Not applicable for new projects)_
