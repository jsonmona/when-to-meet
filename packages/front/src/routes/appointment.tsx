import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { NavLinkList } from '../components/NavLinkList';

export const Route = createFileRoute('/appointment')({
  component: RouteComponent,
});

function RouteComponent() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      header={{ height: 40 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header className="flex">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />

        <div className="text-2xl font-bold ml-4 select-none">
          언제만나? - 약속 잡기 서비스
        </div>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavLinkList />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
