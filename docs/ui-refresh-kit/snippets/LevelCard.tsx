export function LevelCard({ title, stars, onClick }: { title: string; stars: number; onClick: () => void }) {
  return (
    <button className="level-card" onClick={onClick}>
      <img className="level-card__bg" src="/assets/ui/level-card-bg.svg" alt="" aria-hidden="true" />
      <div className="level-card__content">
        <strong>{title}</strong>
        <div className="level-card__stars">{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</div>
      </div>
    </button>
  );
}
