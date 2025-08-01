import { useState, useRef, useEffect } from "react";

export default function GridSection({
  title,
  items = [],
  CardComponent,
  itemPropName = "item",
  getItem = (item) => item,
  minCardWidth = 180,
  showCount = 1,
}) {
  const containerRef = useRef(null);
  const [columns, setColumns] = useState(showCount);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        const cols = Math.max(1, Math.floor(width / minCardWidth));
        setColumns(cols);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [minCardWidth]);

  const visibleItems = showAll ? items : items.length <= columns ? items : items.slice(0, columns - 1);

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        {items.length > columns && (
          <button
            onClick={() => setShowAll(v => !v)}
            className="flex items-center gap-1 px-3 py-1 text-white rounded hover:underline hover:cursor-pointer transition-transform"
          >
            {showAll ? "Mostrar menos" : "Mostrar todos"}
          </button>
        )}
      </div>
      <div
        ref={containerRef}
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))` }}
      >
        {visibleItems.filter(Boolean).map((item, i) => (
          <CardComponent
            key={getItem(item).id}
            {...{ [itemPropName]: getItem(item) }}
            style={{ animation: `fadeIn 300ms ease ${(i % columns) * 50}ms forwards` }}
            className="opacity-0"
          />
        ))}
      </div>
      <style>{`
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
