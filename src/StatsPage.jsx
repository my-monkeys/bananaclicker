import { useRef } from 'react'
import PixelIcon from './PixelIcon'
import './StatsPage.css'

function formatNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'Md'
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'k'
  return Math.floor(n).toString()
}

function formatTime(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${m}m ${sec}s`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

function BpsGraph({ data }) {
  if (!data || data.length < 2) {
    return <div className="graph-empty">Joue quelques minutes pour voir le graphe...</div>
  }
  const W = 300, H = 90, P = 6
  const maxBps = Math.max(...data.map(d => d.bps), 1)
  const pts = data.map((d, i) => {
    const x = P + (i / (data.length - 1)) * (W - P * 2)
    const y = H - P - (d.bps / maxBps) * (H - P * 2)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })
  const ptsStr = pts.join(' ')
  const fillStr = `${P},${H - P} ${ptsStr} ${(W - P).toFixed(1)},${H - P}`

  return (
    <div className="graph-wrap">
      <div className="graph-header">
        <span className="graph-label">Bananes/s — 10 dernières minutes</span>
        <span className="graph-max">{formatNumber(maxBps)}/s</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="graph-svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bpsGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#ffd700" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={fillStr} fill="url(#bpsGrad)" />
        <polyline points={ptsStr} fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinejoin="round" />
        {pts.length > 0 && (() => {
          const last = pts[pts.length - 1].split(',')
          return <circle cx={last[0]} cy={last[1]} r="3" fill="#ffd700" />
        })()}
      </svg>
    </div>
  )
}

export default function StatsPage({
  totalBananas, effectiveClick, effectivePassive,
  totalClicks, totalUpgradesBought, timePlayed,
  goldenClicked, eventsEncountered, prestigeLevel,
  prestigeMult, unlockedAchs, totalAchs, bpsHistory,
  onExport, onImport,
}) {
  const importRef = useRef(null)

  const stats = [
    { pixelId: 'timer',    label: 'Temps de jeu',           value: formatTime(timePlayed) },
    { pixelId: 'banana',   label: 'Bananes totales',         value: formatNumber(totalBananas) },
    { pixelId: 'lightning',label: 'Bananes / seconde',       value: formatNumber(effectivePassive) },
    { pixelId: 'pointup',  label: 'Puissance de clic',       value: '+' + formatNumber(effectiveClick) },
    { pixelId: 'mouse',    label: 'Clics totaux',            value: formatNumber(totalClicks) },
    { pixelId: 'cart',     label: 'Améliorations achetées',  value: formatNumber(totalUpgradesBought) },
    { pixelId: 'star',     label: 'Bananes dorées cliquées', value: formatNumber(goldenClicked) },
    { pixelId: 'dice',     label: 'Événements vécus',        value: formatNumber(eventsEncountered) },
    { pixelId: 'trophy',   label: 'Succès débloqués',        value: `${unlockedAchs.length} / ${totalAchs}` },
    { pixelId: 'recycle',  label: 'Niveau de prestige',      value: prestigeLevel },
    { pixelId: 'chart',    label: 'Multiplicateur',          value: '×' + prestigeMult.toFixed(2) },
  ]

  return (
    <div className="stats-page">
      <BpsGraph data={bpsHistory} />

      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-emoji">
              <PixelIcon id={s.pixelId} size={20} />
            </div>
            <div className="stat-body">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="save-tools">
        <div className="save-tools-title">Sauvegarde</div>
        <div className="save-tools-btns">
          <button className="save-btn export-btn" onClick={onExport}>
            Exporter
          </button>
          <button className="save-btn import-btn" onClick={() => importRef.current?.click()}>
            Importer
          </button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            onChange={onImport}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}
