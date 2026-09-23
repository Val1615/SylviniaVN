import type { ReactNode } from "react";

export type CrossQuestDossierMilestone = {
  id: string | number;
  title: string;
  detail?: string;
  onReplay?: () => void;
  actionLabel?: string;
};

export type CrossQuestDossierProps = {
  className?: string;
  portraits: { src: string; alt: string }[];
  eyebrow: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  current?: {
    label?: string;
    title: string;
    objective: string;
    action?: ReactNode;
    mechanic?: ReactNode;
  };
  completed?: {
    label?: string;
    title: string;
    description: string;
    status?: ReactNode;
  };
  mechanic?: {
    label?: string;
    title: string;
    description: string;
    status?: ReactNode;
    action?: ReactNode;
  };
  milestones: CrossQuestDossierMilestone[];
  correspondence?: ReactNode;
  postSeries?: ReactNode;
};

export function CrossQuestDossier({
  className = "",
  portraits,
  eyebrow,
  title,
  description,
  progress,
  total,
  current,
  completed,
  mechanic,
  milestones,
  correspondence,
  postSeries,
}: CrossQuestDossierProps) {
  const safeTotal = Math.max(1, total);
  const safeProgress = Math.max(0, Math.min(safeTotal, progress));
  return (
    <section className={`cross-quest-dossier shared-cross-dossier ${completed ? "complete" : ""} ${className}`.trim()}>
      <header className="cross-dossier-heading">
        <div className="cross-dossier-portraits">
          {portraits.map((portrait) => <img key={portrait.alt} src={portrait.src} alt={portrait.alt} />)}
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <strong className="cross-dossier-count">{safeProgress} / {safeTotal}</strong>
      </header>

      <div className="cross-progress" aria-label={`Progression : ${safeProgress} étapes sur ${safeTotal}`}>
        <i style={{ width: `${(safeProgress / safeTotal) * 100}%` }} />
      </div>

      {current && (
        <div className="cross-current">
          <span>{current.label || "Objectif actuel"}</span>
          <h3>{current.title}</h3>
          <p>{current.objective}</p>
          {current.mechanic}
          {current.action}
        </div>
      )}

      {completed && (
        <div className="cross-current cross-complete-state">
          <span>{completed.label || "Série accomplie"}</span>
          <h3>{completed.title}</h3>
          <p>{completed.description}</p>
          {completed.status}
        </div>
      )}

      {mechanic && (
        <div className="cross-dossier-mechanic">
          <span className="cross-mechanic-mark" aria-hidden="true">◇</span>
          <div className="cross-mechanic-copy">
            <small>{mechanic.label || "Mécanique de la route"}</small>
            <h3>{mechanic.title}</h3>
            <p>{mechanic.description}</p>
            {mechanic.status && <div className="cross-mechanic-status">{mechanic.status}</div>}
          </div>
          {mechanic.action && <div className="cross-mechanic-action">{mechanic.action}</div>}
        </div>
      )}

      <div className="cross-milestones">
        <div className="cross-section-heading">
          <h3>Étapes vécues</h3>
          {milestones.some((milestone) => milestone.onReplay) && <small>Les relectures ne modifient ni le temps, ni les relations, ni la sauvegarde.</small>}
        </div>
        <div className="cross-milestone-list">
          {milestones.map((milestone) => {
            const content = <>
              <span className="cross-milestone-check" aria-hidden="true">✓</span>
              <span className="cross-milestone-copy">
                <strong>{milestone.title}</strong>
                {milestone.detail && <small>{milestone.detail}</small>}
              </span>
              {milestone.onReplay && <span className="cross-milestone-action">{milestone.actionLabel || "Relire"}</span>}
            </>;
            return milestone.onReplay
              ? <button type="button" key={milestone.id} onClick={milestone.onReplay}>{content}</button>
              : <div key={milestone.id}>{content}</div>;
          })}
        </div>
      </div>

      {correspondence && <div className="cross-dossier-correspondence">{correspondence}</div>}
      {postSeries && <div className="cross-dossier-post-series">{postSeries}</div>}
    </section>
  );
}
