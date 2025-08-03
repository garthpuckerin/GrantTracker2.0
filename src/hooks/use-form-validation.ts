'use client';

import { useCallback } from 'react';
import { z } from 'zod';
import {
  createGrantSchema,
  updateGrantSchema,
  createGrantYearSchema,
  updateGrantYearSchema,
  createBudgetLineItemSchema,
  updateBudgetLineItemSchema,
  createDocumentSchema,
  updateDocumentSchema,
  createTaskSchema,
  updateTaskSchema,
  searchGrantsSchema,
  fileUploadSchema,
  bulkUpdateGrantsSchema,
  bulkDeleteGrantsSchema,
  type CreateGrant,
  type UpdateGrant,
  type CreateGrantYear,
  type UpdateGrantYear,
  type CreateBudgetLineItem,
  type UpdateBudgetLineItem,
  type CreateDocument,
  type UpdateDocument,
  type CreateTask,
  type UpdateTask,
  type SearchGrants,
  type FileUpload,
  type BulkUpdateGrants,
  type BulkDeleteGrants,
} from '@/lib/validations';

// Validation result type
export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
}

// Form validation hook
export function useFormValidation() {
  // Generic validation function
  const validateData = useCallback(
    <T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> => {
      try {
        const result = schema.safeParse(data);

        if (result.success) {
          return {
            success: true,
            data: result.data,
          };
        } else {
          const errors: Record<string, string[]> = {};

          result.error.errors.forEach(error => {
            const path = error.path.join('.');
            if (!errors[path]) {
              errors[path] = [];
            }
            errors[path].push(error.message);
          });

          return {
            success: false,
            errors,
            message: 'Validation failed',
          };
        }
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error ? error.message : 'Unknown validation error',
        };
      }
    },
    []
  );

  // Specific validation functions for each schema
  const validateCreateGrant = useCallback(
    (data: unknown): ValidationResult<CreateGrant> => {
      return validateData(createGrantSchema, data);
    },
    [validateData]
  );

  const validateUpdateGrant = useCallback(
    (data: unknown): ValidationResult<UpdateGrant> => {
      return validateData(updateGrantSchema, data);
    },
    [validateData]
  );

  const validateCreateGrantYear = useCallback(
    (data: unknown): ValidationResult<CreateGrantYear> => {
      return validateData(createGrantYearSchema, data);
    },
    [validateData]
  );

  const validateUpdateGrantYear = useCallback(
    (data: unknown): ValidationResult<UpdateGrantYear> => {
      return validateData(updateGrantYearSchema, data);
    },
    [validateData]
  );

  const validateCreateBudgetLineItem = useCallback(
    (data: unknown) => {
      return validateData(createBudgetLineItemSchema, data);
    },
    [validateData]
  );

  const validateUpdateBudgetLineItem = useCallback(
    (data: unknown): ValidationResult<UpdateBudgetLineItem> => {
      return validateData(updateBudgetLineItemSchema, data);
    },
    [validateData]
  );

  const validateCreateDocument = useCallback(
    (data: unknown): ValidationResult<CreateDocument> => {
      return validateData(createDocumentSchema, data);
    },
    [validateData]
  );

  const validateUpdateDocument = useCallback(
    (data: unknown): ValidationResult<UpdateDocument> => {
      return validateData(updateDocumentSchema, data);
    },
    [validateData]
  );

  const validateCreateTask = useCallback(
    (data: unknown): ValidationResult<CreateTask> => {
      return validateData(createTaskSchema, data);
    },
    [validateData]
  );

  const validateUpdateTask = useCallback(
    (data: unknown): ValidationResult<UpdateTask> => {
      return validateData(updateTaskSchema, data);
    },
    [validateData]
  );

  const validateSearchGrants = useCallback(
    (data: unknown) => {
      return validateData(searchGrantsSchema, data);
    },
    [validateData]
  );

  const validateFileUpload = useCallback(
    (data: unknown): ValidationResult<FileUpload> => {
      return validateData(fileUploadSchema, data);
    },
    [validateData]
  );

  const validateBulkUpdateGrants = useCallback(
    (data: unknown): ValidationResult<BulkUpdateGrants> => {
      return validateData(bulkUpdateGrantsSchema, data);
    },
    [validateData]
  );

  const validateBulkDeleteGrants = useCallback(
    (data: unknown): ValidationResult<BulkDeleteGrants> => {
      return validateData(bulkDeleteGrantsSchema, data);
    },
    [validateData]
  );

  // Utility functions for common validation scenarios
  const validateEmail = useCallback((email: string): boolean => {
    const emailSchema = z.string().email();
    return emailSchema.safeParse(email).success;
  }, []);

  const validateCurrency = useCallback((amount: number): boolean => {
    const currencySchema = z.number().min(0).multipleOf(0.01);
    return currencySchema.safeParse(amount).success;
  }, []);

  const validateDateRange = useCallback(
    (startDate: Date, endDate: Date): boolean => {
      return endDate > startDate;
    },
    []
  );

  const validateGrantNumber = useCallback((grantNumber: string): boolean => {
    const grantNumberSchema = z
      .string()
      .min(3)
      .max(50)
      .regex(/^[A-Z0-9\-]+$/);
    return grantNumberSchema.safeParse(grantNumber).success;
  }, []);

  const validateFileSize = useCallback(
    (file: File, maxSizeMB: number = 50): boolean => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return file.size <= maxSizeBytes;
    },
    []
  );

  const validateFileType = useCallback(
    (file: File, allowedTypes: string[]): boolean => {
      return allowedTypes.includes(file.type);
    },
    []
  );

  // Form field validation helpers
  const getFieldError = useCallback(
    (
      errors: Record<string, string[]> | undefined,
      fieldName: string
    ): string | undefined => {
      return errors?.[fieldName]?.[0];
    },
    []
  );

  const hasFieldError = useCallback(
    (
      errors: Record<string, string[]> | undefined,
      fieldName: string
    ): boolean => {
      return !!errors?.[fieldName]?.length;
    },
    []
  );

  const getAllFieldErrors = useCallback(
    (
      errors: Record<string, string[]> | undefined,
      fieldName: string
    ): string[] => {
      return errors?.[fieldName] || [];
    },
    []
  );

  // Validation summary helpers
  const getErrorCount = useCallback(
    (errors: Record<string, string[]> | undefined): number => {
      if (!errors) return 0;
      return Object.values(errors).reduce(
        (count, fieldErrors) => count + fieldErrors.length,
        0
      );
    },
    []
  );

  const getErrorSummary = useCallback(
    (errors: Record<string, string[]> | undefined): string[] => {
      if (!errors) return [];
      return Object.values(errors).flat();
    },
    []
  );

  return {
    // Generic validation
    validateData,

    // Specific schema validations
    validateCreateGrant,
    validateUpdateGrant,
    validateCreateGrantYear,
    validateUpdateGrantYear,
    validateCreateBudgetLineItem,
    validateUpdateBudgetLineItem,
    validateCreateDocument,
    validateUpdateDocument,
    validateCreateTask,
    validateUpdateTask,
    validateSearchGrants,
    validateFileUpload,
    validateBulkUpdateGrants,
    validateBulkDeleteGrants,

    // Utility validations
    validateEmail,
    validateCurrency,
    validateDateRange,
    validateGrantNumber,
    validateFileSize,
    validateFileType,

    // Error handling helpers
    getFieldError,
    hasFieldError,
    getAllFieldErrors,
    getErrorCount,
    getErrorSummary,
  };
}

// Export validation schemas for direct use
export {
  createGrantSchema,
  updateGrantSchema,
  createGrantYearSchema,
  updateGrantYearSchema,
  createBudgetLineItemSchema,
  updateBudgetLineItemSchema,
  createDocumentSchema,
  updateDocumentSchema,
  createTaskSchema,
  updateTaskSchema,
  searchGrantsSchema,
  fileUploadSchema,
  bulkUpdateGrantsSchema,
  bulkDeleteGrantsSchema,
};

// Export types
export type {
  CreateGrant,
  UpdateGrant,
  CreateGrantYear,
  UpdateGrantYear,
  CreateBudgetLineItem,
  UpdateBudgetLineItem,
  CreateDocument,
  UpdateDocument,
  CreateTask,
  UpdateTask,
  SearchGrants,
  FileUpload,
  BulkUpdateGrants,
  BulkDeleteGrants,
};
