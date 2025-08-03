import { z } from 'zod';
import { UserRole } from '@prisma/client';

// User validation schemas
export const userSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email('Invalid email address'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters'),
  role: z.nativeEnum(UserRole),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateUserSchema = userSchema
  .partial()
  .omit({ id: true, createdAt: true, updatedAt: true });

// Grant validation schemas
export const grantStatusSchema = z.enum([
  'DRAFT',
  'ACTIVE',
  'CLOSED',
  'NOT_AWARDED',
]);

// Base grant schema without refinements
const baseGrantSchema = z.object({
  id: z.string().cuid(),
  grantTitle: z
    .string()
    .min(5, 'Grant title must be at least 5 characters')
    .max(200, 'Grant title must be less than 200 characters')
    .regex(
      /^[a-zA-Z0-9\s\-:().,&]+$/,
      'Grant title contains invalid characters'
    ),
  grantNumberMaster: z
    .string()
    .min(3, 'Grant number must be at least 3 characters')
    .max(50, 'Grant number must be less than 50 characters')
    .regex(
      /^[A-Z0-9\-]+$/,
      'Grant number must contain only uppercase letters, numbers, and hyphens'
    ),
  agencyName: z
    .string()
    .min(2, 'Agency name must be at least 2 characters')
    .max(100, 'Agency name must be less than 100 characters'),
  principalInvestigatorId: z.string().cuid('Invalid Principal Investigator ID'),
  createdById: z.string().cuid('Invalid Creator ID'),
  startDate: z
    .date()
    .refine(
      date => date >= new Date('2020-01-01'),
      'Start date cannot be before 2020'
    )
    .refine(
      date => date <= new Date('2030-12-31'),
      'Start date cannot be after 2030'
    ),
  endDate: z
    .date()
    .refine(
      date => date >= new Date('2020-01-01'),
      'End date cannot be before 2020'
    )
    .refine(
      date => date <= new Date('2035-12-31'),
      'End date cannot be after 2035'
    ),
  totalYears: z
    .number()
    .int('Total years must be a whole number')
    .min(1, 'Grant must be at least 1 year')
    .max(5, 'Grant cannot exceed 5 years'),
  currentYearNumber: z
    .number()
    .int('Current year must be a whole number')
    .min(1, 'Current year must be at least 1')
    .max(5, 'Current year cannot exceed 5'),
  status: grantStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const grantSchema = baseGrantSchema
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  })
  .refine(data => data.currentYearNumber <= data.totalYears, {
    message: 'Current year cannot exceed total years',
    path: ['currentYearNumber'],
  });

export const createGrantSchema = baseGrantSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    currentYearNumber: true,
  })
  .extend({
    // Add optional description for grant creation
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional(),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const updateGrantSchema = baseGrantSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
});

// Grant Year validation schemas
export const grantYearStatusSchema = z.enum([
  'PLANNED',
  'ACTIVE',
  'COMPLETED',
  'CANCELLED',
]);

// Base grant year schema without refinements
const baseGrantYearSchema = z.object({
  id: z.string().cuid(),
  grantId: z.string().cuid('Invalid Grant ID'),
  yearNumber: z
    .number()
    .int('Year number must be a whole number')
    .min(1, 'Year number must be at least 1')
    .max(5, 'Year number cannot exceed 5'),
  awardAmount: z
    .number()
    .min(0, 'Award amount cannot be negative')
    .max(50000000, 'Award amount cannot exceed $50,000,000')
    .multipleOf(0.01, 'Award amount must be a valid currency amount'),
  startDate: z.date(),
  endDate: z.date(),
  status: grantYearStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const grantYearSchema = baseGrantYearSchema.refine(
  data => data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const createGrantYearSchema = baseGrantYearSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const updateGrantYearSchema = baseGrantYearSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  grantId: true,
});

// Budget Line Item validation schemas
export const budgetCategorySchema = z.enum([
  'PERSONNEL',
  'FRINGE_BENEFITS',
  'TRAVEL',
  'EQUIPMENT',
  'SUPPLIES',
  'CONTRACTUAL',
  'TOTAL_DIRECT_COSTS',
  'INDIRECT_COSTS',
  'OTHER',
]);

// Base budget line item schema without refinements
const baseBudgetLineItemSchema = z.object({
  id: z.string().cuid(),
  grantYearId: z.string().cuid('Invalid Grant Year ID'),
  category: budgetCategorySchema,
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description must be less than 500 characters'),
  budgetedAmount: z
    .number()
    .min(0, 'Budgeted amount cannot be negative')
    .max(10000000, 'Budgeted amount cannot exceed $10,000,000')
    .multipleOf(0.01, 'Budgeted amount must be a valid currency amount'),
  actualSpent: z
    .number()
    .min(0, 'Actual spent cannot be negative')
    .max(10000000, 'Actual spent cannot exceed $10,000,000')
    .multipleOf(0.01, 'Actual spent must be a valid currency amount'),
  encumberedAmount: z
    .number()
    .min(0, 'Encumbered amount cannot be negative')
    .max(10000000, 'Encumbered amount cannot exceed $10,000,000')
    .multipleOf(0.01, 'Encumbered amount must be a valid currency amount'),
  lastUpdatedById: z.string().cuid('Invalid User ID').optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const budgetLineItemSchema = baseBudgetLineItemSchema.refine(
  data => data.actualSpent + data.encumberedAmount <= data.budgetedAmount * 1.1,
  {
    message: 'Total spent and encumbered cannot exceed 110% of budgeted amount',
    path: ['actualSpent'],
  }
);

export const createBudgetLineItemSchema = baseBudgetLineItemSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    actualSpent: true,
    encumberedAmount: true,
  })
  .extend({
    actualSpent: z.number().min(0).multipleOf(0.01).default(0),
    encumberedAmount: z.number().min(0).multipleOf(0.01).default(0),
  })
  .refine(
    data =>
      data.actualSpent + data.encumberedAmount <= data.budgetedAmount * 1.1,
    {
      message:
        'Total spent and encumbered cannot exceed 110% of budgeted amount',
      path: ['actualSpent'],
    }
  );

export const updateBudgetLineItemSchema = baseBudgetLineItemSchema
  .partial()
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    grantYearId: true,
  });

// Document validation schemas
export const documentTypeSchema = z.enum([
  'PROPOSAL',
  'REPORT',
  'BUDGET',
  'CORRESPONDENCE',
  'CONTRACT',
  'INVOICE',
  'OTHER',
]);

export const documentSchema = z.object({
  id: z.string().cuid(),
  grantYearId: z.string().cuid('Invalid Grant Year ID'),
  fileName: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name must be less than 255 characters')
    .regex(/^[a-zA-Z0-9\s\-_.()]+\.[a-zA-Z0-9]+$/, 'Invalid file name format'),
  originalName: z
    .string()
    .min(1, 'Original name is required')
    .max(255, 'Original name must be less than 255 characters'),
  fileSize: z
    .number()
    .int('File size must be a whole number')
    .min(1, 'File size must be at least 1 byte')
    .max(100000000, 'File size cannot exceed 100MB'),
  mimeType: z
    .string()
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/,
      'Invalid MIME type'
    ),
  documentType: documentTypeSchema,
  uploadedById: z.string().cuid('Invalid User ID'),
  uploadedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createDocumentSchema = documentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  uploadedAt: true,
});

export const updateDocumentSchema = documentSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  grantYearId: true,
  uploadedById: true,
  uploadedAt: true,
});

// Task validation schemas
export const taskStatusSchema = z.enum([
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);
export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

// Base task schema without refinements
const baseTaskSchema = z.object({
  id: z.string().cuid(),
  grantYearId: z.string().cuid('Invalid Grant Year ID'),
  title: z
    .string()
    .min(5, 'Task title must be at least 5 characters')
    .max(200, 'Task title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Task description must be less than 1000 characters')
    .optional(),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  assignedToId: z.string().cuid('Invalid User ID').optional(),
  dueDate: z.date().optional(),
  completedAt: z.date().optional(),
  createdById: z.string().cuid('Invalid User ID'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const taskSchema = baseTaskSchema
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

export const createTaskSchema = baseTaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true,
});

export const updateTaskSchema = baseTaskSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  grantYearId: true,
  createdById: true,
});

// Search and filter schemas
export const searchGrantsSchema = z
  .object({
    search: z
      .string()
      .max(100, 'Search term must be less than 100 characters')
      .optional(),
    status: grantStatusSchema.optional(),
    agencyName: z
      .string()
      .max(100, 'Agency name must be less than 100 characters')
      .optional(),
    principalInvestigatorId: z.string().cuid('Invalid PI ID').optional(),
    startDateFrom: z.date().optional(),
    startDateTo: z.date().optional(),
    limit: z.number().int().min(1).max(100).default(50),
    cursor: z.string().cuid().optional(),
  })
  .refine(
    data => {
      if (data.startDateFrom && data.startDateTo) {
        return data.startDateTo >= data.startDateFrom;
      }
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['startDateTo'],
    }
  );

// File upload validation schemas
export const fileUploadSchema = z
  .object({
    file: z.instanceof(File, { message: 'File is required' }),
    documentType: documentTypeSchema,
    grantYearId: z.string().cuid('Invalid Grant Year ID'),
  })
  .refine(
    data => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/jpeg',
        'image/png',
      ];
      return allowedTypes.includes(data.file.type);
    },
    {
      message: 'File type not allowed',
      path: ['file'],
    }
  )
  .refine(
    data => {
      return data.file.size <= 50 * 1024 * 1024; // 50MB
    },
    {
      message: 'File size cannot exceed 50MB',
      path: ['file'],
    }
  );

// Bulk operation schemas
export const bulkUpdateGrantsSchema = z.object({
  grantIds: z
    .array(z.string().cuid())
    .min(1, 'At least one grant ID is required')
    .max(50, 'Cannot update more than 50 grants at once'),
  updates: updateGrantSchema,
});

export const bulkDeleteGrantsSchema = z.object({
  grantIds: z
    .array(z.string().cuid())
    .min(1, 'At least one grant ID is required')
    .max(20, 'Cannot delete more than 20 grants at once'),
});

// Export type inference helpers
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Grant = z.infer<typeof grantSchema>;
export type CreateGrant = z.infer<typeof createGrantSchema>;
export type UpdateGrant = z.infer<typeof updateGrantSchema>;

export type GrantYear = z.infer<typeof grantYearSchema>;
export type CreateGrantYear = z.infer<typeof createGrantYearSchema>;
export type UpdateGrantYear = z.infer<typeof updateGrantYearSchema>;

export type BudgetLineItem = z.infer<typeof budgetLineItemSchema>;
export type CreateBudgetLineItem = z.infer<typeof createBudgetLineItemSchema>;
export type UpdateBudgetLineItem = z.infer<typeof updateBudgetLineItemSchema>;

export type Document = z.infer<typeof documentSchema>;
export type CreateDocument = z.infer<typeof createDocumentSchema>;
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;

export type Task = z.infer<typeof taskSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export type SearchGrants = z.infer<typeof searchGrantsSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type BulkUpdateGrants = z.infer<typeof bulkUpdateGrantsSchema>;
export type BulkDeleteGrants = z.infer<typeof bulkDeleteGrantsSchema>;
