import { Link } from 'react-router-dom'

export default function EmptyState({ emoji = '🐠', title, message, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-5xl mb-4" aria-hidden="true">{emoji}</div>
      <h2 className="font-display text-xl text-ink mb-2">{title}</h2>
      {message && <p className="text-ink/60 max-w-sm mb-6">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center rounded-full bg-lagoon px-6 py-3 text-white font-medium hover:bg-lagoon-dark transition-colors"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
