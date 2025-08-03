import { createTRPCRouter } from '@/server/api/trpc';
import { grantRouter } from '@/server/api/routers/grant';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  grant: grantRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
