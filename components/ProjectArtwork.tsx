export default function ProjectArtwork({ kind }: { kind: string }) {
  return (
    <div className={`project-art art-${kind}`} aria-hidden="true">
      <div className="app-frame">
        <div className="frame-bar">
          <span>● ● ●</span>
          <span>
            {kind === 'drive'
              ? 'CAMBRIDGE / EXPLORER'
              : kind === 'vision'
                ? 'VISIONGRID / STUDIO'
                : kind === 'care'
                  ? 'CLINICFLOW / OVERVIEW'
                  : 'DEEPEDGE / DATASET'}
          </span>
          <span>⌘ K</span>
        </div>
        {kind === 'drive' ? (
          <div className="drive-art">
            <div className="road road-one" />
            <div className="road road-two" />
            <div className="road road-three" />
            <div className="map-block block-one" />
            <div className="map-block block-two" />
            <div className="map-label">
              CAMBRIDGE<span>Explore. Observe. Practise.</span>
            </div>
            <div className="map-car">↑</div>
            <div className="map-pin">●</div>
          </div>
        ) : kind === 'vision' ? (
          <div className="vision-art">
            <div className="art-orb" />
            <div className="selection-box">
              <span>OBJECT · 98.4%</span>
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="art-caption">
              ✦ Assisted segmentation<span>Human insight. Machine precision.</span>
            </div>
            <div className="tool-rail">
              ＋<br />↖<br />▧<br />◎
            </div>
          </div>
        ) : kind === 'care' ? (
          <div className="care-art">
            <small>YOUR WORKSPACE</small>
            <h4>A clearer day ahead.</h4>
            <div className="care-stats">
              <span>
                24<small>Appointments</small>
              </span>
              <span>
                08<small>In review</small>
              </span>
              <span>
                96%<small>Completion</small>
              </span>
            </div>
            <div className="art-chart">
              {[30, 50, 40, 70, 55, 90, 78, 95, 85, 110, 98, 125].map((v, i) => (
                <i key={i} style={{ height: v }} />
              ))}
            </div>
          </div>
        ) : (
          <div className="edge-art">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i}>
                <span
                  style={{ borderRadius: i % 2 ? '50%' : '15%', transform: `rotate(${i * 12}deg)` }}
                />
                <small>sample_00{i + 1}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
