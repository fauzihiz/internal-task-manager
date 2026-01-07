# Internal Task Manager

**A simple fullstack internal dashboard built with Next.js to manage tasks inside a small team or organization.**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 About The Project

**Internal Task Manager** is a simple internal dashboard application for managing tasks (create, update, track, delete). This project was built as a **fullstack portfolio project** to demonstrate end-to-end application flow using **Next.js App Router**.

The app simulates a common internal system used by:
- Small teams
- Startups
- SMEs
- Internal admin dashboards

### Why This Project?

**Problem**  
Many small teams need a simple task management system without the complexity of large tools.

**Solution**  
A lightweight internal dashboard with clear and structured task CRUD features.

**Benefits**  
- Simple and easy to maintain  
- Fullstack in a single codebase  
- Easy to extend with authentication, roles, and reporting

---

## ✨ Key Features

- 📝 **CRUD Operations** – Create, Read, Update, Delete tasks
- 📌 **Status Management** – Track tasks (Todo / In Progress / Done)
- 📅 **Due Date Support** – Assign deadlines to tasks
- 🔄 **Server Actions** – Modern form handling with Next.js
- 🧠 **Component Architecture** – Clear separation of Client and Server Components
- 📱 **Responsive Design** – Works seamlessly on desktop and mobile

---

## 🛠️ Built With

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js (App Router)** | Fullstack React framework |
| **React** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first CSS |
| **Prisma ORM** | Database toolkit |
| **SQLite** | Lightweight local database |

> This project intentionally avoids unnecessary complexity to focus on core fullstack fundamentals.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/fauzihiz/internal-task-manager.git
   cd internal-task-manager
```

2. **Install dependencies**
```bash
   npm install
```

3. **Setup environment variables**
```bash
   cp .env.example .env
```
   
   Example `.env` file:
```env
   DATABASE_URL="file:./dev.db"
```

4. **Run database migration**
```bash
   npx prisma migrate dev
```

5. **Start development server**
```bash
   npm run dev
```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 💻 Usage

### Task Flow

1. Access the dashboard
2. Create a new task via the form
3. Task is submitted using Server Actions
4. Data is stored in the database via Prisma
5. Task list updates automatically

### What This Project Demonstrates

- Server Actions for data mutation
- Form handling and validation
- Client-side rendering for interactive UI
- Prisma ORM integration
- TypeScript type safety

---

## 🗂️ Project Structure
```
app/
├─ login/
├─ dashboard/
│  ├─ page.tsx
│  ├─ TaskForm.tsx
│  └─ TaskList.tsx
├─ actions.ts
└─ layout.tsx

prisma/
└─ schema.prisma
```

---

## 🗺️ Roadmap

- [ ] Basic task CRUD
- [ ] Server Actions integration
- [ ] Prisma + SQLite setup
- [ ] Authentication (NextAuth)
- [ ] User roles (Admin / Member)
- [ ] Task filtering and search

---

## 👤 Author

**Fauzi Hiz**  
Aspiring Fullstack Web Developer  
Focused on building practical, real-world web applications.

[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?logo=github)](https://github.com/username)

---

## 📄 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgments

This project is built as a learning-focused portfolio, emphasizing clarity, maintainability, and real-world internal dashboard use cases.

---

<div align="center">

**Made with ❤️ by Fauzi Hiz**

</div>