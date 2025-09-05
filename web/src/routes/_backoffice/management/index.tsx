import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_backoffice/management/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_backoffice/management/"!</div>
}
