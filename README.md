# PlaceLog - Campus Interview Experience Platform

A platform for students to share and discover interview experiences from campus placements. Learn from real experiences shared by peers to prepare better for your interviews.

## Features

- 🔐 **Authentication** - Sign up, login, logout, password reset with Firebase Auth
- 📝 **Share Experiences** - Post detailed interview experiences with questions and tips
- 🔍 **Search & Filter** - Find experiences by company, role, year, and outcome
- 👤 **User Profiles** - Track your contributions and see your shared experiences
- 📱 **Responsive Design** - Works beautifully on desktop, tablet, and mobile
- ⚡ **Fast & Modern** - Built with React, Vite, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Firebase (Firestore + Authentication)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Firebase project

### 1. Clone the repository

```bash
git clone https://github.com/ishreyasrivastava/PlaceLog.git
cd PlaceLog
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Name it "PlaceLog" or similar
4. Disable Google Analytics (optional, not needed)
5. Click "Create project"

#### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider

#### Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose a location closest to your users (e.g., asia-south1 for India)
4. Click **Enable**

#### Set up Firestore Rules
Go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Experiences collection
    match /experiences/{experienceId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

Click **Publish**.

#### Create Firestore Index
Go to **Firestore Database** → **Indexes** → **Add Index**:
- Collection: `experiences`
- Fields: `userId` (Ascending), `createdAt` (Descending)
- Query scope: Collection

#### Get Firebase Config
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll to "Your apps" → Click "Web" icon (</>)
3. Register app name (e.g., "placelog-web")
4. Copy the Firebase config object

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production

```bash
npm run build
```

## Deployment on Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" → Import your GitHub repo
4. Add environment variables (same as `.env` file)
5. Deploy!

## Project Structure

```
src/
├── components/      # Reusable UI components
├── contexts/        # React context providers (Auth)
├── hooks/           # Custom React hooks
├── pages/           # Page components
├── services/        # Firebase services (auth, firestore)
├── utils/           # Utility functions
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own campus!

---

Built with ❤️ for campus placements
