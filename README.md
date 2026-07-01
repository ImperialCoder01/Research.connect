# Research Connect

An enterprise-grade, production-ready **AI-Powered Research Discovery & Collaboration Platform** built using the MERN Stack (React, Node.js, Express, MongoDB). Designed with a clean **Feature-First Architecture**, strict design systems, and modern SaaS aesthetics.

This documentation describes the foundation structure, system architecture, database models, and setup procedures established in **Phase 0**.

---

## 🎨 Design System & Color Palette

Research Connect utilizes a premium light-theme design system. All interface elements, components, and layouts strictly adhere to the following color tokens:

### Color Tokens

| UI Element             | Color Code | Purpose / Usage                               |
| :--------------------- | :--------- | :-------------------------------------------- |
| 🔵 **Primary Blue**    | `#2563EB`  | Primary buttons, active sidebar, links, icons |
| 🔷 **Blue Hover**      | `#1D4ED8`  | Button hover, active states                   |
| 🟣 **Indigo**          | `#4F46E5`  | Highlights, badges, charts                    |
| 🟢 **Success Green**   | `#22C55E`  | Success status, citations, completed items    |
| 🟠 **Orange**          | `#F59E0B`  | Warnings, pending states, metrics             |
| 🔴 **Red**             | `#EF4444`  | Notifications, errors, alerts                 |
| ⚪ **Page Background** | `#F8FAFC`  | Main website background                       |
| 🤍 **Card Background** | `#FFFFFF`  | Cards, profile sections, widgets              |
| ⚫ **Primary Text**    | `#0F172A`  | Headings & important text                     |
| ⚫ **Secondary Text**  | `#475569`  | Description & body text                       |
| ⚪ **Border**          | `#E2E8F0`  | Card borders, inputs, dividers                |
| 🔹 **Light Blue**      | `#DBEAFE`  | Metric cards, tags, badges background         |
| 🟢 **Light Green**     | `#DCFCE7`  | Success metric background                     |
| 🟠 **Light Orange**    | `#FEF3C7`  | Warning metric background                     |
| 🟣 **Light Purple**    | `#EDE9FE`  | Research tags, AI sections                    |

### Gradients

- **Primary Gradient**: `#2563EB` ➔ `#4F46E5` (Primary Blue to Indigo)
- **Hero Background Gradient**: Radial-gradient (`#F8FAFC` ➔ `#FFFFFF`)

---

## 📂 Project Directory Structure

The project is structured with exactly two root folders, maintaining a strict separation between client and server, utilizing **Feature-First** localization.

### 💻 Frontend (Client-side)

```text
frontend/                 # React.js (Vite) Client
├── .vscode/
│   └── settings.json     # Custom CSS linter rules for Tailwind
├── public/
├── src/
│   ├── api/
│   │   └── axiosInstance.js # Axios instance with interceptors and toast prompts
│   ├── components/
│   │   ├── common/
│   │   │   ├── ComingSoon.jsx # Custom page redirect placeholder
│   │   │   ├── Footer.jsx     # Responsive marketing footer
│   │   │   └── Navbar.jsx     # Sticky navigation bar with mobile drawer
│   │   └── ui/
│   │       ├── Accordion.jsx  # Smooth animated toggle accordion
│   │       ├── Button.jsx     # Motion-enhanced microinteraction buttons
│   │       └── Card.jsx       # Elevation-hover cards and glassmorphic cards
│   ├── layouts/
│   │   └── MainLayout.jsx     # Layout shell wrapping header/footer
│   ├── routes/
│   │   └── AppRoutes.jsx      # Router configuration (Landing, Placeholders, 404)
│   ├── store/
│   │   ├── slices/
│   │   │   ├── appSlice.js    # Mobile menus & general loading state
│   │   │   ├── themeSlice.js  # Theme toggles and cache
│   │   │   └── notificationSlice.js # Global alerts tracking
│   │   └── index.js           # Combined Redux Toolkit store
│   ├── styles/
│   │   └── index.css          # Tailwind directives and CSS variables
│   ├── modules/               # Feature-First Modules
│   │   └── landing/           # Landing page feature folder
│   │       ├── components/
│   │       │   ├── Hero.jsx   # Header panel with search mock
│   │       │   ├── Stats.jsx  # Database metric counters
│   │       │   ├── Features.jsx # Interactive capabilities grid
│   │       │   ├── Categories.jsx # Academic disciplines counters
│   │       │   ├── FAQ.jsx
│   │       │   ├── CTA.jsx
│   │       │   └── Testimonials.jsx
│   │       ├── pages/
│   │       │   └── LandingPage.jsx # Assembled dashboard page
│   │       └── index.js       # Sibling exports wrapper
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

<br />

### ⚙️ Backend (Server-side)

```text
backend/                  # Node.js + Express.js Server
├── src/
│   ├── config/
│   │   └── database/
│   │       ├── connection.js # Pool, auto-reconnect, and health check client
│   │       ├── indexes.js    # Index audit sync engine
│   │       └── seed.js       # Local database seed generator
│   ├── common/
│   │   ├── logger/
│   │   │   └── winston.js    # JSON daily rotating logging manager
│   │   ├── errors/
│   │   │   └── AppError.js   # Centralized Operational Error hierarchy
│   │   ├── responses/
│   │   │   └── ApiResponse.js # Standardized JSON format builders
│   │   ├── repository/
│   │   │   └── base.repository.js # Generic CRUD Engine
│   │   ├── middlewares/
│   │   │   ├── requestId.middleware.js
│   │   │   ├── logger.middleware.js
│   │   │   ├── responseFormatter.middleware.js
│   │   │   ├── security.middleware.js
│   │   │   ├── validation.middleware.js
│   │   │   ├── asyncHandler.middleware.js
│   │   │   ├── notFound.middleware.js
│   │   │   └── errorHandler.middleware.js # Multi-exception parser
│   │   └── utils/
│   │       ├── dateFormatter.js
│   │       ├── hashHelper.js
│   │       ├── otpGenerator.js
│   │       ├── jwtHelper.js
│   │       ├── fileUpload.js  # Multer image/PDF configurations
│   │       └── emailHelper.js # Nodemailer dispatcher
│   ├── models/                # Schema blueprints
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Settings.js
│   │   ├── Notification.js
│   │   ├── Session.js
│   │   ├── ActivityLog.js
│   │   ├── RefreshToken.js
│   │   └── EmailOtp.js
│   ├── modules/               # Feature-First Modules
│   │   └── landing/           # Landing API endpoints
│   │       ├── controller/
│   │       ├── service/
│   │       ├── repository/
│   │       ├── routes/
│   │       ├── validator/
│   │       ├── dto/
│   │       └── index.js
│   ├── app.js
│   ├── server.js
│   └── index.js
├── .env.example
├── .env
└── package.json
```

---

## 🏛️ Permanent Coding Standards & Guidelines

Refer to [.agents/AGENTS.md](file:///c:/Users/codew/Downloads/Research.connect/.agents/AGENTS.md) for full project constraints. Key guidelines include:

1. **Strict Separation of Concerns**: Routes map directly to Controllers. Controllers sanitize parameters, call Services, and output structured DTOs. Services host all transaction logic. Repositories communicate with Mongoose.
2. **Standardized Responses**:
   - **Success (HTTP 200-299)**:
     ```json
     {
       "success": true,
       "message": "Action completed successfully",
       "data": {},
       "error": null
     }
     ```
   - **Failure (HTTP 400-599)**:
     ```json
     {
       "success": false,
       "message": "Error description",
       "error": { "code": "ERROR_CODE", "details": {} }
     }
     ```
3. **Mongoose Collections**: Must support audit logging (`createdAt`, `updatedAt`), soft-delete properties (`isDeleted`, `deletedAt`), and normalized `ObjectId` references.

---

## 🗄️ Database Schemas & Collection Blueprints

### 1. `users` (Model: `User`)
Manages authentication credentials and role flags.
- **Fields**: `_id`, `firstName`, `lastName`, `email` (unique), `password` (select: false), `phone`, `role` (enum: `['researcher', 'admin']`), `status` (enum: `['pending', 'active', 'suspended']`), `isActive`, `isVerified`, `profileImage`, `country`, `createdAt`, `updatedAt`.
- **Indexes**: `email: 1` (unique), `createdAt: 1`.

### 2. `profiles` (Model: `Profile`)
Academic portfolios and social handles mapped 1:1 to User.
- **Fields**: `userId` (ObjectId, unique, ref: `User`), `bio`, `country`, `institution`, `department`, `designation`, `organization`, `socialLinks` (`orcid`, `googleScholar`, `researchGate`, `linkedin`, `website`), `profileCompletion`.
- **Indexes**: `userId: 1` (unique), `institution: 1`.

### 3. `settings` (Model: `Settings`)
User preferences and theme details.
- **Fields**: `userId` (ObjectId, unique, ref: `User`), `theme` (enum: `['light', 'dark', 'system']`), `language`, `notifications` (`email`, `push`, `weeklyDigest`), `privacy` (`profileVisible`, `showPublications`, `showStats`), `timezone`.
- **Indexes**: `userId: 1` (unique).

### 4. `notifications` (Model: `Notification`)
Push alerts and collaboration invites.
- **Fields**: `userId` (ObjectId, ref: `User`), `title`, `message`, `type` (enum: `['info', 'success', 'warning', 'error', 'system', 'collaboration']`), `isRead`.
- **Indexes**: `userId: 1, isRead: 1`, `createdAt: -1`.

### 5. `sessions` (Model: `Session`)
Tracks device login metadata.
- **Fields**: `userId` (ObjectId, ref: `User`), `browser`, `device`, `ipAddress`, `location`, `loginTime`, `logoutTime`, `status` (enum: `['active', 'expired', 'revoked']`).
- **Indexes**: `userId: 1, status: 1`.

### 6. `activitylogs` (Model: `ActivityLog`)
System audits.
- **Fields**: `userId` (ObjectId, ref: `User`), `action`, `description`, `ipAddress`, `createdAt`.
- **Indexes**: `userId: 1, action: 1`, `createdAt: -1`.

### 7. `refreshtokens` (Model: `RefreshToken`)
OAuth token lifecycle tracking.
- **Fields**: `userId` (ObjectId, ref: `User`), `token` (unique), `expiresAt`.
- **Indexes**: `token: 1` (unique), `expiresAt: 1` (TTL auto-expiration).

### 8. `emailotps` (Model: `EmailOtp`)
Passwords resets and verification numbers.
- **Fields**: `email`, `otp`, `purpose` (enum: `['email_verification', 'password_reset']`), `expiresAt`.
- **Indexes**: `email: 1, purpose: 1`, `expiresAt: 1` (TTL auto-expiration).

---

## ⚙️ Generic CRUD Repository Engine

All future repositories inherit from `BaseRepository` ([base.repository.js](file:///c:/Users/codew/Downloads/Research.connect/backend/src/common/repository/base.repository.js)), which provides:
- `create(data)` & `bulkInsert(dataArray)`
- `findById(id, populate, select)` & `findOne(filter, populate, select)`
- `find(filter, queryOptions, populate)` (supports sort, limit, skip pagination, and case-insensitive regex search)
- `update(id, updateData, options)` & `updateMany(filter, updateData, options)`
- `delete(id)` (hard delete) & `softDelete(id, deletedBy)` (toggles `isDeleted`, sets timestamp)
- `aggregate(pipeline)` & `count(filter)`
- `bulkUpdate(operations)` (utilizes `bulkWrite` transactions)

---

## 🚀 Installation & Quickstart

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas connection string)

### 1. Configure Environment Variables
Create a `.env` file in the `backend/` directory using the configuration keys in `.env.example`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/research_connect
JWT_SECRET=supersecretjwtkeyforresearchconnect
JWT_REFRESH_SECRET=supersecretjwtrefreshkeyforresearchconnect
```

### 2. Install Packages
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 3. Seed Database
```bash
cd ../backend
npm run seed
```

### 4. Run Development Servers
```bash
# Launch backend (from backend/)
npm run dev

# Launch frontend (from frontend/)
npm run dev
```

---

## 🔬 API Endpoint Routes Summary

All system details retrieve using endpoints mounted on `/api`:
- **GET `/api`**: Welcome message, check online state.
- **GET `/api/health`**: Server health metrics and system uptime.
- **GET `/api/database`**: MongoDB connection status, client states, and active connection pool size.
- **GET `/api/stats`**: Aggregated researcher count, universities, publications, and countries.
- **GET `/api/categories`**: Lists active academic disciplines and paper distributions.
- **GET `/api/features`**: Returns platform modules list and placeholders state.
- **GET `/api/version`**: Build version, current phase number, and phase title.
