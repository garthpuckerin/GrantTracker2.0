import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { db } from '@/lib/db';

interface CreateContextOptions {
  userId?: string;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    db,
    userId: opts.userId,
  };
};

export const createTRPCContext = async () => {
  // For now, we'll use a mock user ID since auth is disabled
  // In production, this would come from the authenticated session
  const mockUserId = 'demo-user-id';

  return createInnerTRPCContext({
    userId: mockUserId,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// For demo purposes, we'll skip authentication middleware
// In production, this would verify the user session
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
