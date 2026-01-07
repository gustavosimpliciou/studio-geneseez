# Geneseez Studio

## Overview
Geneseez Studio is an AI-powered Minecraft video creator application that helps users turn ideas into animated Minecraft stories. Users can generate characters, create storyboards, and let AI animate the content.

## Project Architecture

### Tech Stack
- **Frontend**: React with TypeScript, Vite, TailwindCSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI primitives with shadcn/ui styling

### Directory Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # React hooks
│   │   ├── lib/         # Utilities
│   │   └── pages/       # Page components
├── server/           # Express backend
│   ├── index.ts      # Entry point
│   ├── routes.ts     # API routes
│   ├── db.ts         # Database connection
│   ├── storage.ts    # Data storage layer
│   └── vite.ts       # Vite dev middleware
├── shared/           # Shared types and schemas
│   └── schema.ts     # Drizzle schema definitions
└── attached_assets/  # Asset files
```

### Development
- Run `npm run dev` to start the development server
- Server runs on port 5000 with Vite HMR middleware
- Express serves both the API and the frontend

### Database
- PostgreSQL database with Drizzle ORM
- Schema defined in `shared/schema.ts`
- Push schema changes with `npm run db:push`

### Building
- `npm run build` creates production bundle
- `npm run start` runs production server

## Key Features
- Wizard-based project creation flow
- Character generation with AI
- Storyboard creation
- Animation generation
- Video export

## Recent Changes
- Initial import from GitHub (January 2026)
- Set up Replit environment with PostgreSQL database
- Configured workflow and deployment
