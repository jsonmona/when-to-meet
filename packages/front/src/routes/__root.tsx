import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { MantineProvider } from '@mantine/core';

const RootLayout = () => {
  return (
    <>
      <MantineProvider>
        <Outlet />
      </MantineProvider>
      <TanStackRouterDevtools />
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
