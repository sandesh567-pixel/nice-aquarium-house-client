import EmptyState from '../components/ui/EmptyState'

export default function NotFound() {
  return (
    <EmptyState
      emoji="🐠"
      title="Page not found"
      message="This page swam away. Let's get you back to the shop."
      actionLabel="Back to Home"
      actionTo="/"
    />
  )
}
