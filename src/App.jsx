import { useState, useEffect, useCallback, useRef } from 'react'
import AchievementsPage from './AchievementsPage'
import StatsPage from './StatsPage'
import SkinsPage from './SkinsPage'
import LorePage from './LorePage'
import { ACHIEVEMENTS } from './achievements'
import { SKINS } from './skins'
import { LORE } from './lore'
import PixelIcon from './PixelIcon'
import './App.css'

// ── Constants ────────────────────────────────────────────────────────────────

const SAVE_KEY = 'bananaclicker_save'

const UPGRADES = [
  { id: 'finger',        name: 'Doigt plus agile',  description: '+1 banane par clic',  baseCost: 10,    costMult: 1.5, effect: { type: 'click',   value: 1   }, pixelId: 'pointup'  },
  { id: 'baby_monkey',   name: 'Bébé singe',         description: '0.1 banane/s',        baseCost: 15,    costMult: 1.6, effect: { type: 'passive', value: 0.1 }, pixelId: 'monkey'   },
  { id: 'banana_tree',   name: 'Bananier',            description: '0.5 banane/s',        baseCost: 100,   costMult: 1.7, effect: { type: 'passive', value: 0.5 }, pixelId: 'tree'     },
  { id: 'monkey_gang',   name: 'Gang de singes',      description: '2 bananes/s',         baseCost: 500,   costMult: 1.8, effect: { type: 'passive', value: 2   }, pixelId: 'muscle'   },
  { id: 'banana_farm',   name: 'Bananeraie',          description: '10 bananes/s',        baseCost: 2000,  costMult: 1.9, effect: { type: 'passive', value: 10  }, pixelId: 'factory'  },
  { id: 'golden_banana', name: 'Banane dorée',        description: '50 bananes/s',        baseCost: 10000, costMult: 2.0, effect: { type: 'passive', value: 50  }, pixelId: 'glowstar' },
  { id: 'banana_god',    name: 'Dieu Banane',         description: '200 bananes/s',       baseCost: 50000, costMult: 2.2, effect: { type: 'passive', value: 200 }, pixelId: 'crown'    },
]

const RANDOM_EVENTS = [
  { id: 'banana_rain',    name: 'Pluie de bananes !', pixelId: 'rain',      desc: 'Clics ×5 pendant 20s',    duration: 20, clickMult: 5, passiveMult: 1, color: '#ffd700' },
  { id: 'double_passive', name: 'Double récolte',     pixelId: 'lightning', desc: 'Passif ×3 pendant 30s',   duration: 30, clickMult: 1, passiveMult: 3, color: '#8fbe4a' },
  { id: 'monkey_thief',   name: 'Singe voleur !',     pixelId: 'smirk',     desc: 'Il t\'a volé 8% de tes bananes', duration: 4, clickMult: 1, passiveMult: 1, steal: 0.08, color: '#ff5555' },
  { id: 'banana_party',   name: 'Fête des singes !',  pixelId: 'trophy',    desc: 'Tout ×4 pendant 15s',     duration: 15, clickMult: 4, passiveMult: 4, color: '#ff8c00' },
]

const DEFAULT_COUNTS = Object.fromEntries(UPGRADES.map(u => [u.id, 0]))

// ── Load save & offline gain ──────────────────────────────────────────────────

const _raw = (() => {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null') }
  catch { return null }
})()

const INITIAL = {
  bananas:             _raw?.bananas             ?? 0,
  totalBananas:        _raw?.totalBananas        ?? 0,
  clickPower:          _raw?.clickPower          ?? 1,
  passive:             _raw?.passive             ?? 0,
  upgradeCounts:       _raw?.upgradeCounts       ?? { ...DEFAULT_COUNTS },
  totalClicks:         _raw?.totalClicks         ?? 0,
  totalUpgradesBought: _raw?.totalUpgradesBought ?? 0,
  wentBroke:           _raw?.wentBroke           ?? false,
  frenzy:              _raw?.frenzy              ?? false,
  unlockedAchs:        _raw?.unlockedAchs        ?? [],
  prestigeLevel:       _raw?.prestigeLevel       ?? 0,
  ownedSkins:          _raw?.ownedSkins          ?? ['normal'],
  equippedSkin:        _raw?.equippedSkin        ?? 'normal',
  timePlayed:          _raw?.timePlayed          ?? 0,
  goldenClicked:       _raw?.goldenClicked       ?? 0,
  eventsEncountered:   _raw?.eventsEncountered   ?? 0,
  // Absurd achievement flags
  hitFortytwo:         _raw?.hitFortytwo         ?? false,
  hitSixtynine:        _raw?.hitSixtynine        ?? false,
  hitLeet:             _raw?.hitLeet             ?? false,
  hitPalindrome:       _raw?.hitPalindrome       ?? false,
  midnight:            _raw?.midnight            ?? false,
  goldenExpired:       _raw?.goldenExpired       ?? false,
  // Lore
  unlockedLore:        _raw?.unlockedLore        ?? [],
}

const OFFLINE_GAIN = (() => {
  if (!_raw?.savedAt || !(_raw?.passive > 0)) return 0
  const elapsed = Math.min((Date.now() - _raw.savedAt) / 1000, 8 * 3600)
  const pMult = 1 + INITIAL.prestigeLevel * 0.25
  return INITIAL.passive * pMult * elapsed
})()

// ── Helpers ───────────────────────────────────────────────────────────────────

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
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${sec}s`
  return `${sec}s`
}

function getCost(upgrade, count) {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMult, count))
}

function getMilestoneBadge(count) {
  if (count >= 50) return 3
  if (count >= 25) return 2
  if (count >= 10) return 1
  return 0
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function App() {
  // Core game state
  const [bananas,             setBananas]             = useState(INITIAL.bananas + OFFLINE_GAIN)
  const [totalBananas,        setTotalBananas]        = useState(INITIAL.totalBananas + OFFLINE_GAIN)
  const [clickPower,          setClickPower]          = useState(INITIAL.clickPower)
  const [passive,             setPassive]             = useState(INITIAL.passive)
  const [upgradeCounts,       setUpgradeCounts]       = useState(INITIAL.upgradeCounts)
  const [totalClicks,         setTotalClicks]         = useState(INITIAL.totalClicks)
  const [totalUpgradesBought, setTotalUpgradesBought] = useState(INITIAL.totalUpgradesBought)
  const [wentBroke,           setWentBroke]           = useState(INITIAL.wentBroke)
  const [frenzy,              setFrenzy]              = useState(INITIAL.frenzy)
  const [unlockedAchs,        setUnlockedAchs]        = useState(INITIAL.unlockedAchs)

  // Prestige
  const [prestigeLevel,     setPrestigeLevel]     = useState(INITIAL.prestigeLevel)
  const [showPrestigeModal, setShowPrestigeModal] = useState(false)

  // Cosmetics
  const [ownedSkins,   setOwnedSkins]   = useState(INITIAL.ownedSkins)
  const [equippedSkin, setEquippedSkin] = useState(INITIAL.equippedSkin)

  // Events & golden banana
  const [activeEvent,  setActiveEvent]  = useState(null)
  const [goldenBanana, setGoldenBanana] = useState(null)

  // Stats
  const [timePlayed,         setTimePlayed]         = useState(INITIAL.timePlayed)
  const [goldenClicked,      setGoldenClicked]      = useState(INITIAL.goldenClicked)
  const [eventsEncountered,  setEventsEncountered]  = useState(INITIAL.eventsEncountered)
  const [idleSeconds,        setIdleSeconds]        = useState(0)

  // Absurd achievement flags
  const [hitFortytwo,  setHitFortytwo]  = useState(INITIAL.hitFortytwo)
  const [hitSixtynine, setHitSixtynine] = useState(INITIAL.hitSixtynine)
  const [hitLeet,      setHitLeet]      = useState(INITIAL.hitLeet)
  const [hitPalindrome,setHitPalindrome]= useState(INITIAL.hitPalindrome)
  const [midnight,     setMidnight]     = useState(INITIAL.midnight)
  const [goldenExpired,setGoldenExpired]= useState(INITIAL.goldenExpired)

  // Lore
  const [unlockedLore, setUnlockedLore] = useState(INITIAL.unlockedLore)

  // Particles
  const [particles, setParticles] = useState([])

  // BPS graph history
  const [bpsHistory,  setBpsHistory]  = useState([])

  // UI
  const [floaties,          setFloaties]          = useState([])
  const [monkeyBounce,      setMonkeyBounce]      = useState(false)
  const [shake,             setShake]             = useState(false)
  const [achToast,          setAchToast]          = useState(null)
  const [loreToast,         setLoreToast]         = useState(null)
  const [activeTab,         setActiveTab]         = useState('upgrades')
  const [showResetModal,    setShowResetModal]    = useState(false)
  const [offlineToast,      setOfflineToast]      = useState(OFFLINE_GAIN > 10 ? OFFLINE_GAIN : null)
  const [tick,              setTick]              = useState(0)

  // Refs
  const effectivePassiveRef = useRef(0)
  const effectiveClickRef   = useRef(INITIAL.clickPower)
  const achToastQueue       = useRef([])
  const showingToast        = useRef(false)
  const clickTimestamps     = useRef([])
  const lastActionRef       = useRef(Date.now())
  const saveTimer           = useRef(null)
  const goldenTimerRef      = useRef(null)
  const eventTimerRef       = useRef(null)
  const gameStateRef        = useRef({})
  const goldenBananaRef     = useRef(null)
  const bananasRef          = useRef(INITIAL.bananas + OFFLINE_GAIN)
  const timePlayedRef       = useRef(INITIAL.timePlayed)
  const bpsHistoryRef       = useRef([])

  // ── Computed ────────────────────────────────────────────────

  const prestigeMult     = 1 + prestigeLevel * 0.25
  const eventClickMult   = activeEvent?.clickMult  ?? 1
  const eventPassiveMult = activeEvent?.passiveMult ?? 1
  const effectiveClick   = clickPower * prestigeMult * eventClickMult
  const effectivePassive = passive    * prestigeMult * eventPassiveMult
  const prestigeThreshold = 1e6 * Math.pow(2, prestigeLevel)
  const canPrestige       = totalBananas >= prestigeThreshold
  const currentSkin = SKINS.find(s => s.id === equippedSkin) ?? SKINS[0]

  effectivePassiveRef.current = effectivePassive
  effectiveClickRef.current   = effectiveClick
  bananasRef.current          = bananas
  goldenBananaRef.current     = goldenBanana

  // Keep gameStateRef in sync for beforeunload
  gameStateRef.current = {
    bananas, totalBananas, clickPower, passive, upgradeCounts,
    totalClicks, totalUpgradesBought, wentBroke, frenzy, unlockedAchs,
    prestigeLevel, ownedSkins, equippedSkin, timePlayed, goldenClicked, eventsEncountered,
    hitFortytwo, hitSixtynine, hitLeet, hitPalindrome, midnight, goldenExpired, unlockedLore,
  }

  // ── Effects ─────────────────────────────────────────────────

  // Dismiss offline toast
  useEffect(() => {
    if (!offlineToast) return
    const id = setTimeout(() => setOfflineToast(null), 5000)
    return () => clearTimeout(id)
  }, [offlineToast])

  // Passive income (100ms tick)
  useEffect(() => {
    if (passive === 0) return
    const id = setInterval(() => {
      const gain = effectivePassiveRef.current / 10
      setBananas(b => b + gain)
      setTotalBananas(t => t + gain)
    }, 100)
    return () => clearInterval(id)
  }, [passive, prestigeLevel, activeEvent])

  // 1s heartbeat
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now()

      // Time & idle
      timePlayedRef.current += 1
      setTimePlayed(timePlayedRef.current)
      setIdleSeconds(Math.floor((now - lastActionRef.current) / 1000))
      setTick(t => t + 1)

      // BPS graph — record every 10s
      if (timePlayedRef.current % 10 === 0) {
        const entry = { t: timePlayedRef.current, bps: effectivePassiveRef.current }
        bpsHistoryRef.current = [...bpsHistoryRef.current.slice(-59), entry]
        setBpsHistory([...bpsHistoryRef.current])
      }

      // Midnight detection
      const d = new Date(now)
      if (d.getHours() === 0 && d.getMinutes() === 0) setMidnight(true)

      // Special number checks on current banana count
      const n = Math.floor(bananasRef.current)
      if (n === 42)   setHitFortytwo(true)
      if (n === 69)   setHitSixtynine(true)
      if (n === 1337) setHitLeet(true)
      const ns = n.toString()
      if (ns.length >= 3 && ns === ns.split('').reverse().join('')) setHitPalindrome(true)

      // Golden banana expiry
      const gb = goldenBananaRef.current
      if (gb && now >= gb.endTime) {
        setGoldenBanana(null)
        setGoldenExpired(true)
        scheduleGoldenBanana()
      }

      setActiveEvent(ev => {
        if (ev && ev.endTime && now >= ev.endTime) return null
        return ev
      })
    }, 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Golden banana scheduling
  const scheduleGoldenBanana = useCallback(() => {
    clearTimeout(goldenTimerRef.current)
    const delay = (2 + Math.random() * 3) * 60 * 1000
    goldenTimerRef.current = setTimeout(() => {
      const margin = 120
      const x = margin + Math.random() * (window.innerWidth  - margin * 2)
      const y = margin + Math.random() * (window.innerHeight - margin * 2)
      setGoldenBanana({ x, y, endTime: Date.now() + 10000 })
    }, delay)
  }, [])

  useEffect(() => {
    scheduleGoldenBanana()
    return () => clearTimeout(goldenTimerRef.current)
  }, [scheduleGoldenBanana])

  // Event scheduling — use a stable ref to avoid stale closure on self-call
  const scheduleNextEventRef = useRef(null)
  scheduleNextEventRef.current = () => {
    clearTimeout(eventTimerRef.current)
    const delay = (3 + Math.random() * 4) * 60 * 1000
    eventTimerRef.current = setTimeout(() => {
      const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]
      setActiveEvent({ ...event, endTime: Date.now() + event.duration * 1000 })
      setEventsEncountered(e => e + 1)
      if (event.steal) setBananas(b => b * (1 - event.steal))
      scheduleNextEventRef.current()
    }, delay)
  }

  useEffect(() => {
    scheduleNextEventRef.current()
    return () => clearTimeout(eventTimerRef.current)
  }, []) // stable — runs once on mount

  // Debounced save
  useEffect(() => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...gameStateRef.current, savedAt: Date.now() }))
    }, 2000)
  }, [bananas, totalBananas, clickPower, passive, upgradeCounts,
      totalClicks, totalUpgradesBought, wentBroke, frenzy, unlockedAchs,
      prestigeLevel, ownedSkins, equippedSkin, timePlayed, goldenClicked, eventsEncountered,
      hitFortytwo, hitSixtynine, hitLeet, hitPalindrome, midnight, goldenExpired, unlockedLore])

  // Save on tab close
  useEffect(() => {
    const onUnload = () => {
      clearTimeout(saveTimer.current)
      localStorage.setItem(SAVE_KEY, JSON.stringify({ ...gameStateRef.current, savedAt: Date.now() }))
    }
    window.addEventListener('beforeunload', onUnload)
    return () => window.removeEventListener('beforeunload', onUnload)
  }, [])

  // Achievement toast queue
  const flushToastQueue = useCallback(() => {
    if (showingToast.current || achToastQueue.current.length === 0) return
    showingToast.current = true
    const next = achToastQueue.current.shift()
    setAchToast(next)
    setTimeout(() => {
      setAchToast(null)
      showingToast.current = false
      setTimeout(flushToastQueue, 300)
    }, 3000)
  }, [])

  // Achievement check
  useEffect(() => {
    const state = {
      totalBananas, bananas, clickPower, passive, upgradeCounts,
      totalClicks, totalUpgradesBought, wentBroke, idleSeconds, frenzy,
      prestigeLevel, ownedSkins, goldenClicked, eventsEncountered,
      hitFortytwo, hitSixtynine, hitLeet, hitPalindrome, midnight, goldenExpired,
    }
    const newlyUnlocked = ACHIEVEMENTS.filter(a => !unlockedAchs.includes(a.id) && a.condition(state))
    if (newlyUnlocked.length === 0) return
    setUnlockedAchs(prev => [...prev, ...newlyUnlocked.map(a => a.id)])
    newlyUnlocked.forEach(a => achToastQueue.current.push({ name: a.name, pixelId: a.pixelId }))
    flushToastQueue()
  }, [totalBananas, bananas, clickPower, passive, upgradeCounts,
      totalClicks, totalUpgradesBought, wentBroke, idleSeconds, frenzy,
      prestigeLevel, ownedSkins, goldenClicked, eventsEncountered,
      hitFortytwo, hitSixtynine, hitLeet, hitPalindrome, midnight, goldenExpired,
      unlockedAchs, flushToastQueue])

  // Lore unlock check
  useEffect(() => {
    const newEntries = LORE.filter(e => totalBananas >= e.threshold && !unlockedLore.includes(e.id))
    if (newEntries.length === 0) return
    setUnlockedLore(prev => [...prev, ...newEntries.map(e => e.id)])
    const latest = newEntries[newEntries.length - 1]
    setLoreToast(latest.day)
    setTimeout(() => setLoreToast(null), 3500)
  }, [totalBananas, unlockedLore])

  // ── Handlers ────────────────────────────────────────────────

  const resetIdle = useCallback(() => { lastActionRef.current = Date.now() }, [])

  const handleClick = useCallback((e) => {
    const gain = effectiveClickRef.current
    setBananas(b => b + gain)
    setTotalBananas(t => t + gain)
    setTotalClicks(c => c + 1)
    resetIdle()
    setMonkeyBounce(true)
    setTimeout(() => setMonkeyBounce(false), 150)

    const now = Date.now()
    clickTimestamps.current.push(now)
    clickTimestamps.current = clickTimestamps.current.filter(t => now - t < 2000)
    if (clickTimestamps.current.length >= 10) {
      setFrenzy(true)
      setTimeout(() => setFrenzy(false), 5000)
    }

    const id = now + Math.random()
    const x = e.clientX ?? window.innerWidth / 2
    const y = e.clientY ?? window.innerHeight / 2
    const display = Math.max(1, Math.round(gain))
    setFloaties(f => [...f, { id, x, y, value: display }])
    setTimeout(() => setFloaties(f => f.filter(fl => fl.id !== id)), 900)

    // Particles
    const newParticles = Array.from({ length: 7 }, (_, i) => {
      const angle = (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
      const speed = 45 + Math.random() * 55
      return { id: Math.random(), x, y, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed }
    })
    setParticles(p => [...p, ...newParticles])
    setTimeout(() => {
      setParticles(p => p.filter(pt => !newParticles.find(np => np.id === pt.id)))
    }, 650)
  }, [resetIdle])

  const buyUpgrade = useCallback((upgrade) => {
    const count = upgradeCounts[upgrade.id]
    const cost = getCost(upgrade, count)
    setBananas(b => {
      if (b < cost) {
        setShake(true)
        setTimeout(() => setShake(false), 400)
        return b
      }
      resetIdle()
      setUpgradeCounts(c => ({ ...c, [upgrade.id]: c[upgrade.id] + 1 }))
      setTotalUpgradesBought(t => t + 1)
      if (upgrade.effect.type === 'click') setClickPower(p => p + upgrade.effect.value)
      else setPassive(p => p + upgrade.effect.value)
      const after = b - cost
      if (after < 1 && b >= 100) setWentBroke(true)
      return after
    })
  }, [upgradeCounts, resetIdle])

  const handleGoldenClick = useCallback(() => {
    if (!goldenBanana) return
    const reward = Math.max(500, Math.floor(effectivePassiveRef.current * 120))
    setBananas(b => b + reward)
    setTotalBananas(t => t + reward)
    setGoldenBanana(null)
    setGoldenClicked(g => g + 1)
    scheduleGoldenBanana()
    achToastQueue.current.unshift({ name: `+${formatNumber(reward)} bananes`, pixelId: 'star' })
    flushToastQueue()
  }, [goldenBanana, scheduleGoldenBanana, flushToastQueue])

  const handlePrestige = useCallback(() => {
    setPrestigeLevel(l => l + 1)
    setBananas(0)
    setTotalBananas(0)
    setClickPower(1)
    setPassive(0)
    setUpgradeCounts({ ...DEFAULT_COUNTS })
    setTotalClicks(0)
    setTotalUpgradesBought(0)
    setWentBroke(false)
    setFrenzy(false)
    setShowPrestigeModal(false)
  }, [])

  const buySkin = useCallback((skin) => {
    setBananas(b => {
      if (b < skin.price || ownedSkins.includes(skin.id)) return b
      setOwnedSkins(s => [...s, skin.id])
      setEquippedSkin(skin.id)
      return b - skin.price
    })
  }, [ownedSkins])

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY)
    window.location.reload()
  }, [])

  const handleExport = useCallback(() => {
    const data = { ...gameStateRef.current, savedAt: Date.now() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `bananaclicker-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const handleImport = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result)
        localStorage.setItem(SAVE_KEY, JSON.stringify(data))
        window.location.reload()
      } catch {
        alert('Fichier de sauvegarde invalide.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }, [])

  // ── Render computed ──────────────────────────────────────────

  const goldenTimeLeft = goldenBanana
    ? Math.max(0, Math.ceil((goldenBanana.endTime - Date.now()) / 1000))
    : 0
  const eventTimeLeft = activeEvent?.endTime
    ? Math.max(0, Math.ceil((activeEvent.endTime - Date.now()) / 1000))
    : 0

  // ── Render ───────────────────────────────────────────────────

  return (
    <div className="app">
      {/* Floating +bananas */}
      {floaties.map(f => (
        <div key={f.id} className="floatie" style={{ left: f.x - 20, top: f.y - 20 }}>
          +{f.value}<PixelIcon id="banana" size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 2 }} />
        </div>
      ))}

      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{ left: p.x, top: p.y, '--dx': `${p.dx}px`, '--dy': `${p.dy}px` }}
        ><PixelIcon id="banana" size={12} /></div>
      ))}

      {/* Achievement toast */}
      {achToast && (
        <div className="ach-toast">
          <span className="ach-toast-emoji"><PixelIcon id={achToast.pixelId} size={28} /></span>
          <div className="ach-toast-body">
            <div className="ach-toast-label">Succès débloqué !</div>
            <div className="ach-toast-name">{achToast.name}</div>
          </div>
        </div>
      )}

      {/* Offline gain toast */}
      {offlineToast && (
        <div className="offline-toast">
          <PixelIcon id="sleeping" size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Pendant ton absence : <strong>+{formatNumber(offlineToast)} <PixelIcon id="banana" size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></strong>
        </div>
      )}

      {/* Lore toast */}
      {loreToast && (
        <div className="lore-toast">
          <PixelIcon id="book" size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Nouvelle entrée — <strong>{loreToast}</strong>
        </div>
      )}

      {/* Golden banana */}
      {goldenBanana && (
        <button
          className="golden-banana-btn"
          style={{ left: goldenBanana.x, top: goldenBanana.y }}
          onClick={handleGoldenClick}
          title="Attrape-la !"
        >
          <span className="golden-timer">{goldenTimeLeft}s</span>
          <PixelIcon id="star" size={36} />
        </button>
      )}

      {/* Event banner */}
      {activeEvent && (
        <div className="event-banner" style={{ '--event-color': activeEvent.color }}>
          <span className="event-emoji"><PixelIcon id={activeEvent.pixelId} size={24} /></span>
          <div className="event-text">
            <span className="event-name">{activeEvent.name}</span>
            <span className="event-desc">{activeEvent.desc}</span>
          </div>
          {eventTimeLeft > 0 && <span className="event-timer">{eventTimeLeft}s</span>}
        </div>
      )}

      {/* Prestige modal */}
      {showPrestigeModal && (
        <div className="modal-overlay" onClick={() => setShowPrestigeModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-big-emoji"><PixelIcon id="recycle" size={64} /></div>
            <h2 className="modal-title">Prestige !</h2>
            <p className="modal-body">
              Tu vas tout perdre — upgrades, bananes, clics —
              mais gagner un multiplicateur permanent de{' '}
              <strong className="modal-highlight">×{(1 + (prestigeLevel + 1) * 0.25).toFixed(2)}</strong>{' '}
              sur toutes les bananes.
            </p>
            <p className="modal-note">Tes succès et skins restent.</p>
            <div className="modal-btns">
              <button className="modal-btn cancel" onClick={() => setShowPrestigeModal(false)}>
                Annuler
              </button>
              <button className="modal-btn confirm" onClick={handlePrestige}>
                Tout perdre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-big-emoji"><PixelIcon id="skull" size={64} /></div>
            <h2 className="modal-title">Tout effacer</h2>
            <p className="modal-body">
              Supprimer définitivement toute ta progression ?
              Succès, skins, prestige, bananes. Tout. Pour rien.
            </p>
            <div className="modal-btns">
              <button className="modal-btn cancel" onClick={() => setShowResetModal(false)}>
                Non, j'ai peur
              </button>
              <button className="modal-btn danger" onClick={resetGame}>
                Tout détruire
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout">
        {/* ── LEFT: clicker ─────────────────────────────────── */}
        <div className="clicker-panel">
          <div className="header-row">
            <h1 className="title"><PixelIcon id="banana" size={28} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Banana Clicker</h1>
            <button className="icon-btn" onClick={() => setShowResetModal(true)} title="Réinitialiser"><PixelIcon id="trash" size={18} /></button>
          </div>

          <p className="subtitle">Tu es un singe. Tu accumules des bananes. C'est tout.</p>

          {prestigeLevel > 0 && (
            <div className="prestige-badge">
              <PixelIcon id="recycle" size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Prestige {prestigeLevel} &mdash; ×{prestigeMult.toFixed(2)}
            </div>
          )}

          <div className="banana-count">
            <span className="count-num">{formatNumber(bananas)}</span>
            <span className="count-label"> bananes</span>
          </div>

          {passive > 0 && (
            <div className="bps">
              {formatNumber(effectivePassive)}/s
              {eventPassiveMult > 1 && <span className="mult-pill">×{eventPassiveMult}</span>}
            </div>
          )}

          <div className="total-label">Total : {formatNumber(totalBananas)} <PixelIcon id="banana" size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></div>

          <button
            className={`banana-btn ${monkeyBounce ? 'bounce' : ''}`}
            onClick={handleClick}
          >
            <span className={`banana-emoji ${currentSkin.cssClass}`}><PixelIcon id="banana" size={80} /></span>
            <span className="monkey-emoji"><PixelIcon id="monkey" size={30} /></span>
          </button>

          <div className="click-power">
            +{formatNumber(effectiveClick)} par clic
            {eventClickMult > 1 && <span className="mult-pill">×{eventClickMult}</span>}
          </div>

          <div className="stats-row">
            <span><PixelIcon id="pointup" size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> {formatNumber(totalClicks)}</span>
            <span><PixelIcon id="trophy" size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> {unlockedAchs.length}/{ACHIEVEMENTS.length}</span>
            <span><PixelIcon id="timer" size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> {formatTime(timePlayed)}</span>
          </div>

          {canPrestige && (
            <button className="prestige-btn" onClick={() => setShowPrestigeModal(true)}>
              <PixelIcon id="recycle" size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} /> Prestige disponible !
              <span className="prestige-sub">×{(1 + (prestigeLevel + 1) * 0.25).toFixed(2)} pour toujours</span>
            </button>
          )}
        </div>

        {/* ── RIGHT: tabs ───────────────────────────────────── */}
        <div className="right-panel">
          <div className="tabs">
            {[
              { id: 'upgrades',     pixelId: 'cart',    label: 'Achats' },
              { id: 'achievements', pixelId: 'trophy',  label: 'Succès', badge: unlockedAchs.length || null },
              { id: 'skins',        pixelId: 'palette', label: 'Skins' },
              { id: 'stats',        pixelId: 'chart',   label: 'Stats' },
              { id: 'lore',         pixelId: 'book',    label: 'Journal', badge: unlockedLore.length || null },
            ].map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon"><PixelIcon id={tab.pixelId} size={18} /></span>
                <span className="tab-label">{tab.label}</span>
                {tab.badge && <span className="tab-badge">{tab.badge}</span>}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'upgrades' && (
              <div className="upgrades-list">
                {UPGRADES.map(upgrade => {
                  const count     = upgradeCounts[upgrade.id]
                  const cost      = getCost(upgrade, count)
                  const canAfford = bananas >= cost
                  const badge     = getMilestoneBadge(count)
                  return (
                    <button
                      key={upgrade.id}
                      className={`upgrade-btn ${canAfford ? 'affordable' : 'expensive'} ${shake && !canAfford ? 'shake' : ''}`}
                      onClick={() => buyUpgrade(upgrade)}
                    >
                      <span className="upgrade-emoji"><PixelIcon id={upgrade.pixelId} size={28} /></span>
                      <div className="upgrade-info">
                        <div className="upgrade-name">
                          {upgrade.name}
                          {badge > 0 && <span className="milestone-badge">{Array.from({ length: badge }, (_, i) => <PixelIcon key={i} id="star" size={10} />)}</span>}
                        </div>
                        <div className="upgrade-desc">{upgrade.description}</div>
                      </div>
                      <div className="upgrade-right">
                        <div className="upgrade-cost">{formatNumber(cost)} <PixelIcon id="banana" size={12} style={{ display: 'inline-block', verticalAlign: 'middle' }} /></div>
                        {count > 0 && <div className="upgrade-count">×{count}</div>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {activeTab === 'achievements' && (
              <AchievementsPage unlocked={unlockedAchs} />
            )}

            {activeTab === 'skins' && (
              <SkinsPage
                ownedSkins={ownedSkins}
                equippedSkin={equippedSkin}
                bananas={bananas}
                onBuy={buySkin}
                onEquip={setEquippedSkin}
              />
            )}

            {activeTab === 'stats' && (
              <StatsPage
                totalBananas={totalBananas}
                effectiveClick={effectiveClick}
                effectivePassive={effectivePassive}
                totalClicks={totalClicks}
                totalUpgradesBought={totalUpgradesBought}
                timePlayed={timePlayed}
                goldenClicked={goldenClicked}
                eventsEncountered={eventsEncountered}
                prestigeLevel={prestigeLevel}
                prestigeMult={prestigeMult}
                unlockedAchs={unlockedAchs}
                totalAchs={ACHIEVEMENTS.length}
                bpsHistory={bpsHistory}
                onExport={handleExport}
                onImport={handleImport}
              />
            )}

            {activeTab === 'lore' && (
              <LorePage unlocked={unlockedLore} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
