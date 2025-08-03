import { z } from 'zod';
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

export const grantRouter = createTRPCRouter({
  // Get all grants with optional filtering
  getAll: publicProcedure
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
          principalInvestigator: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          grantYears: {
            take: 1,
            orderBy: { yearNumber: 'asc' },
            include: {
              budgetLineItems: {
                select: {
                  budgetedAmount: true,
                  actualSpent: true,
                  encumberedAmount: true,
                },
              },
            },
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

  // Get a specific grant by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const grant = await ctx.db.grant.findUnique({
        where: { id: input.id },
        include: {
          principalInvestigator: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          grantYears: {
            include: {
              budgetLineItems: {
                include: {
                  lastUpdatedByUser: {
                    select: {
                      fullName: true,
                    },
                  },
                },
                orderBy: { category: 'asc' },
              },
              documents: {
                include: {
                  uploadedBy: {
                    select: {
                      fullName: true,
                    },
                  },
                },
                orderBy: { uploadedAt: 'desc' },
              },
              tasks: {
                include: {
                  assignedTo: {
                    select: {
                      fullName: true,
                    },
                  },
                },
                orderBy: { dueDate: 'asc' },
              },
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

  // Create a new grant
  create: protectedProcedure
    .input(
      z.object({
        grantTitle: z.string().min(1, 'Grant title is required'),
        grantNumberMaster: z.string().min(1, 'Grant number is required'),
        agencyName: z.string().min(1, 'Agency name is required'),
        principalInvestigatorId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        totalYears: z.number().min(1).max(5),
        status: z
          .enum(['DRAFT', 'ACTIVE', 'CLOSED', 'NOT_AWARDED'])
          .default('DRAFT'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if grant number already exists
      const existingGrant = await ctx.db.grant.findUnique({
        where: { grantNumberMaster: input.grantNumberMaster },
      });

      if (existingGrant) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Grant number already exists',
        });
      }

      const grant = await ctx.db.grant.create({
        data: {
          ...input,
          createdById: ctx.userId,
        },
        include: {
          principalInvestigator: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      });

      return grant;
    }),

  // Update an existing grant
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        grantTitle: z.string().min(1).optional(),
        agencyName: z.string().min(1).optional(),
        principalInvestigatorId: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        totalYears: z.number().min(1).max(5).optional(),
        status: z.enum(['DRAFT', 'ACTIVE', 'CLOSED', 'NOT_AWARDED']).optional(),
        currentYearNumber: z.number().min(1).max(5).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const grant = await ctx.db.grant.update({
        where: { id },
        data: updateData,
        include: {
          principalInvestigator: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      });

      return grant;
    }),

  // Delete a grant
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.grant.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get grant statistics
  getStats: publicProcedure.query(async ({ ctx }) => {
    const [totalGrants, activeGrants, draftGrants, closedGrants] =
      await Promise.all([
        ctx.db.grant.count(),
        ctx.db.grant.count({ where: { status: 'ACTIVE' } }),
        ctx.db.grant.count({ where: { status: 'DRAFT' } }),
        ctx.db.grant.count({ where: { status: 'CLOSED' } }),
      ]);

    return {
      totalGrants,
      activeGrants,
      draftGrants,
      closedGrants,
    };
  }),
});
