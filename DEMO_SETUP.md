# GrantTracker2.0 Demo Setup Guide

## 🎯 Demo Overview

This is a **portfolio/demo project** showcasing a multi-year federal grant management platform. The authentication is **simulated** for demo purposes - no real authentication service is used.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Clone and Install

```bash
git clone https://github.com/garthpuckerin/GrantTracker2.0.git
cd GrantTracker2.0
npm install
```

### 2. Database Setup

Create a PostgreSQL database and update your `.env` file:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/grant_tracker_demo"
```

### 3. Run Demo Setup

```bash
# This will set up the database and seed demo data
npm run demo:setup
```

### 4. Start the Application

```bash
npm run dev
```

### 5. Access the Demo

- **URL**: http://localhost:3000
- **Demo Login**: demo@university.edu / demo123
- **Click "Sign In"** to access the dashboard

## 🎨 Theme System

The application includes a **comprehensive theme system** with three beautiful themes:

### Available Themes

- **☀️ Light** - Clean white background with dark text
- **☕ Warm Beige** - Cozy cream tones for comfortable reading
- **🌙 Dark Grey** - Professional dark theme for modern aesthetics

### How to Use Themes

1. **Theme Picker Location**: Available in the header on both sign-in page and dashboard
2. **Instant Switching**: Click the theme button to open the dropdown menu
3. **Persistent Storage**: Your theme choice is automatically saved
4. **Responsive Design**: Works perfectly on mobile and desktop

### Theme Features

- ✅ **CSS Custom Properties** for consistent theming
- ✅ **Proper contrast ratios** for accessibility
- ✅ **Smooth transitions** between themes
- ✅ **Hydration-safe** implementation
- ✅ **Local storage** for theme persistence

## 🔐 Demo Authentication

This project uses **simulated authentication** for demo purposes:

- ✅ **No real auth service required**
- ✅ **Pre-configured demo users**
- ✅ **Role-based access control**
- ✅ **Realistic user experience**

### Demo Users

- **Admin**: demo@university.edu (Full access)
- **PI**: pi@university.edu (Principal Investigator)
- **Finance**: finance@university.edu (Budget management)

## 📊 Demo Data

The setup script creates realistic demo data:

### Sample Grant

- **Title**: Advanced Research in Computer Science
- **Agency**: National Science Foundation
- **Duration**: 3 years (2024-2026)
- **Total Award**: $1.4M

### Sample Data Includes

- ✅ Multi-year grant structure
- ✅ Budget line items with spending tracking
- ✅ Tasks with different priorities and statuses
- ✅ Document management (simulated)
- ✅ User roles and permissions

## 🔄 Demo Reset

The database can be reset to initial state:

```bash
# Reset demo data to initial state
npm run demo:reset
```

**Auto-reset**: The demo is designed to reset every 24 hours to prevent data accumulation.

## 🛠️ Development Commands

```bash
# Start with demo setup
npm run demo:start

# Reset demo data
npm run demo:reset

# Run tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📁 Project Structure

```
GrantTracker2.0/
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   │   ├── ui/             # UI components (buttons, cards, etc.)
│   │   ├── providers/      # Context providers (theme, tRPC)
│   │   └── auth/           # Authentication components
│   ├── lib/                # Utilities and config
│   └── server/             # tRPC API routes
├── prisma/                 # Database schema
├── scripts/                # Demo setup scripts
└── tests/                  # Test files
```

## 🎨 Features Demonstrated

- ✅ **Modern React/Next.js 14** with App Router
- ✅ **TypeScript** throughout
- ✅ **Prisma ORM** with PostgreSQL
- ✅ **tRPC** for type-safe APIs
- ✅ **Tailwind CSS** for styling
- ✅ **Theme System** with multiple color schemes
- ✅ **Form validation** with React Hook Form
- ✅ **Testing** with Jest and Playwright
- ✅ **Accessibility** testing
- ✅ **Docker** configuration
- ✅ **CI/CD** ready

## 🔧 Customization

### Adding Real Authentication

To use real authentication (Clerk, Auth0, etc.):

1. Update `src/lib/auth.ts`
2. Replace demo login in `src/app/sign-in/`
3. Update environment variables

### Database Changes

```bash
# After schema changes
npm run db:generate
npm run db:push
npm run demo:reset
```

### Adding New Themes

1. Add theme colors to `src/lib/themes.ts`
2. Update theme icons in `src/components/ui/theme-picker.tsx`
3. Test contrast ratios for accessibility

## 📝 Portfolio Notes

This demo showcases:

- **Full-stack development** skills
- **Database design** and ORM usage
- **Type safety** with TypeScript
- **Modern React** patterns
- **Theme system** implementation
- **Testing** practices
- **Deployment** readiness

## 🐛 Troubleshooting

### Theme System Issues

```bash
# Clear browser cache and localStorage
# Or restart the development server
npm run dev
```

### Database Connection Issues

```bash
# Check database connection
npx prisma db push

# Reset if needed
npm run demo:reset
```

### TypeScript Errors

```bash
# Install missing types
npm install --save-dev @types/jest-axe

# Check types
npm run type-check
```

### Port Already in Use

```bash
# Use different port
npm run dev -- -p 3001
```

### Next.js Configuration Warnings

The project uses Next.js 14 with some experimental features. Warnings about deprecated options are normal and don't affect functionality.

## 📞 Support

This is a demo project. For questions about the implementation, check the code comments or create an issue on GitHub.

---

**Note**: This is a portfolio project demonstrating modern web development practices. The authentication is simulated for demo purposes, and the theme system showcases advanced UI/UX skills.
