import type { ReactNode } from "react";

export type CrossQuestDossierMilestone = {
  id: string | number;
  title: string;
  detail?: string;
  onReplay?: () => void;
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
  milestones,
  correspondence,
  postSeries,
}: CrossQuestDossierProps) {
  const safeTotal = Math.max(1, total);
  const safeProgress = Math.max(0, Math.min(safeTotal, progress));
  return (
    <section className={`cross-quest-dossier shared-cross-dossier ${completed ? "complete" : ""} ${className}`.trim()}>
      <header>
        <div className="cross-dossier-portraits">
          {portraits.map((portrait) => <img key={portrait.alt} src={portrait.src} alt={portrait.alt} />)}
        </div>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <strong>{safeProgress} / {safeTotal}</strong>
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

      <div className="cross-milestones">
        <h3>Étapes vécues</h3>
        {milestones.map((milestone) => milestone.onReplay ? (
          <button key={milestone.id} onClick={milestone.onReplay}>
            <span>✓</span>
            <strong>{milestone.title}</strong>
            {milestone.detail && <small>{milestone.detail}</small>}
          </button>
        ) : (
          <div key={milestone.id}>
            <span>✓</span>
            <strong>{milestone.title}</strong>
            {milestone.detail && <small>{milestone.detail}</small>}
          </div>
        ))}
      </div>

      {correspondence}
      {postSeries}
    </section>
  );
}
