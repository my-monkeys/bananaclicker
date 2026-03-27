import { useState } from 'react'
import { ACHIEVEMENTS, CATEGORIES } from './achievements'
import PixelIcon from './PixelIcon'
import './AchievementsPage.css'

export default function AchievementsPage({ unlocked }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const unlockedSet = new Set(unlocked)
  const total = ACHIEVEMENTS.length
  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedSet.has(a.id)).length

  const filtered = ACHIEVEMENTS.filter(a =>
    activeCategory === 'all' || a.category === activeCategory
  )

  const filteredUnlocked = filtered.filter(a => unlockedSet.has(a.id)).length

  return (
    <div className="ach-page">
      <div className="ach-header">
        <div className="ach-progress-bar-wrap">
          <div
            className="ach-progress-bar-fill"
            style={{ width: `${(unlockedCount / total) * 100}%` }}
          />
        </div>
        <div className="ach-progress-label">
          {unlockedCount} / {total} succès débloqués
        </div>
      </div>

      <div className="ach-categories">
        {CATEGORIES.map(cat => {
          const catAchs = cat.id === 'all'
            ? ACHIEVEMENTS
            : ACHIEVEMENTS.filter(a => a.category === cat.id)
          const catUnlocked = catAchs.filter(a => unlockedSet.has(a.id)).length
          return (
            <button
              key={cat.id}
              className={`ach-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.pixelId && <PixelIcon id={cat.pixelId} size={14} />}
              <span>{cat.label}</span>
              <span className="ach-cat-count">{catUnlocked}/{catAchs.length}</span>
            </button>
          )
        })}
      </div>

      <div className="ach-section-count">
        {filteredUnlocked}/{filtered.length}
      </div>

      <div className="ach-grid">
        {filtered.map(ach => {
          const isUnlocked = unlockedSet.has(ach.id)
          const isSecret = ach.secret && !isUnlocked
          return (
            <div
              key={ach.id}
              className={`ach-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSecret ? 'secret' : ''}`}
            >
              <div className="ach-card-emoji">
                <PixelIcon
                  id={isSecret ? 'lock' : ach.pixelId}
                  size={26}
                  style={isUnlocked ? {} : { filter: 'grayscale(1)' }}
                />
              </div>
              <div className="ach-card-body">
                <div className="ach-card-name">
                  {isSecret ? '???' : ach.name}
                </div>
                <div className="ach-card-desc">
                  {isSecret
                    ? (ach.hint ?? 'Condition inconnue.')
                    : (isUnlocked ? ach.flavor : ach.description)
                  }
                </div>
              </div>
              {isUnlocked && <div className="ach-card-check">✓</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
