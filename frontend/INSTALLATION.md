# SprintFlow Frontend - Local Installation Guide

This guide will help you set up SprintFlow frontend on your local development environment.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** (version 18.0.0 or higher)
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm** (version 8.0.0 or higher) or **pnpm** (recommended)
  - npm comes with Node.js
  - For pnpm: `npm install -g pnpm`
  - Verify: `npm --version` or `pnpm --version`
- **Git** (for cloning the repository)
  - Download from [git-scm.com](https://git-scm.com/)
  - Verify: `git --version`

### Optional (for full functionality)

- **Backend API** running on port 8000
- **PostgreSQL** database (if using local database)
- **Redis** server (for caching)

## 🚀 Quick Start Installation

### Step 1: Clone the Repository

\`\`\`bash

# Using HTTPS

git clone https://github.com/your-username/sprintflow-frontend.git

# Or using SSH

git clone git@github.com:your-username/sprintflow-frontend.git

# Navigate to the project directory

cd sprintflow-frontend
\`\`\`

### Step 2: Install Dependencies

Choose your preferred package manager:

\`\`\`bash

# Using pnpm (recommended - faster and more efficient)

pnpm install

# Or using npm

npm install

# Or using yarn

yarn install
\`\`\`

### Step 3: Environment Configuration

\`\`\`bash

# Copy the example environment file

cp .env.example .env.local

# Edit the environment file with your settings

# Use your preferred text editor (nano, vim, code, etc.)

nano .env.local
\`\`\`

**Minimum required environment variables:**

\`\`\`env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
\`\`\`

### Step 4: Start the Development Server

\`\`\`bash

# Using pnpm

pnpm dev

# Or using npm

npm run dev

# Or using yarn

yarn dev
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔧 Detailed Configuration

### Environment Variables Setup

Create a `.env.local` file in the root directory with the following configuration:

\`\`\`env

# =============================================================================

# REQUIRED CONFIGURATION

# =============================================================================

# Application URLs

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# =============================================================================

# OPTIONAL CONFIGURATION

# =============================================================================

# Google Calendar Integration (optional)

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft Outlook Integration (optional)

OUTLOOK_CLIENT_ID=your_outlook_client_id
OUTLOOK_CLIENT_SECRET=your_outlook_client_secret

# Analytics (optional)

NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Development settings

NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
\`\`\`

### Google Calendar Integration Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/google/callback` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env.local`

### Microsoft Outlook Integration Setup (Optional)

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure AD
3. Add Microsoft Graph permissions for Calendar
4. Add `http://localhost:3000/api/auth/outlook/callback` to redirect URIs
5. Copy the Application ID and Client Secret to your `.env.local`

## 📁 Project Structure Overview

\`\`\`
sprintflow-frontend/
├── app/ # Next.js 15 App Router
│ ├── (auth)/ # Authentication pages
│ ├── dashboard/ # Dashboard pages
│ ├── projects/ # Project management
│ ├── kanban/ # Kanban board
│ ├── my-work/ # Personal tasks
│ ├── chat/ # Team chat
│ ├── calendar/ # Calendar view
│ ├── templates/ # Template management
│ ├── tags/ # Tag management
│ ├── activity/ # Activity tracking
│ ├── layout.tsx # Root layout
│ ├── page.tsx # Home page
│ └── globals.css # Global styles
├── components/ # Reusable React components
│ ├── ui/ # Shadcn UI components
│ ├── layout/ # Layout components
│ ├── dashboard/ # Dashboard-specific
│ ├── projects/ # Project-specific
│ ├── tasks/ # Task-specific
│ ├── chat/ # Chat components
│ ├── calendar/ # Calendar components
│ ├── templates/ # Template components
│ ├── tags/ # Tag components
│ ├── activity/ # Activity components
│ └── i18n/ # Internationalization
├── lib/ # Utility libraries
│ ├── stores/ # Zustand state stores
│ ├── api/ # API client functions
│ ├── types/ # TypeScript type definitions
│ ├── dummy/ # Mock data for development
│ └── utils.ts # Utility functions
├── public/ # Static assets
│ ├── icons/ # PWA icons
│ ├── screenshots/ # PWA screenshots
│ └── manifest.json # PWA manifest
├── .env.example # Environment variables template
├── .env.local # Your local environment (create this)
├── package.json # Dependencies and scripts
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
└── next.config.mjs # Next.js configuration
\`\`\`

## 🛠️ Available Scripts

\`\`\`bash

# Development

pnpm dev # Start development server
pnpm build # Build for production
pnpm start # Start production server
pnpm lint # Run ESLint
pnpm type-check # Run TypeScript type checking

# Utilities

pnpm format # Format code with Prettier
pnpm format:check # Check code formatting
pnpm clean # Clean build artifacts
pnpm analyze # Analyze bundle size
\`\`\`

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Port Already in Use

\`\`\`bash

# Error: Port 3000 is already in use

# Solution: Use a different port

pnpm dev -- -p 3001
\`\`\`

#### 2. Node Version Issues

\`\`\`bash

# Check your Node.js version

node --version

# If version is below 18.0.0, update Node.js

# Use nvm (Node Version Manager) for easy switching

nvm install 18
nvm use 18
\`\`\`

#### 3. Package Installation Errors

\`\`\`bash

# Clear npm/pnpm cache

npm cache clean --force

# or

pnpm store prune

# Delete node_modules and reinstall

rm -rf node_modules
rm package-lock.json # or pnpm-lock.yaml
pnpm install
\`\`\`

#### 4. Environment Variables Not Loading

- Ensure `.env.local` is in the root directory
- Restart the development server after changing environment variables
- Check that variable names start with `NEXT_PUBLIC_` for client-side access

#### 5. API Connection Issues

\`\`\`bash

# Check if backend API is running

curl http://localhost:8000/api/health

# Update API URL in .env.local if backend runs on different port

NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### Development Tips

1. **Hot Reload**: The development server supports hot reload. Changes to files will automatically refresh the browser.

2. **TypeScript**: The project uses strict TypeScript. Fix any type errors before building.

3. **Linting**: Run `pnpm lint` regularly to catch potential issues.

4. **Mobile Testing**: Use browser dev tools to test responsive design.

5. **PWA Testing**: Use Chrome DevTools > Application > Manifest to test PWA features.

## 🌐 Accessing the Application

Once the development server is running:

- **Main Application**: [http://localhost:3000](http://localhost:3000)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **Login**: [http://localhost:3000/login](http://localhost:3000/login)
- **Kanban Board**: [http://localhost:3000/kanban](http://localhost:3000/kanban)

## 📱 PWA Installation

To test PWA features:

1. Open the app in Chrome/Edge
2. Look for the "Install" button in the address bar
3. Click to install as a desktop/mobile app
4. The app will work offline with cached content

## 🔄 Backend Integration

For full functionality, you'll need the SprintFlow backend API running. The frontend expects:

- **API Base URL**: `http://localhost:8000/api`
- **Authentication**: JWT-based authentication
- **WebSocket**: Real-time features (chat, notifications)

Refer to the backend repository for setup instructions.

## 📞 Support

If you encounter issues:

1. Check this troubleshooting guide
2. Review the [GitHub Issues](https://github.com/your-username/sprintflow-frontend/issues)
3. Create a new issue with:
   - Your operating system
   - Node.js version
   - Error messages
   - Steps to reproduce

## 🎉 Next Steps

After successful installation:

1. Explore the dashboard and features
2. Set up the backend API for full functionality
3. Configure external integrations (Google Calendar, etc.)
4. Customize the theme and branding
5. Deploy to production when ready

Happy coding! 🚀
