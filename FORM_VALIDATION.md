# Form Validation System

Grant Tracker 2.0 includes a comprehensive form validation system built with Zod schemas, React Hook Form integration, and TypeScript for type safety. This document provides a complete guide to the validation system.

## Overview

The validation system provides:

- **Type-safe validation** with Zod schemas
- **Real-time form validation** with React Hook Form
- **Reusable form components** with consistent styling
- **Custom validation hooks** for business logic
- **Comprehensive error handling** with user-friendly messages
- **File upload validation** with size and type constraints
- **Cross-field validation** for complex business rules

## Architecture

### Core Components

```
src/
├── lib/
│   └── validations.ts          # Zod schemas and type definitions
├── hooks/
│   └── use-form-validation.ts  # Validation hooks and utilities
├── components/
│   └── forms/
│       ├── form-field.tsx      # Reusable form field component
│       ├── create-grant-form.tsx
│       ├── budget-line-item-form.tsx
│       └── search-grants-form.tsx
└── app/
    └── forms-demo/
        └── page.tsx            # Validation system demonstration
```

## Validation Schemas

### Grant Validation

```typescript
// Create Grant Schema
const createGrantSchema = baseGrantSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    currentYearNumber: true,
  })
  .extend({
    description: z.string().max(1000).optional(),
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });
```

**Validation Rules:**

- Grant title: 5-200 characters, alphanumeric with specific symbols
- Grant number: 3-50 characters, uppercase letters, numbers, hyphens
- Agency name: 2-100 characters
- Date range validation: End date must be after start date
- Total years: 1-5 years integer
- Status: Enum validation (DRAFT, ACTIVE, CLOSED, NOT_AWARDED)

### Budget Line Item Validation

```typescript
const budgetLineItemSchema = baseBudgetLineItemSchema.refine(
  data => data.actualSpent + data.encumberedAmount <= data.budgetedAmount * 1.1,
  {
    message: 'Total spent and encumbered cannot exceed 110% of budgeted amount',
    path: ['actualSpent'],
  }
);
```

**Validation Rules:**

- Currency amounts: Non-negative, max $10M, 2 decimal places
- Budget constraint: Spent + encumbered ≤ 110% of budgeted
- Category: Enum validation for budget categories
- Description: 5-500 characters required

### Search and Filter Validation

```typescript
const searchGrantsSchema = z
  .object({
    search: z.string().max(100).optional(),
    status: grantStatusSchema.optional(),
    startDateFrom: z.date().optional(),
    startDateTo: z.date().optional(),
    limit: z.number().int().min(1).max(100).default(50),
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
```

**Validation Rules:**

- Optional search parameters
- Date range validation
- Result limit: 1-100 items
- Cross-field date validation

## Form Components

### FormField Component

The `FormField` component provides a consistent interface for all form inputs:

```typescript
interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'textarea'
    | 'select';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}
```

**Features:**

- Automatic error display
- Consistent styling with Tailwind CSS
- Support for multiple input types
- Integration with React Hook Form
- Accessibility features

### Usage Example

```typescript
<FormProvider {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      name="grantTitle"
      label="Grant Title"
      placeholder="Enter the full grant title"
      required
    />
    <FormField
      name="status"
      label="Grant Status"
      type="select"
      options={statusOptions}
      required
    />
  </form>
</FormProvider>
```

## Validation Hooks

### useFormValidation Hook

The `useFormValidation` hook provides validation utilities:

```typescript
const validation = useFormValidation();

// Validate specific schemas
const result = validation.validateCreateGrant(data);

// Utility validations
const isValidEmail = validation.validateEmail(email);
const isValidCurrency = validation.validateCurrency(amount);
const isValidDateRange = validation.validateDateRange(start, end);

// Error handling
const error = validation.getFieldError(errors, 'fieldName');
const hasError = validation.hasFieldError(errors, 'fieldName');
```

**Available Validators:**

- `validateCreateGrant(data)` - Grant creation validation
- `validateUpdateGrant(data)` - Grant update validation
- `validateCreateBudgetLineItem(data)` - Budget item validation
- `validateSearchGrants(data)` - Search filter validation
- `validateFileUpload(data)` - File upload validation
- `validateEmail(email)` - Email format validation
- `validateCurrency(amount)` - Currency validation
- `validateDateRange(start, end)` - Date range validation

## Error Handling

### Validation Result Structure

```typescript
interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
}
```

### Error Display

Errors are automatically displayed in form fields:

```typescript
// Field-level error display
{hasError && (
  <p className="text-sm text-destructive">
    {error?.message as string}
  </p>
)}

// Form-level error summary
const errorCount = validation.getErrorCount(errors);
const errorSummary = validation.getErrorSummary(errors);
```

## File Upload Validation

### File Upload Schema

```typescript
const fileUploadSchema = z
  .object({
    file: z.instanceof(File, { message: 'File is required' }),
    documentType: documentTypeSchema,
    grantYearId: z.string().cuid(),
  })
  .refine(
    data => {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // ... more types
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
```

**File Validation Rules:**

- Maximum size: 50MB
- Allowed types: PDF, Word, Excel, images, text files
- Required document type classification
- Associated grant year validation

## Business Logic Validation

### Grant Number Pattern

```typescript
const validateGrantNumber = (grantNumber: string): boolean => {
  const grantNumberSchema = z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Z0-9\-]+$/);
  return grantNumberSchema.safeParse(grantNumber).success;
};
```

### Budget Constraints

```typescript
// Budget validation with 10% overage allowance
.refine((data) =>
  data.actualSpent + data.encumberedAmount <= data.budgetedAmount * 1.1,
  {
    message: 'Total spent and encumbered cannot exceed 110% of budgeted amount',
    path: ['actualSpent'],
  }
);
```

### Date Range Validation

```typescript
// Cross-field date validation
.refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});
```

## Integration with React Hook Form

### Form Setup

```typescript
const form = useForm<CreateGrant>({
  resolver: zodResolver(createGrantSchema),
  defaultValues: {
    grantTitle: '',
    status: 'DRAFT',
    // ... other defaults
  },
});
```

### Form Submission

```typescript
const onSubmit = async (data: CreateGrant) => {
  try {
    // Data is automatically validated by Zod resolver
    const result = await createGrant(data);
    form.reset();
    onSuccess(result);
  } catch (error) {
    // Handle submission errors
    console.error('Failed to create grant:', error);
  }
};
```

## Testing the Validation System

### Forms Demo Page

Visit `/forms-demo` to test the validation system:

1. **Grant Creation Form** - Test comprehensive validation
2. **Budget Line Item Form** - Test financial validation
3. **Search & Filter Form** - Test optional field validation

### Validation Features Demonstrated

- **Required field validation**
- **Format validation** (email, currency, dates)
- **Range validation** (min/max values)
- **Pattern validation** (regex patterns)
- **Cross-field validation** (date ranges, budget constraints)
- **File validation** (size, type)
- **Real-time feedback**
- **Error message display**

## Best Practices

### Schema Design

1. **Separate base schemas** from refined schemas for reusability
2. **Use descriptive error messages** for better UX
3. **Implement cross-field validation** for business rules
4. **Provide default values** where appropriate
5. **Use enums** for controlled vocabularies

### Form Implementation

1. **Use FormProvider** for form context
2. **Implement loading states** during submission
3. **Provide success feedback** after submission
4. **Handle errors gracefully** with user-friendly messages
5. **Reset forms** after successful submission

### Error Handling

1. **Display field-level errors** immediately
2. **Provide form-level error summaries** when needed
3. **Use consistent error styling** across the application
4. **Implement retry mechanisms** for failed submissions
5. **Log validation errors** for debugging

## Performance Considerations

### Validation Optimization

- **Lazy validation** - Only validate on form submission or field blur
- **Debounced validation** - Avoid excessive validation calls
- **Memoized schemas** - Cache compiled schemas for reuse
- **Selective validation** - Only validate changed fields when possible

### Bundle Size

- **Tree shaking** - Only import needed Zod validators
- **Code splitting** - Load validation schemas on demand
- **Minimal dependencies** - Use lightweight validation where possible

## Security Considerations

### Input Sanitization

- **Server-side validation** - Always validate on the server
- **SQL injection prevention** - Use parameterized queries
- **XSS prevention** - Sanitize user inputs
- **File upload security** - Validate file types and scan for malware

### Data Validation

- **Type safety** - Use TypeScript for compile-time checks
- **Runtime validation** - Use Zod for runtime type checking
- **Boundary validation** - Validate at API boundaries
- **Authorization checks** - Validate user permissions

## Troubleshooting

### Common Issues

1. **Schema compilation errors** - Check Zod schema syntax
2. **Type mismatches** - Ensure TypeScript types match Zod schemas
3. **Validation not triggering** - Check React Hook Form integration
4. **Error messages not displaying** - Verify FormField error handling
5. **Performance issues** - Review validation frequency and complexity

### Debugging Tips

1. **Use validation.validateData()** to test schemas directly
2. **Check browser console** for validation errors
3. **Use React DevTools** to inspect form state
4. **Test with invalid data** to verify error handling
5. **Review network requests** for server-side validation

## Future Enhancements

### Planned Features

- **Async validation** for server-side checks
- **Conditional validation** based on form state
- **Multi-step form validation** with progress tracking
- **Validation caching** for improved performance
- **Custom validation rules** for specific business logic

### Integration Opportunities

- **API validation** with tRPC integration
- **Database constraints** with Prisma validation
- **Real-time collaboration** with conflict resolution
- **Audit logging** for validation events
- **Internationalization** for error messages

This validation system provides a robust foundation for form handling in Grant Tracker 2.0, ensuring data integrity, user experience, and maintainability.
