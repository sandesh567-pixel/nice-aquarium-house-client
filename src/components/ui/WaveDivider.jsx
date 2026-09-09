// The recurring "waterline" motif: every major section boundary on the site
// resolves through this ripple, so scrolling the homepage feels like sinking
// a little deeper with each section — from the sunlit hero down to the
// footer's dark seabed.
export default function WaveDivider({ from = '#F5FAF9', to = '#0A2A33', flip = false }) {
  return (
    <div className={`relative h-10 sm:h-14 overflow-hidden ${flip ? 'rotate-180' : ''}`} style={{ backgroundColor: from }} aria-hidden="true">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-full w-full"
      >
        <path
          d="M0,40 C 240,80 480,0 720,30 C 960,60 1200,10 1440,40 L1440,80 L0,80 Z"
          fill={to}
        />
      </svg>
    </div>
  )
}
