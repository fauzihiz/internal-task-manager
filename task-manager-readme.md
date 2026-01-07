# Internal Task Manager

## 1. Problem Statement

**What problem does this solve?**  
> Managers lack visibility into team workload and task progress. Existing tools are either too complex or require app installations. This internal task manager provides a simple, mobile-responsive web interface where managers can see who's working on what, track progress, and ensure balanced workload distribution—accessible anywhere without installation.

---

## 2. Target Users & Roles

**Who uses this app?**

- **Manager Role:** Create tasks, assign to team members, monitor team workload and progress, view all team tasks
- **Member Role:** View their own assigned tasks only, update status and progress, add comments/notes

**Team size:** Small teams (5-10 people initially)

---

## 3. Core Features

**What can users do?**

### Manager Features:
- Create task (title, description, assignee, due date [optional], priority)
- View all team tasks (list/card view)
- **Dashboard:** Team workload overview showing per person:
  - Total tasks
  - Active tasks (In Progress)
  - Overdue tasks
- Edit/delete tasks
- Filter by status, assignee, priority
- View all comments/notes on any task

### Member Features:
- View my assigned tasks only
- Update task status (To Do → In Progress → Done)
- Add progress notes/comments to tasks
- Mark tasks complete

**Task Statuses:** To Do → In Progress → Done

---

## 4. Data Model (Conceptual)

**Main entities and relationships**

### Entity: Users
- id: unique identifier
- name: full name
- email: login credential
- password: hashed password
- role: "manager" or "member"

### Entity: Tasks
- id: unique identifier
- title: task name
- description: detailed explanation
- priority: high/medium/low
- status: "To Do" / "In Progress" / "Done"
- dueDate: optional deadline
- assignedTo: user id (one member)
- createdBy: user id (which manager created it)
- createdAt: timestamp
- updatedAt: timestamp

### Entity: Comments
- id: unique identifier
- taskId: which task this belongs to
- userId: who wrote it
- text: comment content
- createdAt: timestamp

**Relationships:**
- One task → one assignee (member)
- One task → many comments
- Managers can see all tasks and comments; members see only their own

---

## 5. Key Actions (User Flows)

**Actions that change data**

### Manager Flow: Create & Assign Task
1. Manager logs in → sees dashboard + all tasks
2. Clicks "Create Task"
3. Fills in: title, description, assignee, priority, due date (optional)
4. Saves → task appears in assigned member's task list
5. Member sees it on next login (no notifications in v1)

### Member Flow: Update Task
1. Member logs in → sees their assigned tasks only
2. Clicks a task → sees details
3. Updates status (To Do → In Progress → Done)
4. Optionally adds a comment ("Completed API integration, testing now")
5. Saves → changes visible to managers immediately

### Manager Flow: Monitor Workload
1. Manager logs in → sees dashboard with team overview (total/active/overdue per person)
2. Notices imbalanced workload (e.g., "Alice: 8 tasks, 5 active, 2 overdue")
3. Clicks on a person → sees their full task list
4. Can edit/reassign/delete tasks as needed

---

## 6. Architecture Decisions

**Where does logic live, and why?**

### Tech Stack: Next.js Full-Stack Application

**Server-side (Next.js API Routes):**
- Authentication & session management (NextAuth.js)
- Task CRUD operations with role-based access control
- Database queries filtered by user role (security: members only see their tasks)
- All business logic and data validation

**Client-side (React Components):**
- Mobile-responsive UI with Tailwind CSS
- Form interactions and status updates
- Auto-refresh polling (fetch new tasks every 60 seconds)
- Display logic only (no security decisions)

**Database:**
- PostgreSQL (production) or SQLite (development)
- Prisma ORM for type-safe database queries

**Deployment:**
- Vercel (free tier, optimized for Next.js)

### Notes:
- **Why Next.js?** All-in-one solution (frontend + backend), mobile-responsive by default, modern tech stack for job portfolio
- **Why server-side security?** Members can't bypass client code to see others' tasks—database queries enforce role restrictions
- **Why auto-refresh polling?** Tasks change infrequently (not real-time chat), 60-second polling is simple and "good enough" for v1
- **No real-time WebSockets:** Adds complexity, not needed for task updates that happen a few times per day

---

## 7. Roadmap

Each step introduces **one new concept**.

- [ ] **Step 1:** Initialize Next.js Project & Understand Project Structure  
  _Concept learned: Next.js folder structure, file-based routing, App Router vs Pages Router_

- [ ] **Step 2:** Set Up Database with Prisma  
  _Concept learned: ORM basics, schema definition, migrations_

- [ ] **Step 3:** Implement Authentication with NextAuth  
  _Concept learned: Session-based auth, protected routes, role-based access_

- [ ] **Step 4:** Build User Registration/Login Pages  
  _Concept learned: Form handling in Next.js, server actions, client vs server components_

- [ ] **Step 5:** Create Database Schema & Seed Initial Data  
  _Concept learned: Relational data modeling, seeding test users_

- [ ] **Step 6:** Build Manager Dashboard (Read-Only View)  
  _Concept learned: Server-side data fetching, displaying database data in React_

- [ ] **Step 7:** Build Task Creation Form (Manager Only)  
  _Concept learned: Form submission, API route creation, POST requests_

- [ ] **Step 8:** Build Member Task List (Filtered by User)  
  _Concept learned: Role-based queries, filtering data server-side_

- [ ] **Step 9:** Implement Task Status Update  
  _Concept learned: PATCH requests, optimistic UI updates_

- [ ] **Step 10:** Add Comments/Notes to Tasks  
  _Concept learned: Nested data relationships, timestamps_

- [ ] **Step 11:** Build Team Workload Overview Dashboard  
  _Concept learned: Aggregating data (counts, filtering by status)_

- [ ] **Step 12:** Add Auto-Refresh Polling  
  _Concept learned: useEffect, setInterval, cleanup functions_

- [ ] **Step 13:** Style with Tailwind (Mobile-Responsive)  
  _Concept learned: Mobile-first design, responsive utilities_

- [ ] **Step 14:** Deploy to Vercel  
  _Concept learned: Production deployment, environment variables, database hosting_

---

## 8. Learning Notes (Important)

**Things I learned**
- 

**Things that confused me**
- 

**Decisions I made & why**
- 

---

## 9. Known Issues / TODO

- No email notifications (v1 decision—users must log in to see updates)
- No task subtasks (keeping it simple for v1)
- No task reassignment history/audit log
- No file attachments on tasks
- Auto-refresh polling (not real-time WebSockets)

---

## 10. Rebuild Confidence Check

Can I rebuild this without tutorials?

- [ ] Yes
- [ ] Not yet (what's missing?)

**Key concepts to master:**
- [ ] Next.js App Router & file-based routing
- [ ] Prisma schema & database queries
- [ ] NextAuth session management
- [ ] Server vs Client Components
- [ ] API route creation & protection
- [ ] Role-based access control
- [ ] React hooks (useState, useEffect)
- [ ] Tailwind responsive design
