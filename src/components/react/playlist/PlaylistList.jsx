import React, { useState } from "react";

export default function PlaylistList({ allTracks }) {
    const [selectedTrack, setSelectedTrack] = useState(null);
    console.log("Canciones", allTracks);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedTracks = [...allTracks].sort((a, b) => {
        const { key, direction } = sortConfig;
        if (!key) return 0;

        let aValue, bValue;

        switch (key) {
            case "title":
                aValue = a.track.name.toLowerCase();
                bValue = b.track.name.toLowerCase();
                break;
            case "added_at":
                aValue = new Date(a.added_at);
                bValue = new Date(b.added_at);
                break;
            case "album":
                aValue = a.track.album.name.toLowerCase();
                bValue = b.track.album.name.toLowerCase();
                break;
            case "duration_ms":
                aValue = a.track.duration_ms;
                bValue = b.track.duration_ms;
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const SortableHeader = ({ label, sortKey }) => {
        const isActive = sortConfig.key === sortKey;
        const arrowIcon = isActive
            ? sortConfig.direction === "asc"
                ? "bxs:up-arrow"
                : "bxs:down-arrow"
            : null;
        return (
            <div
                onClick={() => handleSort(sortKey)}
                className="group cursor-pointer select-none flex items-center gap-1 relative pr-4"
            >
                <span className="hover:text-white">{label}</span>
                {isActive && (
                    <iconify-icon
                        icon={arrowIcon}
                        width="14"
                        height="14"
                        className="text-[#1ed760]"
                    />
                )}
                <div className="absolute right-0 top-0 h-full w-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        );
    };

    function formatAddedAt(dateString) {
        const addedDate = new Date(dateString);
        const now = new Date();
        const diffMs = now - addedDate;

        const seconds = Math.round(diffMs / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return `hace ${seconds} segundos`;
        if (minutes < 60) return `hace ${minutes} minutos`;
        if (hours < 24) return `hace ${hours} horas`;
        if (days <= 7) return `hace ${days} días`;

        return addedDate.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    const handleSelectTrack = (trackId) => {
        setSelectedTrack((prevSelected) =>
            prevSelected === trackId ? null : trackId
        );
    };

    return (
        <div id="playlist-container" className="relative bg-zinc-900">
            <div className="h-28 bg-gradient-to-b from-[#530f0f] to-zinc-900 pointer-events-none" />

            <div className="relative z-10 px-6 pb-10 mt-[-5%]">
                <div className="relative px-6">
                    <div className="grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] gap-x-2 text-white/60 text-sm tracking-wider pb-4 group">
                        <div>#</div>
                        <SortableHeader label="Título" sortKey="title" />
                        <SortableHeader label="Álbum" sortKey="album" />
                        <SortableHeader label="Fecha en la que se añadió" sortKey="added_at" />
                        <div
                            className="flex items-center justify-end cursor-pointer relative pr-4"
                            onClick={() => handleSort("duration_ms")}
                        >
                            <div className="flex items-center">
                                <iconify-icon
                                    icon="iconamoon:clock"
                                    className="text-white/60"
                                    width="16"
                                    height="16"
                                />
                                {sortConfig.key === "duration_ms" && (
                                    <iconify-icon
                                        icon={sortConfig.direction === "asc" ? "bxs:up-arrow" : "bxs:down-arrow"}
                                        width="14"
                                        height="14"
                                        className="text-[#1ed760] ml-1"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="absolute left-[-10px] right-[-10px] bottom-0 h-px bg-white/20" />
                </div>

                <ul className="mt-4 text-white/90 text-sm">
                    {sortedTracks.map((item, index) => {
                        const { track, added_at } = item;
                        if (!track) return null;
                        const isSelected = selectedTrack === track.id;
                        return (
                            <li
                                key={track.id}
                                className={`grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] py-3 items-center relative rounded-md px-6 ${isSelected ? "bg-white/20" : "group"
                                    }`}
                                onClick={() => handleSelectTrack(track.id)}
                            >
                                <div className="flex items-center justify-start">
                                    <div className="group-hover:hidden">{index + 1}</div>
                                    <div className="hidden group-hover:flex absolute inset-0 items-center justify-start bg-white/5 rounded-md px-5">
                                        <iconify-icon
                                            icon="solar:play-bold"
                                            width="20"
                                            height="20"
                                            className="text-white/60"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 overflow-hidden">
                                    <img
                                        src={track.album.images[0]?.url}
                                        alt=""
                                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                    />
                                    <div className="overflow-hidden">
                                        <div className="font-medium truncate">{track.name}</div>
                                        <div className="text-white/60 truncate">
                                            {track.artists.map((a) => a.name).join(", ")}
                                        </div>
                                    </div>
                                </div>

                                <div className="truncate pl-2 text-white/60">{track.album.name}</div>
                                <div className="truncate pl-2 text-white/60">{formatAddedAt(added_at)}</div>
                                <div className="text-right text-white/60">
                                    {formatDuration(track.duration_ms)}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
