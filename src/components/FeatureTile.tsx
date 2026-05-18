import { Link } from 'react-router-dom'

type Props = {
  to: string
  icon: string
  title: string
  description: string
  accent?: 'teal' | 'indigo' | 'amber' | 'rose' | 'violet' | 'sky' | 'emerald'
}

export function FeatureTile({ to, icon, title, description, accent = 'teal' }: Props) {
  return (
    <Link className={`card tile tile-${accent}`} to={to}>
      <span className="tile-icon" aria-hidden>
        {icon}
      </span>
      <h3>{title}</h3>
      <p className="muted">{description}</p>
      <span className="tile-cta">Open →</span>
    </Link>
  )
}
