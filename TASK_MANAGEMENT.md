# Task Management System

Grant Tracker 2.0 includes a comprehensive task management system designed specifically for federal grant administration. This system helps track milestones, deliverables, and administrative tasks across multi-year grants.

## Overview

The task management system provides:

- **Grant-specific task tracking** with year-based organization
- **Priority-based task management** with urgency indicators
- **Team collaboration** with task assignment capabilities
- **Progress monitoring** with status tracking and completion dates
- **Deadline management** with overdue task identification
- **Integrated validation** using Zod schemas for data integrity
- **Role-based access control** for task creation and management

## Architecture

### Core Components

```
src/
├── components/
│   ├── tasks/
│   │   └── task-list.tsx           # Main task listing component
│   └── forms/
│       └── create-task-form.tsx    # Task creation form with validation
├── app/
│   └── tasks/
│       └── page.tsx                # Standalone task management dashboard
└── lib/
    └── validations.ts              # Task validation schemas
```

## Task Data Model

### Task Schema

```typescript
const taskSchema = baseTaskSchema
  .refine(
    data => {
      if (data.status === 'COMPLETED' && !data.completedAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Completed tasks must have a completion date',
      path: ['completedAt'],
    }
  )
  .refine(
    data => {
      if (data.dueDate && data.dueDate < new Date()) {
        return data.status === 'COMPLETED' || data.status === 'CANCELLED';
      }
      return true;
    },
    {
      message: 'Overdue tasks must be completed or cancelled',
      path: ['status'],
    }
  );
```

### Task Properties

- **Title**: 5-200 characters, descriptive task name
- **Description**: Optional detailed description (max 1000 characters)
- **Status**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- **Priority**: LOW, MEDIUM, HIGH, URGENT
- **Due Date**: Optional deadline for task completion
- **Assignment**: Optional team member assignment
- **Grant Year Association**: Links tasks to specific grant years
- **Completion Tracking**: Automatic completion date recording

## Task Management Features

### Task Status Workflow

```
PENDING → IN_PROGRESS → COMPLETED
    ↓         ↓
CANCELLED ← CANCELLED
```

**Status Definitions:**

- **PENDING**: Task created but not yet started
- **IN_PROGRESS**: Task actively being worked on
- **COMPLETED**: Task finished successfully
- **CANCELLED**: Task no longer needed or abandoned

### Priority System

**Priority Levels:**

- **URGENT**: Critical tasks requiring immediate attention
- **HIGH**: Important tasks with significant impact
- **MEDIUM**: Standard priority tasks
- **LOW**: Nice-to-have or future tasks

**Visual Indicators:**

- Urgent: Red background with warning indicators
- High: Orange background
- Medium: Yellow background
- Low: Green background

### Overdue Task Management

Tasks are automatically flagged as overdue when:

- Due date has passed
- Status is not COMPLETED or CANCELLED
- Visual indicators show overdue status
- Special filtering available for overdue tasks

## User Interface Components

### TaskList Component

The main task listing component provides:

```typescript
interface TaskListProps {
  grantYearId?: string; // Filter tasks by grant year
  showFilters?: boolean; // Show/hide filter controls
  compact?: boolean; // Compact display mode
}
```

**Features:**

- **Filtering**: By status, priority, and overdue status
- **Search**: Text-based task search
- **Sorting**: By due date, priority, and status
- **Visual Status**: Color-coded status and priority indicators
- **Grant Context**: Shows associated grant information
- **Assignment Display**: Shows assigned team members

### CreateTaskForm Component

Task creation form with comprehensive validation:

```typescript
interface CreateTaskFormProps {
  grantYearId: string; // Required grant year association
  onSuccess?: (task: any) => void; // Success callback
  onCancel?: () => void; // Cancel callback
  isOpen?: boolean; // Form visibility control
}
```

**Form Features:**

- **Real-time Validation**: Zod schema validation
- **Task Preview**: Live preview of task details
- **Team Assignment**: Dropdown selection of team members
- **Date Picker**: Due date selection with validation
- **Priority Selection**: Visual priority selection
- **Status Management**: Initial status setting

## Task Management Dashboard

### Standalone Dashboard (`/tasks`)

The dedicated task management page provides:

**Task Statistics:**

- Total task count across all grants
- Tasks by status (pending, in progress, completed, overdue)
- Completion rate tracking
- Weekly and monthly task metrics

**Upcoming Deadlines:**

- Tasks due in the next 30 days
- Priority-based sorting
- Grant association display
- Days until due calculation

**Quick Actions:**

- Create new task
- View calendar integration
- Mark tasks complete
- Review overdue tasks

**Task Distribution:**

- Visual breakdown by status
- Priority distribution
- Grant-based task allocation

### Grant-Integrated Tasks

Tasks are integrated into grant detail pages:

**Grant-Specific View:**

- Tasks filtered by selected grant year
- Contextual task creation
- Year-based task organization
- Permission-based access control

**Integration Features:**

- Seamless navigation between grants and tasks
- Year selector synchronization
- Role-based task management permissions
- Inline task creation and editing

## Validation and Data Integrity

### Task Validation Rules

```typescript
// Title validation
title: z.string()
  .min(5, 'Task title must be at least 5 characters')
  .max(200, 'Task title must be less than 200 characters')

  // Status validation with business logic
  .refine(
    data => {
      if (data.status === 'COMPLETED' && !data.completedAt) {
        return false;
      }
      return true;
    },
    {
      message: 'Completed tasks must have a completion date',
      path: ['completedAt'],
    }
  )

  // Overdue task validation
  .refine(
    data => {
      if (data.dueDate && data.dueDate < new Date()) {
        return data.status === 'COMPLETED' || data.status === 'CANCELLED';
      }
      return true;
    },
    {
      message: 'Overdue tasks must be completed or cancelled',
      path: ['status'],
    }
  );
```

### Data Consistency

- **Grant Year Association**: All tasks must be linked to valid grant years
- **User Assignment**: Assigned users must exist and have appropriate permissions
- **Date Validation**: Due dates must be reasonable and future-focused
- **Status Transitions**: Logical status progression enforcement
- **Completion Tracking**: Automatic timestamp management

## Role-Based Access Control

### Permission System

**Task Permissions:**

- `MANAGE_TASKS`: Create, edit, and delete tasks
- `VIEW_TASKS`: View task lists and details
- `ASSIGN_TASKS`: Assign tasks to team members
- `COMPLETE_TASKS`: Mark tasks as completed

**Role-Based Access:**

- **ADMIN**: Full task management across all grants
- **PI**: Manage tasks for their grants
- **FINANCE**: View and manage budget-related tasks
- **VIEWER**: Read-only access to task information

### Permission Guards

```typescript
// Task creation permission
<PermissionGuard
  grant={{ principalInvestigatorId: 'demo-user-id' }}
  requireGrantEdit={true}
  showFallback={false}
>
  <Button onClick={() => setShowCreateTask(true)}>
    <Plus className='h-4 w-4' />
    Add Task
  </Button>
</PermissionGuard>
```

## Integration Points

### Grant Management Integration

**Grant Detail Pages:**

- Tasks section integrated into grant tabs
- Year-specific task filtering
- Contextual task creation
- Permission-based access control

**Dashboard Integration:**

- Task statistics in main dashboard
- Quick access to task management
- Navigation integration

### Form Validation Integration

**Zod Schema Integration:**

- Comprehensive task validation
- Real-time error feedback
- Type-safe form handling
- Business rule enforcement

### Document Management Integration

**Task-Document Linking:**

- Tasks can reference related documents
- Document upload triggers for task completion
- Milestone documentation requirements

## Usage Examples

### Creating a Task

```typescript
// Basic task creation
const newTask = {
  grantYearId: 'grant-year-123',
  title: 'Submit quarterly progress report',
  description: 'Prepare and submit Q1 progress report to NSF',
  status: 'PENDING',
  priority: 'HIGH',
  dueDate: new Date('2024-03-15'),
  assignedToId: 'user-456',
};

// Validation
const result = validateCreateTask(newTask);
if (result.success) {
  // Create task
  await createTask(result.data);
}
```

### Filtering Tasks

```typescript
// Filter by status and priority
const filteredTasks = tasks.filter(task => {
  const statusMatch = filter === 'all' || task.status.toLowerCase() === filter;
  const priorityMatch =
    priorityFilter === 'all' || task.priority.toLowerCase() === priorityFilter;
  return statusMatch && priorityMatch;
});

// Filter overdue tasks
const overdueTasks = tasks.filter(
  task =>
    task.status !== 'COMPLETED' &&
    task.status !== 'CANCELLED' &&
    task.dueDate &&
    task.dueDate < new Date()
);
```

### Task Status Updates

```typescript
// Complete a task
const completeTask = async (taskId: string) => {
  const updateData = {
    status: 'COMPLETED',
    completedAt: new Date(),
  };

  const result = validateUpdateTask(updateData);
  if (result.success) {
    await updateTask(taskId, result.data);
  }
};
```

## Best Practices

### Task Creation

1. **Descriptive Titles**: Use clear, actionable task titles
2. **Appropriate Priority**: Set priority based on impact and urgency
3. **Realistic Due Dates**: Allow adequate time for completion
4. **Clear Descriptions**: Provide context and requirements
5. **Proper Assignment**: Assign to appropriate team members

### Task Management

1. **Regular Updates**: Keep task status current
2. **Deadline Monitoring**: Review upcoming deadlines regularly
3. **Priority Adjustment**: Update priorities as circumstances change
4. **Completion Documentation**: Record completion details
5. **Archive Completed**: Remove or archive old completed tasks

### Team Collaboration

1. **Clear Assignment**: Assign tasks to specific individuals
2. **Status Communication**: Update status promptly
3. **Deadline Awareness**: Communicate deadline changes
4. **Progress Updates**: Provide regular progress updates
5. **Completion Notification**: Notify stakeholders of completion

## Performance Considerations

### Task Loading

- **Pagination**: Implement pagination for large task lists
- **Filtering**: Client-side filtering for responsive UI
- **Lazy Loading**: Load task details on demand
- **Caching**: Cache frequently accessed task data

### Database Optimization

- **Indexing**: Index on grantYearId, status, dueDate, assignedToId
- **Query Optimization**: Efficient filtering and sorting queries
- **Batch Operations**: Bulk updates for status changes
- **Archive Strategy**: Archive old completed tasks

## Future Enhancements

### Planned Features

- **Calendar Integration**: Full calendar view of tasks and deadlines
- **Email Notifications**: Automated deadline and assignment notifications
- **Task Templates**: Predefined task templates for common activities
- **Time Tracking**: Track time spent on tasks
- **Subtasks**: Break down complex tasks into subtasks
- **Task Dependencies**: Link related tasks with dependencies
- **Recurring Tasks**: Automatic creation of recurring tasks
- **Mobile App**: Mobile task management capabilities

### Integration Opportunities

- **External Calendars**: Sync with Google Calendar, Outlook
- **Project Management**: Integration with tools like Jira, Asana
- **Communication**: Slack/Teams integration for notifications
- **Reporting**: Advanced analytics and reporting
- **API Integration**: RESTful API for external integrations

## Troubleshooting

### Common Issues

1. **Tasks Not Displaying**: Check grant year filter and permissions
2. **Validation Errors**: Review required fields and data formats
3. **Permission Denied**: Verify user role and grant access
4. **Overdue Tasks**: Review date calculations and status logic
5. **Assignment Issues**: Confirm user exists and has permissions

### Debugging Tips

1. **Check Console**: Review browser console for errors
2. **Validate Data**: Use validation hooks to test data
3. **Permission Testing**: Test with different user roles
4. **Date Handling**: Verify timezone and date format issues
5. **Network Requests**: Monitor API calls and responses

This task management system provides a comprehensive solution for tracking and managing grant-related activities, ensuring nothing falls through the cracks in complex multi-year federal grant administration.
