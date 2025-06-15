import React, { useState, useRef, useEffect } from "react";

export default function ClientGridMain({
    title,
    useItems,
    CardComponent,
    getItem,
    itemPropName = "item",
}) {
    const items = useItems();
    const containerRef = useRef(null);
    const [columns, setColumns] = useState(1);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const MIN_CARD_WIDTH = 192;
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const cols = Math.max(1, Math.floor(width / MIN_CARD_WIDTH));
                setColumns(cols);
            }
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const visibleItems = showAll ? items : items.slice(0, columns);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4 px-1">
                {items.length > 0 && (
                    <h1 className="text-2xl font-bold">{title}</h1>
                )}
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
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
            >
                {visibleItems.map((item, i) => (
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