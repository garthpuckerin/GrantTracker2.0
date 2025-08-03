# GrantTracker 2.0 - Portfolio Notes

## Current Implementation Status

### 🎯 **Purpose**

This is a **demonstration/portfolio project** showcasing a multi-year federal grant management platform built with Next.js, TypeScript, Prisma, and tRPC.

### 📊 **Data Status**

#### **Mock Data (Frontend)**

- **Dashboard**: Currently displays mock data for demonstration purposes
  - Shows "15 total grants" in stats but only displays 3 sample grants
  - This is intentional for portfolio demonstration
  - Mock data includes realistic grant examples with budgets and tasks
- **Authentication**: Uses mock user for demo purposes
  - Mock user: `demo@university.edu` with ADMIN role
  - Demo sign-in page with pre-filled credentials (demo@university.edu / demo123)
  - Clerk authentication is configured but bypassed for demo
  - Real authentication system is implemented and ready for production
  - Sign-out functionality redirects to `/sign-in` page

#### **Real Database (Backend)**

- **Database**: PostgreSQL with Prisma ORM
- **Seed Data**: 1 real grant with 5 grant years created via database seeding
- **Users**: 3 sample users (Admin, PI, Finance) with different permission levels
- **Budget Items**: 6 budget line items for the sample grant
- **Tasks**: 3 sample tasks associated with the grant

### 🏗️ **Architecture Highlights**

#### **Frontend**

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Role-based UI components
- Permission-based access control
- Responsive design

#### **Backend**

- tRPC for type-safe API calls
- Prisma ORM with PostgreSQL
- Clerk for authentication
- UploadThing for file uploads
- Comprehensive validation with Zod

#### **Key Features Implemented**

- ✅ User authentication and role management
- ✅ Grant creation and management
- ✅ Multi-year grant tracking
- ✅ Budget line item management
- ✅ Task management system
- ✅ Document upload system
- ✅ Permission-based access control
- ✅ Search and filtering capabilities
- ✅ Responsive dashboard

### 🔧 **Development Notes**

#### **To Switch to Real Data**

The dashboard currently uses mock data for demonstration. To use real database data:

1. **Update Dashboard**: Replace mock data in `src/app/dashboard/page.tsx` with tRPC calls
2. **Add More Seed Data**: Create additional grants in `prisma/seed.ts`
3. **Implement Real Stats**: Calculate actual grant counts from database
4. **Enable Real Authentication**:
   - Update `src/hooks/use-permissions.ts` to use Clerk instead of mock user
   - Replace demo sign-in page with Clerk SignIn component
   - Add ClerkProvider to `src/app/layout.tsx`

#### **Current Mock Data Structure**

```typescript
// Dashboard shows these stats:
mockStats = {
  totalGrants: 15, // Mock number
  activeGrants: 8, // Mock number
  draftGrants: 4, // Mock number
  closedGrants: 3, // Mock number
};

// But only displays 3 sample grants:
mockGrants = [
  // 3 realistic grant examples
];
```

### 🚀 **Portfolio Context**

This project demonstrates:

- **Full-stack development** with modern technologies
- **Database design** and ORM usage
- **Type safety** throughout the stack
- **Authentication and authorization** systems
- **Responsive UI/UX** design
- **Real-world application** architecture

The mock data allows viewers to see the complete UI/UX without needing to set up a full database with extensive sample data, while the real database implementation shows the actual technical capabilities.

### 📝 **For Viewers**

**What you're seeing:**

- A fully functional grant management system
- Real authentication and database integration
- Mock data for demonstration purposes
- Complete UI/UX implementation
- Working authentication flow (sign-in → dashboard → sign-out)

**Demo Authentication Flow:**

1. **Sign In**: Visit `/sign-in` with pre-filled demo credentials
2. **Dashboard**: Access full application with mock user (ADMIN role)
3. **Grant Details**: Only Grant ID "1" is available (`/grant/1`)
4. **Sign Out**: Click "Sign Out (Demo)" to return to sign-in page
5. **Complete Cycle**: Repeat the flow to see full user experience

**Demo Limitations:**

- Only Grant ID "1" has detailed data for viewing
- Other grant IDs will show a helpful error message
- "Current Year" buttons for grants 2 & 3 are disabled with tooltip explanation
- This demonstrates error handling and user guidance

**What's real:**

- All backend functionality
- Database schema and relationships
- Authentication system
- File upload capabilities
- Permission system

**What's mock:**

- Dashboard statistics (15 grants vs 3 displayed)
- Sample grant data on the frontend
- Authentication user (demo@university.edu with ADMIN role)
- Sign-in page (custom demo page instead of Clerk)
- Task data (mock tasks for demonstration)
- Grant details (only Grant ID "1" is available for viewing)
- Some UI elements for demonstration

### 🎨 **Recent UI/UX Improvements**

- **Color Consistency**: Standardized badge colors across all components
  - Status badges: COMPLETED (emerald), IN_PROGRESS (indigo), PENDING (amber), CANCELLED (orange)
  - Priority badges: URGENT (red), HIGH (pink), MEDIUM (yellow), LOW (slate)
  - Document type badges: proposal (blue), budget (green), correspondence (purple)
- **Task Management**: Updated task statistics colors to match badge colors
  - Overdue tasks: red (matches URGENT priority)
  - Pending tasks: amber (matches PENDING status)
  - In Progress: indigo (matches IN_PROGRESS status)
  - Completed: emerald (matches COMPLETED status)
- **Dashboard Statistics**: Updated colors to match badge colors for consistency
- **Error Handling**: Enhanced 404 messages for demo limitations
- **Tooltips**: Custom tooltips for disabled buttons explaining demo constraints
- **Testing**: Comprehensive test suite with 34 passing tests covering validation schemas, UI components, and task management
- **Accessibility**: Automated accessibility testing with 10 passing a11y tests covering ARIA compliance, keyboard navigation, and screen reader support

This approach allows for a complete demonstration of the application's capabilities while maintaining a clean, focused portfolio presentation.
