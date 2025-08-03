import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
  useParams() {
    return {};
  },
}));

// Mock React Hook Form
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    register: jest.fn(),
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    watch: jest.fn(),
    reset: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(),
  }),
  FormProvider: ({ children }) => children,
  useFormContext: () => ({
    register: jest.fn(),
    formState: { errors: {} },
    watch: jest.fn(),
  }),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid='search-icon' />,
  Plus: () => <div data-testid='plus-icon' />,
  Filter: () => <div data-testid='filter-icon' />,
  Calendar: () => <div data-testid='calendar-icon' />,
  DollarSign: () => <div data-testid='dollar-sign-icon' />,
  FileText: () => <div data-testid='file-text-icon' />,
  Users: () => <div data-testid='users-icon' />,
  Building: () => <div data-testid='building-icon' />,
  Clock: () => <div data-testid='clock-icon' />,
  CheckCircle: () => <div data-testid='check-circle-icon' />,
  AlertCircle: () => <div data-testid='alert-circle-icon' />,
  Circle: () => <div data-testid='circle-icon' />,
  AlertTriangle: () => <div data-testid='alert-triangle-icon' />,
  Edit: () => <div data-testid='edit-icon' />,
  Trash2: () => <div data-testid='trash-icon' />,
  ArrowLeft: () => <div data-testid='arrow-left-icon' />,
  Download: () => <div data-testid='download-icon' />,
  Upload: () => <div data-testid='upload-icon' />,
  ListTodo: () => <div data-testid='list-todo-icon' />,
  User: () => <div data-testid='user-icon' />,
  X: () => <div data-testid='x-icon' />,
  MoreHorizontal: () => <div data-testid='more-horizontal-icon' />,
  TrendingUp: () => <div data-testid='trending-up-icon' />,
  Settings: () => <div data-testid='settings-icon' />,
  BarChart3: () => <div data-testid='bar-chart-icon' />,
}));

// Mock permissions hook
jest.mock('@/hooks/use-permissions', () => ({
  usePermissions: () => ({
    user: { id: 'test-user', fullName: 'Test User', role: 'ADMIN' },
    userRole: 'ADMIN',
    hasPermission: jest.fn(() => true),
    canAccessGrant: jest.fn(() => true),
    canEditGrant: jest.fn(() => true),
    canEdit: true,
    canDelete: true,
    canUpload: true,
    canManageBudget: true,
  }),
  useRoleBasedUI: () => ({
    showCreateGrant: true,
    showAdminPanel: true,
    showFinanceTools: true,
    maxGrantsVisible: 50,
  }),
}));

// Mock form validation hook
jest.mock('@/hooks/use-form-validation', () => ({
  useFormValidation: () => ({
    validateData: jest.fn(() => ({ success: true, data: {} })),
    validateCreateGrant: jest.fn(() => ({ success: true, data: {} })),
    validateUpdateGrant: jest.fn(() => ({ success: true, data: {} })),
    validateCreateTask: jest.fn(() => ({ success: true, data: {} })),
    validateSearchGrants: jest.fn(() => ({ success: true, data: {} })),
    validateEmail: jest.fn(() => true),
    validateCurrency: jest.fn(() => true),
    validateDateRange: jest.fn(() => true),
    getFieldError: jest.fn(),
    hasFieldError: jest.fn(() => false),
  }),
}));

// Mock utils
jest.mock('@/lib/utils', () => ({
  cn: (...classes) => classes.filter(Boolean).join(' '),
  formatCurrency: amount => `$${amount.toLocaleString()}`,
  getStatusBadgeVariant: status => 'default',
}));

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
