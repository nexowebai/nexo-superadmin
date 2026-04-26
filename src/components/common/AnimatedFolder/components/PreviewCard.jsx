import { forwardRef } from "react";

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
      }} /* allowed-inline */
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

export default PreviewCard;
