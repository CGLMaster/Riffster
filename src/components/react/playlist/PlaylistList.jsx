import React, { useState } from "react";

export default function PlaylistList({ allTracks }) {
    const [selectedTrack, setSelectedTrack] = useState(null);
    console.log("Canciones", allTracks);

    // Función para formatear la fecha de agregado
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

    // Función para formatear la duración de la canción
    function formatDuration(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = String(totalSeconds % 60).padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    // Función que maneja la selección de la canción
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
                    <div className="grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] text-white text-sm tracking-wider pb-4">
                        <div>#</div>
                        <div>Título</div>
                        <div>Álbum</div>
                        <div>Añadido</div>
                        <div className="flex justify-end">
                            <iconify-icon icon="iconamoon:clock" className="text-white" width="16" height="16" />
                        </div>
                    </div>
                    <div className="absolute left-[-10px] right-[-10px] bottom-0 h-px bg-white/20" />
                </div>

                <ul className="mt-4 text-white/90 text-sm">
                    {allTracks.map((item, index) => {
                        const { track, added_at } = item;
                        if (!track) return null;

                        const isSelected = selectedTrack === track.id; // Verifica si la canción está seleccionada

                        return (
                            <li
                                key={track.id}
                                className={`grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] py-3 items-center relative rounded-md px-6 ${
                                    isSelected ? "bg-white/20" : "group"
                                }`}
                                onClick={() => handleSelectTrack(track.id)} // Maneja la selección al hacer clic
                            >
                                {/* Número de la canción con el ícono de play en hover */}
                                <div className="flex items-center justify-start">
                                    <div className="group-hover:hidden">{index + 1}</div>
                                    <div className="hidden group-hover:flex absolute inset-0 items-center justify-start bg-white/5 rounded-md px-5">
                                        <iconify-icon icon="solar:play-bold" width="20" height="20" className="text-white" />
                                    </div>
                                </div>

                                {/* Imagen de la canción */}
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <img
                                        src={track.album.images[0]?.url}
                                        alt=""
                                        className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                                    />
                                    <div className="overflow-hidden">
                                        <div className="font-medium truncate">{track.name}</div>
                                        <div className="text-white/60 truncate">{track.artists.map((a) => a.name).join(", ")}</div>
                                    </div>
                                </div>

                                {/* Álbum y fecha */}
                                <div className="truncate pl-2">{track.album.name}</div>
                                <div className="truncate pl-2">{formatAddedAt(added_at)}</div>
                                <div className="text-right">{formatDuration(track.duration_ms)}</div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
