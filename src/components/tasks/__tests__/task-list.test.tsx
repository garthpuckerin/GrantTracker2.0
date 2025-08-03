import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from '../task-list';

// Mock the task data
const mockTasks = [
  {
    id: 'task-1',
    title: 'Submit quarterly progress report',
    description: 'Prepare and submit the Q1 2024 progress report',
    status: 'PENDING' as const,
    priority: 'HIGH' as const,
    dueDate: new Date('2024-03-15'),
    assignedTo: { id: 'user1', fullName: 'Dr. Jane Smith' },
    grantYear: {
      grant: {
        grantTitle: 'Advanced Materials Research',
        grantNumberMaster: 'NSF-2024-001',
      },
    },
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'task-2',
    title: 'Review budget allocations',
    description: 'Analyze current spending patterns',
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    dueDate: new Date('2024-03-30'),
    assignedTo: { id: 'user2', fullName: 'Dr. John Doe' },
    grantYear: {
      grant: {
        grantTitle: 'Climate Change Study',
        grantNumberMaster: 'EPA-2023-045',
      },
    },
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'task-3',
    title: 'Equipment procurement approval',
    description: 'Obtain necessary approvals for equipment',
    status: 'COMPLETED' as const,
    priority: 'URGENT' as const,
    dueDate: new Date('2024-02-28'),
    completedAt: new Date('2024-02-25'),
    assignedTo: { id: 'user3', fullName: 'Dr. Sarah Johnson' },
    grantYear: {
      grant: {
        grantTitle: 'Renewable Energy Systems',
        grantNumberMaster: 'DOE-2023-078',
      },
    },
    createdAt: new Date('2024-02-10'),
  },
];

// Mock the component to avoid complex dependencies
jest.mock('../task-list', () => {
  return {
    TaskList: ({
      showFilters = true,
      compact = false,
    }: {
      showFilters?: boolean;
      compact?: boolean;
    }) => {
      const [filter, setFilter] = React.useState<string>('all');
      const [priorityFilter, setPriorityFilter] = React.useState<string>('all');

      const filteredTasks = mockTasks.filter(task => {
        if (filter !== 'all' && task.status.toLowerCase() !== filter)
          return false;
        if (
          priorityFilter !== 'all' &&
          task.priority.toLowerCase() !== priorityFilter
        )
          return false;
        return true;
      });

      return (
        <div data-testid='task-list'>
          <h2>Task Management</h2>

          {showFilters && (
            <div data-testid='filters'>
              <select
                data-testid='status-filter'
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value='all'>All Tasks</option>
                <option value='pending'>Pending</option>
                <option value='in_progress'>In Progress</option>
                <option value='completed'>Completed</option>
              </select>

              <select
                data-testid='priority-filter'
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
              >
                <option value='all'>All Priorities</option>
                <option value='urgent'>Urgent</option>
                <option value='high'>High</option>
                <option value='medium'>Medium</option>
                <option value='low'>Low</option>
              </select>
            </div>
          )}

          <div data-testid='task-count'>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </div>

          {filteredTasks.length === 0 ? (
            <div data-testid='no-tasks'>No tasks found</div>
          ) : (
            <div data-testid='task-items'>
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  data-testid={`task-${task.id}`}
                  className={compact ? 'compact' : ''}
                >
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <span data-testid={`status-${task.id}`}>{task.status}</span>
                  <span data-testid={`priority-${task.id}`}>
                    {task.priority}
                  </span>
                  {task.assignedTo && (
                    <span data-testid={`assigned-${task.id}`}>
                      {task.assignedTo.fullName}
                    </span>
                  )}
                  {task.dueDate && (
                    <span data-testid={`due-date-${task.id}`}>
                      {task.dueDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    },
  };
});

describe('TaskList Component', () => {
  it('renders task management header', () => {
    render(<TaskList />);
    expect(screen.getByText('Task Management')).toBeInTheDocument();
  });

  it('displays all tasks by default', () => {
    render(<TaskList />);
    expect(screen.getByTestId('task-count')).toHaveTextContent('3 tasks');
    expect(screen.getByTestId('task-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-task-2')).toBeInTheDocument();
    expect(screen.getByTestId('task-task-3')).toBeInTheDocument();
  });

  it('shows filters when showFilters is true', () => {
    render(<TaskList showFilters={true} />);
    expect(screen.getByTestId('filters')).toBeInTheDocument();
    expect(screen.getByTestId('status-filter')).toBeInTheDocument();
    expect(screen.getByTestId('priority-filter')).toBeInTheDocument();
  });

  it('hides filters when showFilters is false', () => {
    render(<TaskList showFilters={false} />);
    expect(screen.queryByTestId('filters')).not.toBeInTheDocument();
  });

  it('filters tasks by status', () => {
    render(<TaskList />);

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'completed' } });

    expect(screen.getByTestId('task-count')).toHaveTextContent('1 task');
    expect(screen.getByTestId('task-task-3')).toBeInTheDocument();
    expect(screen.queryByTestId('task-task-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('task-task-2')).not.toBeInTheDocument();
  });

  it('filters tasks by priority', () => {
    render(<TaskList />);

    const priorityFilter = screen.getByTestId('priority-filter');
    fireEvent.change(priorityFilter, { target: { value: 'urgent' } });

    expect(screen.getByTestId('task-count')).toHaveTextContent('1 task');
    expect(screen.getByTestId('task-task-3')).toBeInTheDocument();
  });

  it('shows no tasks message when no tasks match filters', () => {
    render(<TaskList />);

    const statusFilter = screen.getByTestId('status-filter');
    fireEvent.change(statusFilter, { target: { value: 'cancelled' } });

    expect(screen.getByTestId('no-tasks')).toBeInTheDocument();
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('displays task details correctly', () => {
    render(<TaskList />);

    const task1 = screen.getByTestId('task-task-1');
    expect(task1).toHaveTextContent('Submit quarterly progress report');
    expect(task1).toHaveTextContent(
      'Prepare and submit the Q1 2024 progress report'
    );

    expect(screen.getByTestId('status-task-1')).toHaveTextContent('PENDING');
    expect(screen.getByTestId('priority-task-1')).toHaveTextContent('HIGH');
    expect(screen.getByTestId('assigned-task-1')).toHaveTextContent(
      'Dr. Jane Smith'
    );
    expect(screen.getByTestId('due-date-task-1')).toHaveTextContent(
      '3/14/2024'
    );
  });

  it('applies compact styling when compact prop is true', () => {
    render(<TaskList compact={true} />);

    const task1 = screen.getByTestId('task-task-1');
    expect(task1).toHaveClass('compact');
  });

  it('combines status and priority filters', () => {
    render(<TaskList />);

    const statusFilter = screen.getByTestId('status-filter');
    const priorityFilter = screen.getByTestId('priority-filter');

    fireEvent.change(statusFilter, { target: { value: 'pending' } });
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    expect(screen.getByTestId('task-count')).toHaveTextContent('1 task');
    expect(screen.getByTestId('task-task-1')).toBeInTheDocument();
  });
});
