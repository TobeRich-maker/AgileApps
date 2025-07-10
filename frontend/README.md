# SprintFlow Frontend

A complete, production-ready Agile project management frontend built with Next.js 15, TypeScript, Tailwind CSS, and Shadcn UI.

## 🚀 Features

### Core Functionality
- **Dashboard**: Comprehensive project overview with stats and charts
- **My Work**: Personal task management with pinning and filtering
- **Projects**: Project creation and management with difficulty levels
- **Kanban Board**: Drag-and-drop task management
- **Sprints**: Sprint planning and tracking
- **Calendar**: Event scheduling with external calendar sync
- **Reports**: Analytics and productivity insights

### Advanced Features
- **💬 In-App Chat**: Real-time team communication with message threads
- **📆 Calendar Sync**: Google/Outlook calendar integration
- **🌍 Multi-Language**: i18n support (English, Indonesian, Spanish, etc.)
- **🏷️ Tag Management**: Custom tags with color coding
- **📦 Template System**: Reusable project/sprint/task templates
- **📱 PWA Support**: Installable web app with offline capabilities
- **🔥 Activity Heatmap**: GitHub-style productivity tracking
- **🎨 Dark Mode**: System-aware theme switching
- **📊 Custom Fields**: Dynamic task fields
- **🔄 Recurring Tasks**: Automated task creation
- **🌐 Public Projects**: Token-based project sharing

### Technical Highlights
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with professional color scheme
- **Shadcn UI** components
- **Zustand** for state management
- **Responsive Design** (mobile-first)
- **Accessibility** compliant
- **Performance** optimized

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Quick Start

\`\`\`bash
# 1. Clone the repository
git clone https://github.com/your-username/sprintflow-frontend.git
cd sprintflow-frontend

# 2. Install dependencies
pnpm install  # or npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your settings:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_APP_URL=http://localhost:3000

# 5. Run the development server
pnpm dev  # or npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: External Integrations
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
\`\`\`

## 📁 Project Structure

\`\`\`
sprintflow-frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── projects/          # Project management
│   ├── kanban/           # Kanban board
│   ├── calendar/         # Calendar view
│   ├── chat/             # Team chat
│   ├── templates/        # Template management
│   ├── tags/             # Tag management
│   ├── activity/         # Activity heatmap
│   └── my-work/          # Personal task view
├── components/            # Reusable components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   ├── dashboard/        # Dashboard components
│   ├── projects/         # Project components
│   ├── tasks/            # Task components
│   ├── chat/             # Chat components
│   ├── templates/        # Template components
│   ├── tags/             # Tag components
│   ├── activity/         # Activity components
│   ├── calendar/         # Calendar components
│   └── i18n/             # Internationalization
├── lib/                  # Utilities and configurations
│   ├── stores/           # Zustand stores
│   ├── api/              # API functions
│   ├── types/            # TypeScript types
│   ├── dummy/            # Mock data
│   └── utils.ts          # Utility functions
├── public/               # Static assets
│   ├── icons/            # PWA icons
│   ├── screenshots/      # PWA screenshots
│   └── manifest.json     # PWA manifest
└── styles/               # Global styles
\`\`\`

## 🎨 Design System

### Color Palette
- **Primary**: Navy (#486581) - Professional and trustworthy
- **Secondary**: Slate - Clean and modern
- **Accent**: Amber - Warm highlights
- **Status Colors**: Green (success), Red (danger), Yellow (warning)

### Typography
- **Font**: Inter (system fallback)
- **Headings**: Bold, navy color
- **Body**: Regular, slate color
- **Code**: JetBrains Mono

### Components
- **Cards**: Soft shadows with hover effects
- **Buttons**: Consistent sizing and states
- **Forms**: Clear labels and validation
- **Navigation**: Intuitive and accessible

## 🌐 Internationalization

The app supports multiple languages:

- **English** (default)
- **Bahasa Indonesia**
- **Español**
- **Français**
- **Deutsch**
- **日本語**
- **한국어**
- **中文**

Language preference is stored in localStorage and persists across sessions.

## 📱 PWA Features

SprintFlow is a Progressive Web App with:

- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**:
