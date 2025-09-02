import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create tRPC context
export const createContext = () => ({
  prisma,
});

// Create tRPC instance
const t = initTRPC.context<typeof createContext>().create();

// Export reusable router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure; 