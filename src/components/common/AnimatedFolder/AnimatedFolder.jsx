import { useState, useRef, forwardRef, memo } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import "./AnimatedFolder.css";

const PreviewCard = forwardRef(function PreviewCard(
  { item, delay, isVisible, index, totalCount, onClick, isSelected },
  ref,
) {
  const middleIndex = (totalCount - 1) / 2;
  const factor = totalCount > 1 ? (index - middleIndex) / middleIndex : 0;
  const rotation = factor * 20;
  const translationX = factor * 70;
  const translationY = Math.abs(factor) * 10;

  return (
    <div
      ref={ref}
      className="af-preview-card"
      style={{
        "--delay": `${delay}ms`,
        "--rotation": `${rotation}deg`,
        "--translateX": `${translationX}px`,
        "--translateY": `${translationY}px`,
        opacity: isSelected ? 0 : undefined,
        zIndex: 10 + index,
      }}
      data-visible={isVisible}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <div className="af-preview-card__inner">
        <img
          src={item.image}
          alt={item.name}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
          }}
        />
        <div className="af-preview-card__overlay" />
        <p className="af-preview-card__title">{item.name}</p>
      </div>
    </div>
  );
});

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

function AnimatedFolder({
  title,
  subtitle,
  gradient = "linear-gradient(135deg, #10b981, #059669)",
  items = [],
  stats = [],
  onClick,
  children,
  lightboxTitle,
  lightboxActionLabel,
  onLightboxAction,
  className = "",
  topIcon: TopIcon,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [hiddenItemId, setHiddenItemId] = useState(null);
  const cardRefs = useRef([]);

  const previewItems = items.slice(0, 5);

  const handleItemClick = (item, index) => {
    setSelectedIndex(index);
    setHiddenItemId(item.id);
  };

  const handleCloseLightbox = () => {
    setSelectedIndex(null);
    setHiddenItemId(null);
  };

  const handleNavigate = (index) => {
    setSelectedIndex(index);
    setHiddenItemId(items[index]?.id || null);
  };

  return (
    <>
      <div
        className={`animated-folder ${className}`}
        style={{ "--folder-gradient": gradient }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="animated-folder__glow" data-hovered={isHovered} />

        <div className="animated-folder__body">
          {TopIcon && (
            <div className="animated-folder__header-center">
              <div className="top-icon-wrapper" data-hovered={isHovered}>
                <TopIcon size={24} />
              </div>
            </div>
          )}

          <div className="animated-folder__content">
            <div className="folder-3d">
              <div className="folder-3d__back" data-hovered={isHovered} />
              <div className="folder-3d__tab" data-hovered={isHovered} />

              <div className="folder-3d__cards">
                {previewItems.map((item, index) => (
                  <PreviewCard
                    key={item.id}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    item={item}
                    delay={index * 50}
                    isVisible={isHovered}
                    index={index}
                    totalCount={previewItems.length}
                    onClick={() => handleItemClick(item, index)}
                    isSelected={hiddenItemId === item.id}
                  />
                ))}
              </div>

              <div className="folder-3d__front" data-hovered={isHovered}>
                <div className="folder-3d__shine" />
              </div>
            </div>

            <div className="animated-folder__info">
              <h3 className="animated-folder__title">{title}</h3>
              {subtitle && (
                <span className="animated-folder__subtitle">{subtitle}</span>
              )}
            </div>
          </div>
        </div>

        <div className="animated-folder__footer">
          {children && <div className="animated-folder__extra">{children}</div>}

          {stats.length > 0 && (
            <div
              className="animated-folder__stats"
              style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
            >
              {stats.map((stat, i) => (
                <div key={i} className="animated-folder__stat">
                  <div className="stat-header">
                    {stat.icon && <stat.icon size={12} />}
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Lightbox
        items={items}
        currentIndex={selectedIndex ?? 0}
        isOpen={selectedIndex !== null}
        onClose={handleCloseLightbox}
        onNavigate={handleNavigate}
        title={lightboxTitle || title}
        actionLabel={lightboxActionLabel}
        onAction={onLightboxAction}
      />
    </>
  );
}

export { AnimatedFolder, Lightbox, PreviewCard };
export default AnimatedFolder;
