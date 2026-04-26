import { memo } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const Lightbox = memo(function Lightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  title,
  actionLabel = "Open",
  onAction,
}) {
  if (!isOpen || !items.length) return null;

  const current = items[currentIndex];
  const hasNext = currentIndex < items.length - 1;
  const hasPrev = currentIndex > 0;

  return (
    <div
      className={`af-lightbox ${isOpen ? "af-lightbox--open" : ""}`}
      onClick={onClose}
    >
      <div className="af-lightbox__backdrop" />

      <button className="af-lightbox__close" onClick={onClose}>
        <X size={20} />
      </button>

      {hasPrev && (
        <button
          className="af-lightbox__nav af-lightbox__nav--prev"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {hasNext && (
        <button
          className="af-lightbox__nav af-lightbox__nav--next"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
        >
          <ChevronRight size={24} />
        </button>
      )}

      <div
        className="af-lightbox__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="af-lightbox__image">
          <img src={current?.image} alt={current?.name} />
        </div>
        <div className="af-lightbox__info">
          <div className="af-lightbox__details">
            <h3>{current?.name}</h3>
            <p>{title}</p>
            <div className="af-lightbox__dots">
              {items.map((_, i) => (
                <button
                  key={i}
                  className={`af-lightbox__dot ${i === currentIndex ? "active" : ""}`}
                  onClick={() => onNavigate(i)}
                />
              ))}
              <span className="af-lightbox__counter">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </div>
          {onAction && (
            <button
              className="af-lightbox__action"
              onClick={() => onAction(current)}
            >
              <span>{actionLabel}</span>
              <ExternalLink size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default Lightbox;
