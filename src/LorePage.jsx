import { LORE } from './lore'
import PixelIcon from './PixelIcon'
import './LorePage.css'

export default function LorePage({ unlocked }) {
  const unlockedEntries = LORE
    .filter(e => unlocked.includes(e.id))
    .reverse()

  const total = LORE.length

  return (
    <div className="lore-page">
      <div className="lore-header">
        <PixelIcon id="book" size={24} />
        <div>
          <div className="lore-title">Journal du Singe</div>
          <div className="lore-subtitle">{unlockedEntries.length} / {total} entrées débloquées</div>
        </div>
      </div>

      {unlockedEntries.length === 0 ? (
        <div className="lore-empty">
          <PixelIcon id="banana" size={24} />
          <p>Accumule des bananes pour débloquer les premiers journaux.</p>
        </div>
      ) : (
        <div className="lore-entries">
          {unlockedEntries.map((entry, i) => (
            <div key={entry.id} className={`lore-entry ${i === 0 ? 'latest' : ''}`}>
              <div className="lore-day">{entry.day}</div>
              <p className="lore-text">{entry.text}</p>
            </div>
          ))}
        </div>
      )}

      {unlockedEntries.length < total && (
        <div className="lore-next">
          {(() => {
            const next = LORE.find(e => !unlocked.includes(e.id))
            if (!next) return null
            return <span>Prochaine entrée à {next.threshold >= 1e6
              ? (next.threshold / 1e6).toFixed(0) + 'M'
              : next.threshold >= 1e3
              ? (next.threshold / 1e3).toFixed(0) + 'k'
              : next.threshold} <PixelIcon id="banana" size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></span>
          })()}
        </div>
      )}
    </div>
  )
}
