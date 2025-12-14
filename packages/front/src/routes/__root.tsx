import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { queryClient } from '../constants';
import { Notifications } from '@mantine/notifications';

const RootLayout = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <Notifications />
          <Outlet />
        </MantineProvider>
      </QueryClientProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
