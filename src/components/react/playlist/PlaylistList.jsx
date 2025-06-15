import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { FixedSizeList as List } from "react-window";
import { useCurrentTrackId } from "@/hooks/useCurrentTrackId";

export default function PlaylistList({ allTracks, playlistId }) {
    const access_token = localStorage.getItem("access_token");
    const currentTrackId = useCurrentTrackId(access_token, 1000);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
            }
            return { key, direction: "asc" };
        });
    };

    const sortedTracks = useMemo(() => {
        const arr = [...allTracks];
        const { key, direction } = sortConfig;
        if (!key) return arr;
        arr.sort((a, b) => {
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
        return arr;
    }, [allTracks, sortConfig]);

    const playTrackInContext = async (trackId) => {
        const offsetIndex = allTracks.findIndex((item) => item.track.id === trackId);
        try {
            await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    context_uri: `spotify:playlist:${playlistId}`,
                    offset: { position: offsetIndex },
                    position_ms: 0,
                }),
            });
        } catch (err) {
            console.error("Error al reproducir dentro de la playlist:", err);
        }
    };

    const formatAddedAt = (dateString) => {
        const addedDate = new Date(dateString);
        const now = Date.now();
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
    };

    const formatDuration = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const ROW_HEIGHT = 64;
    const OVERSCAN = 5;

    const Row = useCallback(
        ({ index, style }) => {
            const { track, added_at } = sortedTracks[index];
            const isCurrent = track.id === currentTrackId;
            return (
                <div
                    style={style}
                    className={`grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] items-center gap-x-2 px-6 rounded-md
                      ${isCurrent ? "bg-white/20" : "group"}`}
                >
                    <div className="flex items-center justify-start">
                        <div className="group-hover:hidden">{index + 1}</div>
                        <div
                            className="hidden group-hover:flex absolute inset-0 items-center justify-start bg-white/5 rounded-md px-5 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                playTrackInContext(track.id);
                            }}
                        >
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
                            <div className="font-medium truncate text-white">{track.name}</div>
                            <div className="text-white/60 truncate">
                                {track.artists.map((a) => a.name).join(", ")}
                            </div>
                        </div>
                    </div>

                    <div className="truncate pl-2 text-white/60">{track.album.name}</div>
                    <div className="truncate pl-2 text-white/60">{formatAddedAt(added_at)}</div>
                    <div className="text-right text-white/60">{formatDuration(track.duration_ms)}</div>
                </div>
            );
        },
        [sortedTracks, currentTrackId]
    );

    const listContainerRef = useRef(null);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        if (!listContainerRef.current) return;

        const updateHeight = () => {
            const container = listContainerRef.current;
            if (container) {
                setListHeight(container.clientHeight);
            }
        };

        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    return (
        <div id="playlist-container" className="h-full flex flex-col overflow-hidden">
            <div className="h-28 bg-gradient-to-b from-cyan-900 to-zinc-900 pointer-events-none flex-shrink-0" />
            <div className="relative z-10 px-6 mt-[-5%] flex flex-col flex-1 min-h-0">
                <div className="relative px-6 flex-shrink-0">
                    <div className="grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] gap-x-2 text-white/60 text-sm tracking-wider pb-4 group">
                        <div>#</div>
                        <div onClick={() => handleSort("title")} className="group cursor-pointer select-none flex items-center gap-1 relative pr-4">
                            <span className="hover:text-white">Título</span>
                            {sortConfig.key === "title" && (
                                <iconify-icon
                                    icon={sortConfig.direction === "asc" ? "bxs:up-arrow" : "bxs:down-arrow"}
                                    width="14"
                                    height="14"
                                    className="text-[#1ed760]"
                                />
                            )}
                            <div className="absolute right-0 top-0 h-full w-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div onClick={() => handleSort("album")} className="group cursor-pointer select-none flex items-center gap-1 relative pr-4">
                            <span className="hover:text-white">Álbum</span>
                            {sortConfig.key === "album" && (
                                <iconify-icon
                                    icon={sortConfig.direction === "asc" ? "bxs:up-arrow" : "bxs:down-arrow"}
                                    width="14"
                                    height="14"
                                    className="text-[#1ed760]"
                                />
                            )}
                            <div className="absolute right-0 top-0 h-full w-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div onClick={() => handleSort("added_at")} className="group cursor-pointer select-none flex items-center gap-1 relative pr-4">
                            <span className="hover:text-white">Fecha añadida</span>
                            {sortConfig.key === "added_at" && (
                                <iconify-icon
                                    icon={sortConfig.direction === "asc" ? "bxs:up-arrow" : "bxs:down-arrow"}
                                    width="14"
                                    height="14"
                                    className="text-[#1ed760]"
                                />
                            )}
                            <div className="absolute right-0 top-0 h-full w-px bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div
                            onClick={() => handleSort("duration_ms")}
                            className="flex items-center justify-end cursor-pointer relative pr-4"
                        >
                            <iconify-icon icon="iconamoon:clock" className="text-white/60" width="16" height="16" />
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
                    <div className="absolute left-[-10px] right-[-10px] bottom-0 h-px bg-white/20" />
                </div>
                <div ref={listContainerRef} className="flex-1 min-h-0">
                    {listHeight > 0 && (
                        <List
                            height={listHeight}
                            itemCount={sortedTracks.length}
                            itemSize={ROW_HEIGHT}
                            width="100%"
                            overscanCount={OVERSCAN}
                            className="no-scrollbars"
                        >
                            {Row}
                        </List>
                    )}
                </div>
            </div>
            <style>{`
                .no-scrollbars{
                    scrollbar-width: thin;
                    scrollbar-color: transparent transparent;
                
                    &::-webkit-scrollbar {
                    width: 1px;
                    }
                
                    &::-webkit-scrollbar-track {
                    background: transparent;
                    }
                
                    &::-webkit-scrollbar-thumb {
                    background-color: transparent;
                    }
                }

                .no-scrollbars::-webkit-scrollbar { 
                    display: none;  /* Safari and Chrome */
                }
            `}
            </style>
        </div>
    );
}
