# 📋 PlaceLog — Campus Interview Experience Platform

A modern platform for students to share and discover real interview experiences from campus placements. Built with **React + Supabase + Tailwind CSS** with dark/light mode and glassmorphism UI.

## ✨ Features

- 🔐 **Authentication** — Sign up, login, password reset via Supabase Auth
- 📝 **Share Experiences** — Post detailed interview experiences with questions & tips
- 🔍 **Search & Filter** — Find by company, role, year, outcome, and interview type
- 👤 **User Profiles** — Track contributions and manage shared experiences
- 🌙 **Dark + Light Mode** — Toggle with system preference detection
- 🪟 **Glassmorphism UI** — Modern frosted-glass design with smooth animations
- 📱 **Fully Responsive** — Desktop, tablet, and mobile
- ⚡ **Fast** — Lazy-loaded pages, optimized queries

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Auth + RLS) |
| **UI** | Framer Motion, Lucide Icons |
| **Deployment** | Vercel |

## 📁 Project Structure

```
PlaceLog/
├── database/
│   └── schema.sql          # PostgreSQL schema with RLS policies
├── src/
│   ├── components/         # Navbar, ExperienceCard, EmptyState, etc.
│   ├── contexts/           # AuthContext, ThemeContext
│   ├── lib/                # Supabase client
│   ├── pages/              # Home, Explore, Login, Signup, Profile, etc.
│   └── services/           # Experience CRUD operations
└── package.json
```

## 🚀 Getting Started

### 1. Supabase Setup
- Create a project at [supabase.com](https://supabase.com) (free tier)
- Go to SQL Editor → New Query → Paste `database/schema.sql` → Run

### 2. Environment Variables
```bash
cp .env.example .env
```
Add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Deploy on Vercel
- Push to GitHub
- Import on Vercel
- Add environment variables
- Deploy!

## 👩‍💻 Author

**Shreya Srivastava** — [GitHub](https://github.com/ishreyasrivastava)

---

*Built with ❤️ for campus placements*
