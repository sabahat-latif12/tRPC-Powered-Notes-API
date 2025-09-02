import { router } from '../trpc';
import { notesRouter } from './notes';

// Create the root router
export const appRouter = router({
  notes: notesRouter,
});

// Export the router type
export type AppRouter = typeof appRouter; 