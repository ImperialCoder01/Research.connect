# Research Connect — Coding Standards & Guidelines

This document outlines the coding standards, patterns, and constraints enforced across **Research Connect** codebase.

---

## 🏛️ General Rules
- **No Quick Fixes**: Code must be production-ready. No hardcoded credentials, duplicate functions, or debug snippets in committed files.
- **Strict Separation of Concerns**: 
  - Controllers only process inputs and route delegation.
  - Services contain all business logic.
  - Repositories handle MongoDB Mongoose interactions.
  - React Components only handle rendering and layout bindings.

---

## 💻 Backend Standards

### 1. Repository Extensibility
Every repository must extend the `BaseRepository` class to benefit from default CRUD engines.
```javascript
const BaseRepository = require('../../../common/repository/base.repository');
const MyModel = require('../../../models/MyModel');

class MyRepository extends BaseRepository {
  constructor() {
    super(MyModel);
  }
}
```

### 2. Service Extensibility
Every service should inherit from `BaseService` to inherit standard pagination, error checking, and transactions.
```javascript
const { BaseService } = require('../../../common/service');

class MyService extends BaseService {
  constructor(myRepository) {
    super(myRepository);
  }
}
```

### 3. Response Contracts
All API endpoints must return standardized JSON responses. Use `ApiResponse` methods inside controllers:
- **Success (200 / 201)**:
  ```json
  {
    "success": true,
    "message": "Resource fetched successfully",
    "data": { ... },
    "error": null
  }
  ```
- **Error (4xx / 5xx)**:
  ```json
  {
    "success": false,
    "message": "Error details summary",
    "error": {
      "code": "ERROR_CODE",
      "details": { ... }
    }
  }
  ```

### 4. Categorical Logging
Logs must be output using Winston's dedicated categories to keep files separated:
```javascript
const logger = require('../common/logger/winston');

logger.info("Application event");      // Goes to application.log
logger.db.info("Query executing");      // Goes to mongodb.log
logger.api.info("Request received");    // Goes to api.log
logger.auth.info("User logged in");     // Goes to auth.log
logger.error("System failure", error);  // Goes to error.log
```

---

## 🎨 Frontend Standards

### 1. Styling Constraints
- Use **Tailwind CSS** classes. Do not write inline styles.
- Theme constants like `primary`, `accent`, `bg-page`, `text-primary` are configured in `tailwind.config.js` and must be used for consistency.

### 2. Reusable UI Elements
Never recreate buttons, inputs, tables, or modals from scratch. Always import from `components/common/...` to ensure accessibility and consistent design.

### 3. State Decoupling
- Cache backend API data via **React Query**.
- Use **Redux Toolkit** only for sync UI states (sidebar toggles, themes, notifications, global loading bars).
