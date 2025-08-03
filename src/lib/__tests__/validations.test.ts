import {
  createGrantSchema,
  createBudgetLineItemSchema,
  createTaskSchema,
  searchGrantsSchema,
} from '../validations';

describe('Validation Schemas', () => {
  describe('createGrantSchema', () => {
    const validGrantData = {
      grantTitle: 'Test Grant for STEM Education',
      grantNumberMaster: 'TEST-2024-001',
      agencyName: 'National Science Foundation',
      principalInvestigatorId: 'clh1234567890abcdefghijklmnop',
      createdById: 'clh1234567890abcdefghijklmnop',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      totalYears: 3,
      status: 'DRAFT' as const,
    };

    it('validates correct grant data', () => {
      const result = createGrantSchema.safeParse(validGrantData);
      expect(result.success).toBe(true);
    });

    it('rejects grant with invalid title length', () => {
      const invalidData = { ...validGrantData, grantTitle: 'Too' };
      const result = createGrantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at least 5 characters'
        );
      }
    });

    it('rejects grant with invalid grant number format', () => {
      const invalidData = {
        ...validGrantData,
        grantNumberMaster: 'invalid-format',
      };
      const result = createGrantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'uppercase letters, numbers, and hyphens'
        );
      }
    });

    it('rejects grant with end date before start date', () => {
      const invalidData = {
        ...validGrantData,
        startDate: new Date('2024-12-31'),
        endDate: new Date('2024-01-01'),
      };
      const result = createGrantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'End date must be after start date'
        );
      }
    });

    it('rejects grant with invalid total years', () => {
      const invalidData = { ...validGrantData, totalYears: 10 };
      const result = createGrantSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'cannot exceed 5 years'
        );
      }
    });
  });

  describe('createBudgetLineItemSchema', () => {
    const validBudgetData = {
      grantYearId: 'clh1234567890abcdefghijklmnop',
      category: 'PERSONNEL' as const,
      description: 'Faculty salaries and graduate student stipends',
      budgetedAmount: 100000,
      actualSpent: 25000,
      encumberedAmount: 15000,
      lastUpdatedById: 'clh1234567890abcdefghijklmnop',
    };

    it('validates correct budget line item data', () => {
      const result = createBudgetLineItemSchema.safeParse(validBudgetData);
      expect(result.success).toBe(true);
    });

    it('rejects budget item with negative amounts', () => {
      const invalidData = { ...validBudgetData, budgetedAmount: -1000 };
      const result = createBudgetLineItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('cannot be negative');
      }
    });

    it('rejects budget item with excessive spending', () => {
      const invalidData = {
        ...validBudgetData,
        budgetedAmount: 100000,
        actualSpent: 80000,
        encumberedAmount: 40000, // Total 120000 > 110% of 100000
      };
      const result = createBudgetLineItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('cannot exceed 110%');
      }
    });

    it('rejects budget item with short description', () => {
      const invalidData = { ...validBudgetData, description: 'Too' };
      const result = createBudgetLineItemSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at least 5 characters'
        );
      }
    });
  });

  describe('createTaskSchema', () => {
    const validTaskData = {
      grantYearId: 'clh1234567890abcdefghijklmnop',
      title: 'Submit quarterly progress report',
      description: 'Prepare and submit the Q1 progress report',
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      assignedToId: 'clh1234567890abcdefghijklmnop',
      dueDate: new Date('2024-06-01'),
      createdById: 'clh1234567890abcdefghijklmnop',
    };

    it('validates correct task data', () => {
      const result = createTaskSchema.safeParse(validTaskData);
      expect(result.success).toBe(true);
    });

    it('rejects task with short title', () => {
      const invalidData = { ...validTaskData, title: 'Too' };
      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'at least 5 characters'
        );
      }
    });

    it('rejects task with long description', () => {
      const invalidData = { ...validTaskData, description: 'x'.repeat(1001) };
      const result = createTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'less than 1000 characters'
        );
      }
    });

    it('accepts task without optional fields', () => {
      const minimalData = {
        grantYearId: 'clh1234567890abcdefghijklmnop',
        title: 'Simple task title',
        status: 'PENDING' as const,
        priority: 'MEDIUM' as const,
        createdById: 'clh1234567890abcdefghijklmnop',
      };
      const result = createTaskSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });

  describe('searchGrantsSchema', () => {
    it('validates search with all optional fields', () => {
      const searchData = {
        search: 'STEM education',
        status: 'ACTIVE' as const,
        agencyName: 'NSF',
        principalInvestigatorId: 'clh1234567890abcdefghijklmnop',
        startDateFrom: new Date('2024-01-01'),
        startDateTo: new Date('2024-12-31'),
        limit: 25,
      };
      const result = searchGrantsSchema.safeParse(searchData);
      expect(result.success).toBe(true);
    });

    it('validates empty search object', () => {
      const result = searchGrantsSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(50); // Default value
      }
    });

    it('rejects search with invalid date range', () => {
      const invalidData = {
        startDateFrom: new Date('2024-12-31'),
        startDateTo: new Date('2024-01-01'),
      };
      const result = searchGrantsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'End date must be after start date'
        );
      }
    });

    it('rejects search with excessive limit', () => {
      const invalidData = { limit: 150 };
      const result = searchGrantsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'less than or equal to 100'
        );
      }
    });

    it('rejects search with long search term', () => {
      const invalidData = { search: 'x'.repeat(101) };
      const result = searchGrantsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          'less than 100 characters'
        );
      }
    });
  });
});
