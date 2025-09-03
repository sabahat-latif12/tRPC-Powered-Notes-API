import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../src/routers';

export const trpc = createTRPCReact<AppRouter>();

export function createClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3001/trpc',
      }),
    ],
  });
}
