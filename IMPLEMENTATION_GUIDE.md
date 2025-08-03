# Grant Tracker 2.0 - Implementation Guide

This guide provides step-by-step instructions for implementing each component of the Grant Tracker 2.0 application.

## 📋 Phase 1: Project Foundation

### 1. Set up project foundation and development environment

**Prerequisites:**

- Node.js 18+ installed
- Docker Desktop installed
- Git configured
- VS Code with recommended extensions

**Development Tools Setup:**

```bash
# Install global dependencies
npm install -g @prisma/cli
npm install -g typescript
npm install -g eslint
```

**Environment Files:**
Create `.env.local` template:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/granttracker"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# UploadThing
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### 2. Initialize Next.js 14 project with TypeScript and Tailwind CSS

**Commands:**

```bash
# Create Next.js project
npx create-next-app@latest grant-tracker-2.0 --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd grant-tracker-2.0

# Install additional dependencies
npm install @prisma/client prisma
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query
npm install zod
npm install @clerk/nextjs
npm install uploadthing @uploadthing/react
npm install lucide-react
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select
npm install class-variance-authority clsx tailwind-merge
npm install date-fns

# Development dependencies
npm install -D @types/node
npm install -D prettier prettier-plugin-tailwindcss
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D husky lint-staged
```

**Tailwind Configuration:**

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### 3. Configure development database with Docker PostgreSQL

**Docker Compose Configuration:**

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: granttracker
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  adminer:
    image: adminer
    restart: always
    ports:
      - '8080:8080'

volumes:
  postgres_data:
```

**Database Initialization:**

```sql
-- init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

**Commands:**

```bash
# Start database
docker-compose up -d postgres

# Verify connection
docker-compose logs postgres
```

### 4. Set up Prisma ORM with database schema

**Prisma Configuration:**

```bash
# Initialize Prisma
npx prisma init
```

**Schema Definition:**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  PI
  FINANCE
  VIEWER
}

enum GrantStatus {
  DRAFT
  ACTIVE
  CLOSED
  NOT_AWARDED
}

enum RenewalStatus {
  PENDING
  SUBMITTED
  AWARDED
  NOT_AWARDED
}

enum BudgetCategory {
  PERSONNEL
  TRAVEL
  SUPPLIES
  EQUIPMENT
  INDIRECT
}

enum DocumentType {
  NARRATIVE
  BUDGET_JUSTIFICATION
  RENEWAL
  REPORT
  OTHER
}

enum TaskStatus {
  OPEN
  IN_PROGRESS
  COMPLETE
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

model User {
  id        String   @id @default(uuid())
  clerkId   String   @unique
  fullName  String
  email     String   @unique
  role      UserRole @default(VIEWER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  createdGrants     Grant[]           @relation("GrantCreator")
  principalGrants   Grant[]           @relation("PrincipalInvestigator")
  budgetUpdates     BudgetLineItem[]  @relation("BudgetUpdater")
  uploadedDocuments Document[]        @relation("DocumentUploader")
  assignedTasks     Task[]            @relation("TaskAssignee")

  @@map("users")
}

model Grant {
  id                     String      @id @default(uuid())
  grantTitle             String
  grantNumberMaster      String      @unique
  agencyName             String
  startDate              DateTime
  endDate                DateTime
  currentYearNumber      Int         @default(1)
  totalYears             Int
  status                 GrantStatus @default(DRAFT)
  principalInvestigatorId String
  createdById            String
  createdAt              DateTime    @default(now())
  updatedAt              DateTime    @updatedAt

  // Relations
  principalInvestigator User         @relation("PrincipalInvestigator", fields: [principalInvestigatorId], references: [id])
  createdBy             User         @relation("GrantCreator", fields: [createdById], references: [id])
  grantYears            GrantYear[]
  documents             Document[]

  @@map("grants")
}

model GrantYear {
  id                   String        @id @default(uuid())
  grantId              String
  yearNumber           Int
  fiscalYear           String
  grantNumber          String        @unique
  previousGrantNumber  String?
  awardAmount          Decimal       @db.Decimal(12, 2)
  renewalStatus        RenewalStatus @default(PENDING)
  submissionDueDate    DateTime?
  notes                String?       @db.Text
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  // Relations
  grant           Grant             @relation(fields: [grantId], references: [id], onDelete: Cascade)
  budgetLineItems BudgetLineItem[]
  documents       Document[]
  tasks           Task[]

  @@unique([grantId, yearNumber])
  @@map("grant_years")
}

model BudgetLineItem {
  id               String         @id @default(uuid())
  grantYearId      String
  category         BudgetCategory
  description      String
  budgetedAmount   Decimal        @db.Decimal(12, 2)
  actualSpent      Decimal        @default(0) @db.Decimal(12, 2)
  encumberedAmount Decimal        @default(0) @db.Decimal(12, 2)
  lastUpdatedBy    String
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  // Relations
  grantYear     GrantYear @relation(fields: [grantYearId], references: [id], onDelete: Cascade)
  lastUpdatedByUser User      @relation("BudgetUpdater", fields: [lastUpdatedBy], references: [id])

  @@map("budget_line_items")
}

model Document {
  id           String       @id @default(uuid())
  fileName     String
  fileUrl      String
  fileType     String
  fileSize     Int
  grantId      String?
  grantYearId  String?
  uploadedById String
  documentType DocumentType
  uploadedAt   DateTime     @default(now())

  // Relations
  grant        Grant?     @relation(fields: [grantId], references: [id], onDelete: Cascade)
  grantYear    GrantYear? @relation(fields: [grantYearId], references: [id], onDelete: Cascade)
  uploadedBy   User       @relation("DocumentUploader", fields: [uploadedById], references: [id])

  @@map("documents")
}

model Task {
  id           String       @id @default(uuid())
  grantYearId  String
  title        String
  description  String?      @db.Text
  dueDate      DateTime
  assignedToId String
  status       TaskStatus   @default(OPEN)
  priority     TaskPriority @default(MEDIUM)
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt

  // Relations
  grantYear  GrantYear @relation(fields: [grantYearId], references: [id], onDelete: Cascade)
  assignedTo User      @relation("TaskAssignee", fields: [assignedToId], references: [id])

  @@map("tasks")
}
```

**Database Commands:**

```bash
# Generate Prisma client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

## 📋 Phase 2: Authentication & API Setup

### 5. Implement authentication system with Clerk

**Clerk Configuration:**

```typescript
// src/middleware.ts
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: ['/', '/api/webhooks/clerk'],
  ignoredRoutes: ['/api/uploadthing'],
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

**Auth Provider Setup:**

```typescript
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### 6. Create core data models and database migrations

**Prisma Client Setup:**

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
```

**User Sync with Clerk:**

```typescript
// src/lib/auth.ts
import { auth, currentUser } from '@clerk/nextjs';
import { db } from './db';

export async function getCurrentUser() {
  const { userId } = auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Sync user with database
  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {
      fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
    },
    create: {
      clerkId: userId,
      fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      role: 'VIEWER', // Default role
    },
  });

  return user;
}
```

### 7. Set up tRPC API layer with type-safe endpoints

**tRPC Configuration:**

```typescript
// src/server/api/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getCurrentUser();

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: { ...ctx.session, userId: ctx.session.id },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

**Grant Router Example:**

```typescript
// src/server/api/routers/grant.ts
import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const grantRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        search: z.string().optional(),
        status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'NOT_AWARDED']).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, status, limit, cursor } = input;

      const grants = await ctx.db.grant.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          AND: [
            search
              ? {
                  OR: [
                    { grantTitle: { contains: search, mode: 'insensitive' } },
                    {
                      grantNumberMaster: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                    { agencyName: { contains: search, mode: 'insensitive' } },
                  ],
                }
              : {},
            status ? { status } : {},
          ],
        },
        include: {
          principalInvestigator: true,
          grantYears: {
            where: { yearNumber: { equals: ctx.db.grant.currentYearNumber } },
            take: 1,
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (grants.length > limit) {
        const nextItem = grants.pop();
        nextCursor = nextItem!.id;
      }

      return {
        grants,
        nextCursor,
      };
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const grant = await ctx.db.grant.findUnique({
        where: { id: input.id },
        include: {
          principalInvestigator: true,
          createdBy: true,
          grantYears: {
            include: {
              budgetLineItems: true,
              documents: true,
              tasks: true,
            },
            orderBy: { yearNumber: 'asc' },
          },
        },
      });

      if (!grant) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Grant not found',
        });
      }

      return grant;
    }),

  create: protectedProcedure
    .input(
      z.object({
        grantTitle: z.string().min(1),
        grantNumberMaster: z.string().min(1),
        agencyName: z.string().min(1),
        principalInvestigatorId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        totalYears: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user has permission to create grants
      if (ctx.session.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Only admins can create grants',
        });
      }

      const grant = await ctx.db.grant.create({
        data: {
          ...input,
          createdById: ctx.session.userId,
        },
        include: {
          principalInvestigator: true,
        },
      });

      return grant;
    }),
});
```

## 📋 Phase 3: UI Components & Pages

### 8. Build user interface components and layouts

**Base UI Components:**

```typescript
// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Layout Components:**

```typescript
// src/components/layout/main-layout.tsx
import { UserButton } from '@clerk/nextjs'
import { Navigation } from './navigation'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Grant Tracker 2.0
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Navigation />
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
```

This implementation guide provides the foundation for building Grant Tracker 2.0. Each phase builds upon the previous one, ensuring a solid, scalable architecture that follows modern web development best practices.

The next phases would cover the remaining todo items including dashboard implementation, grant detail pages, budget management, document uploads, and testing setup.
