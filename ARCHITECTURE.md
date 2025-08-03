# Grant Tracker 2.0 - Architecture Plan

## 🏗️ System Architecture Overview

Grant Tracker 2.0 is a full-stack web application for managing multi-year federal grants with role-based access control, document management, and budget tracking capabilities.

### Tech Stack Decision Matrix

| Component          | Choice                          | Rationale                                                                        |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------------- |
| **Frontend**       | Next.js 14 (App Router) + React | Modern SSR/SSG, excellent developer experience, built-in optimization            |
| **Styling**        | Tailwind CSS                    | Rapid development, consistent design system, small bundle size                   |
| **API Layer**      | tRPC                            | End-to-end type safety, excellent Next.js integration, auto-generated client     |
| **Database**       | PostgreSQL (Supabase)           | Relational data integrity, excellent JSON support, managed service               |
| **ORM**            | Prisma                          | Type-safe database access, excellent migration system, great Next.js integration |
| **Authentication** | Clerk                           | Built-in RBAC, easy Next.js integration, comprehensive user management           |
| **File Storage**   | UploadThing                     | Seamless Next.js integration, built for React applications                       |
| **Validation**     | Zod                             | Runtime type validation, tRPC integration, excellent TypeScript support          |
| **Development DB** | Docker PostgreSQL               | Consistent local development environment                                         |

## 🗄️ Database Schema Architecture

```mermaid
erDiagram
    User ||--o{ Grant : "creates/manages"
    User ||--o{ BudgetLineItem : "updates"
    User ||--o{ Document : "uploads"
    User ||--o{ Task : "assigned_to"

    Grant ||--o{ GrantYear : "has_years"
    Grant ||--o{ Document : "belongs_to"
    Grant }o--|| User : "principal_investigator"

    GrantYear ||--o{ BudgetLineItem : "contains"
    GrantYear ||--o{ Document : "year_specific"
    GrantYear ||--o{ Task : "belongs_to"

    User {
        uuid id PK
        string fullName
        string email
        enum role
        timestamp createdAt
        timestamp updatedAt
    }

    Grant {
        uuid id PK
        string grantTitle
        string grantNumberMaster
        uuid principalInvestigatorId FK
        string agencyName
        date startDate
        date endDate
        int currentYearNumber
        int totalYears
        enum status
        uuid createdById FK
        timestamp createdAt
        timestamp updatedAt
    }

    GrantYear {
        uuid id PK
        uuid grantId FK
        int yearNumber
        string fiscalYear
        string grantNumber
        string previousGrantNumber
        decimal awardAmount
        enum renewalStatus
        date submissionDueDate
        text notes
        timestamp createdAt
        timestamp updatedAt
    }

    BudgetLineItem {
        uuid id PK
        uuid grantYearId FK
        enum category
        string description
        decimal budgetedAmount
        decimal actualSpent
        decimal encumberedAmount
        uuid lastUpdatedBy FK
        timestamp createdAt
        timestamp updatedAt
    }

    Document {
        uuid id PK
        string fileName
        string fileUrl
        string fileType
        int fileSize
        uuid grantId FK
        uuid grantYearId FK
        uuid uploadedById FK
        enum documentType
        timestamp uploadedAt
    }

    Task {
        uuid id PK
        uuid grantYearId FK
        string title
        text description
        date dueDate
        uuid assignedToId FK
        enum status
        enum priority
        timestamp createdAt
        timestamp updatedAt
    }
```

## 🔐 Authentication & Authorization Architecture

### Role-Based Access Control (RBAC)

| Role                            | Permissions                                                        |
| ------------------------------- | ------------------------------------------------------------------ |
| **Admin**                       | Full system access, user management, create/edit/delete all grants |
| **PI (Principal Investigator)** | View/edit assigned grants, upload documents, manage tasks          |
| **Finance**                     | View all grants, edit budgets, upload financial documents          |
| **Viewer**                      | Read-only access to assigned grants                                |

### Authorization Flow

```mermaid
flowchart TD
    A[User Request] --> B{Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D{Has Required Role?}
    D -->|No| E[403 Forbidden]
    D -->|Yes| F{Resource Owner?}
    F -->|No| G{Admin Role?}
    G -->|No| H[403 Forbidden]
    G -->|Yes| I[Allow Access]
    F -->|Yes| I[Allow Access]
    I --> J[Execute Request]
```

## 🏛️ Application Architecture

### Folder Structure

```
grant-tracker-2.0/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth group routes
│   │   ├── dashboard/         # Dashboard pages
│   │   ├── grant/             # Grant management pages
│   │   ├── admin/             # Admin pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility libraries
│   │   ├── db.ts            # Database connection
│   │   ├── auth.ts          # Auth configuration
│   │   └── utils.ts         # Utility functions
│   ├── server/              # tRPC server code
│   │   ├── api/             # tRPC routers
│   │   └── db/              # Database schemas
│   └── types/               # TypeScript type definitions
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
└── docs/                   # Documentation
```

### Component Architecture

```mermaid
flowchart TD
    A[App Layout] --> B[Navigation]
    A --> C[Main Content]

    C --> D[Dashboard]
    C --> E[Grant Detail]
    C --> F[Admin Panel]

    D --> G[Grant List]
    D --> H[Search Bar]
    D --> I[Filter Panel]

    E --> J[Grant Header]
    E --> K[Year Selector]
    E --> L[Budget Table]
    E --> M[Document List]
    E --> N[Task List]

    G --> O[Grant Card]
    L --> P[Budget Line Item]
    M --> Q[Document Item]
    N --> R[Task Item]
```

## 🔄 Data Flow Architecture

### tRPC API Structure

```
api/
├── grant/
│   ├── create
│   ├── update
│   ├── delete
│   ├── getById
│   └── getAll
├── grantYear/
│   ├── create
│   ├── update
│   ├── getByGrantId
│   └── getCurrentYear
├── budget/
│   ├── createLineItem
│   ├── updateLineItem
│   ├── deleteLineItem
│   └── getByGrantYear
├── document/
│   ├── upload
│   ├── delete
│   ├── getByGrant
│   └── getByGrantYear
├── task/
│   ├── create
│   ├── update
│   ├── delete
│   └── getByGrantYear
└── user/
    ├── getProfile
    ├── updateProfile
    └── getAll (admin only)
```

## 📱 User Interface Architecture

### Design System

- **Color Palette**: Professional blue/gray theme with status colors
- **Typography**: Inter font family for readability
- **Components**: Shadcn/ui base components with custom extensions
- **Responsive**: Mobile-first design with desktop optimization

### Page Hierarchy

```
/ (Landing/Login)
├── /dashboard
│   ├── Grant overview cards
│   ├── Search and filters
│   └── Quick actions
├── /grant/[id]
│   ├── Grant overview
│   ├── Year selector
│   ├── Budget summary
│   └── Recent activity
├── /grant/[id]/year/[yearId]
│   ├── Year details
│   ├── Budget line items
│   ├── Documents
│   └── Tasks
└── /admin
    ├── User management
    ├── System settings
    └── Audit logs
```

## 🔧 Development Workflow

### Local Development Setup

1. **Environment**: Docker Compose for PostgreSQL
2. **Database**: Prisma migrations and seeding
3. **Authentication**: Clerk development keys
4. **File Storage**: UploadThing development configuration

### Code Quality Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended + custom rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality checks

### Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright for E2E
- **API Tests**: tRPC testing utilities
- **Database Tests**: Prisma test database

## 🚀 Deployment Architecture

### Production Stack

- **Frontend**: Vercel (automatic deployments from Git)
- **Database**: Supabase PostgreSQL (managed)
- **File Storage**: UploadThing (production tier)
- **Authentication**: Clerk (production environment)

### Environment Configuration

- **Development**: Local Docker + development services
- **Staging**: Vercel preview deployments
- **Production**: Vercel production + managed services

## 📊 Performance Considerations

### Database Optimization

- Proper indexing on frequently queried fields
- Connection pooling via Prisma
- Query optimization with select statements

### Frontend Optimization

- Next.js automatic code splitting
- Image optimization with next/image
- Static generation where possible
- Client-side caching with React Query

### Security Measures

- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS protection with proper sanitization
- CSRF protection via Next.js built-ins
- File upload validation and scanning

## 🔍 Monitoring & Observability

### Logging Strategy

- Structured logging with Winston
- Error tracking with Sentry integration
- Performance monitoring with Vercel Analytics
- Database query monitoring via Prisma

### Health Checks

- API endpoint health checks
- Database connection monitoring
- File storage availability checks
- Authentication service status

This architecture provides a solid foundation for building a scalable, maintainable, and secure grant management system that can grow with your organization's needs.
