import { SKINS } from './skins'
import PixelIcon from './PixelIcon'
import './SkinsPage.css'

function formatNumber(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'k'
  return Math.floor(n).toString()
}

export default function SkinsPage({ ownedSkins, equippedSkin, bananas, onBuy, onEquip }) {
  return (
    <div className="skins-page">
      <p className="skins-intro">Change l'apparence de ta banane. Pour rien.</p>
      <div className="skins-list">
        {SKINS.map(skin => {
          const owned   = ownedSkins.includes(skin.id)
          const equipped = equippedSkin === skin.id
          const canAfford = bananas >= skin.price

          return (
            <div key={skin.id} className={`skin-card ${equipped ? 'equipped' : ''} ${!owned && !canAfford ? 'locked' : ''}`}>
              <div className="skin-preview-wrap">
                <span className={`skin-preview ${skin.cssClass}`}><PixelIcon id={skin.pixelId} size={40} /></span>
              </div>
              <div className="skin-info">
                <div className="skin-name">{skin.name}</div>
                <div className="skin-desc">{skin.desc}</div>
              </div>
              <div className="skin-action">
                {equipped ? (
                  <span className="skin-badge equipped-badge">Équipé</span>
                ) : owned ? (
                  <button className="skin-btn equip-btn" onClick={() => onEquip(skin.id)}>
                    Équiper
                  </button>
                ) : (
                  <button
                    className={`skin-btn buy-btn ${canAfford ? '' : 'cant-afford'}`}
                    onClick={() => onBuy(skin)}
                    disabled={!canAfford}
                  >
                    {formatNumber(skin.price)} <PixelIcon id="banana" size={12} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
