import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/appointment/$key')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/appointment/$key"!</div>;
}
