// Temporarily disabled Clerk middleware for development
// Uncomment and configure with real Clerk keys when ready

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/grant(.*)',
//   '/admin(.*)',
//   '/api/trpc(.*)',
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

// export const config = {
//   matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
// };

// For now, allow all requests through
export default function middleware() {
  // No authentication required for development
  return;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
