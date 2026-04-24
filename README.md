# Spring Flash

A Quizlet-style flashcard study application. Spring Boot REST API backend + Next.js frontend with full CRUD, drag-to-reorder, study mode, skill tracking, and markdown/LaTeX support.

---

## Tech Stack

| Layer    | Technology                                             |
| -------- | ------------------------------------------------------ |
| Backend  | Java 25 · Spring Boot 4 · Spring Data JPA · PostgreSQL |
| Frontend | Next.js 16 · TypeScript · Tailwind CSS 4 · shadcn/ui   |
| Build    | Maven (mvnw wrapper) · npm                             |

---

## Prerequisites

- **Java 25** — [download](https://adoptium.net)
- **Node.js 20+** — [download](https://nodejs.org)
- **PostgreSQL 15+** — running locally on port 5432
- **Maven** is bundled via `mvnw` — no separate install needed

---

## 1 — Database Setup

```sql
-- Connect to PostgreSQL and create the database
CREATE DATABASE flashcards;
```

The default credentials the app expects are:

| Setting  | Value            |
| -------- | ---------------- |
| Host     | `localhost:5432` |
| Database | `flashcards`     |
| Username | `amanhogan`      |
| Password | `postgres`       |

Change these in your local `application.properties` (see step 2).

---

## 2 — Backend Setup

### 2a. Create your local `application.properties`

```bash
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties
```

Open the file and fill in your database credentials.

> **`application.properties` is gitignored** — your credentials will never be committed.

### 2b. First-run vs ongoing runs

In `application.properties`, the `ddl-auto` setting controls how Hibernate manages the schema:

```properties
# Use this the FIRST time you run the app (creates tables automatically)
spring.jpa.hibernate.ddl-auto=update

# Switch to this after tables exist (safer — fails fast if schema drifts)
spring.jpa.hibernate.ddl-auto=validate
```

**Workflow:**

1. First run → leave as `update`, start the app, tables are created
2. Once running → change to `validate`, restart

### 2c. Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

The API will be available at `http://localhost:8080`.

---

## 3 — Frontend Setup

### 3a. Create your local `.env.local`

```bash
cp frontend/.env.example frontend/.env.local
```

The defaults point to `http://localhost:8080` and work out of the box if the backend is running locally.

> **`.env.local` is gitignored** — never committed.

### 3b. Install dependencies

```bash
cd frontend
npm install
```

> **Work laptop?** See the [Work Laptop section](#work-laptop-setup) below before running `npm install`.

### 3c. Start the frontend

```bash
cd frontend
npm run dev
```

App is available at `http://localhost:3000`.

---

## Running Both Together

Open two terminals:

```bash
# Terminal 1 — backend
cd backend && ./mvnw spring-boot:run

# Terminal 2 — frontend
cd frontend && npm run dev
```

---

## Work Laptop Setup

### npm Registry (`.npmrc`)

If your work network routes npm through an internal Nexus/Artifactory registry, create a local `.npmrc` before running `npm install`:

```bash
cp frontend/.npmrc.example frontend/.npmrc
```

Edit `frontend/.npmrc` with your registry URL and auth token. This file is gitignored so your token is never committed.

### Maven Repository (`pom.xml`)

If your work Maven setup requires pulling from an internal repository, you'll need to modify `backend/pom.xml` to add a `<repositories>` block pointing at your company's Nexus/Artifactory.

Since `pom.xml` is tracked by git, use **skip-worktree** so your local changes are never staged or overwritten when you pull:

```bash
# Run once on your work laptop after making your pom.xml changes:
git update-index --skip-worktree backend/pom.xml

# To undo skip-worktree (e.g. to pull a real pom.xml update):
git update-index --no-skip-worktree backend/pom.xml
```

The typical `pom.xml` addition for an internal registry looks like:

```xml
<repositories>
  <repository>
    <id>company-nexus</id>
    <url>https://nexus.your-company.com/repository/maven-public/</url>
  </repository>
</repositories>
```

Auth for Maven goes in `~/.m2/settings.xml` (never in `pom.xml`):

```xml
<settings>
  <servers>
    <server>
      <id>company-nexus</id>
      <username>YOUR_USERNAME</username>
      <password>YOUR_TOKEN</password>
    </server>
  </servers>
</settings>
```

### `application.properties` on Work Laptop

Your work DB likely has a different name, username, or password. Just edit your local `application.properties` — it's already gitignored, so changes will never show up in `git status` or get overwritten on `git pull`.

---

## Files That Are Local-Only (Never Committed)

| File                                                | Why                  |
| --------------------------------------------------- | -------------------- |
| `backend/src/main/resources/application.properties` | DB credentials       |
| `frontend/.env.local`                               | API URLs             |
| `frontend/.npmrc`                                   | Registry auth tokens |

Each has a `.example` counterpart in the repo you can copy as a starting point.

---

## Project Structure

```
flashcards/
├── backend/                        # Spring Boot API
│   ├── src/main/java/com/amanhogan/spring_flash/
│   │   ├── controller/             # REST endpoints
│   │   ├── service/                # Business logic
│   │   ├── repository/             # JPA repositories
│   │   ├── model/                  # JPA entities
│   │   ├── dto/                    # Data transfer objects
│   │   ├── exception/              # Error handling
│   │   └── config/                 # CORS config
│   └── src/main/resources/
│       ├── application.properties.example   # ← copy → application.properties
│       └── application.properties          # gitignored
│
└── frontend/                       # Next.js app
    ├── app/dashboard/              # Pages (sets, study, skills, starred)
    ├── components/                 # UI components
    ├── lib/                        # API client, utilities
    ├── types/                      # TypeScript types
    ├── .env.example                # ← copy → .env.local
    ├── .env.local                  # gitignored
    ├── .npmrc.example              # ← copy → .npmrc (work laptop only)
    └── .npmrc                      # gitignored
```

---

## API Overview

| Resource        | Base Path                                    |
| --------------- | -------------------------------------------- |
| Flashcard Sets  | `GET/POST /api/sets`                         |
| Flashcard Set   | `GET/PUT/DELETE /api/sets/:id`               |
| Cards in a Set  | `GET/POST /api/sets/:id/cards`               |
| Individual Card | `GET/PUT/DELETE /api/sets/:id/cards/:cardId` |
| Star a Card     | `PATCH /api/sets/:id/cards/:cardId/star`     |
| Study Session   | `POST /api/sets/:id/study`                   |
| Skills          | `GET/POST/PUT/DELETE /api/skills`            |
| Skills by Set   | `GET /api/skills/set/:setId`                 |
