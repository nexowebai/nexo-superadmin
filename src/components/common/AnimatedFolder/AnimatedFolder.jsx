import { useState, useRef } from "react";
import PreviewCard from "./components/PreviewCard";
import Lightbox from "./components/Lightbox";
import "./AnimatedFolder.css";

export { PreviewCard, Lightbox };

export function AnimatedFolder({
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
        style={{ "--folder-gradient": gradient }} /* allowed-inline */
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
              style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }} /* allowed-inline */
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

export default AnimatedFolder;
