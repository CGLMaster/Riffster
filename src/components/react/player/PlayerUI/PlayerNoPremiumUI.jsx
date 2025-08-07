import { useEffect, useState } from 'react';
import '@/styles/player/player.css';

export default function PlayerNoPremiumUI({ authToken }) {
    const [playerState, setPlayerState] = useState(null);
    const [progress, setProgress] = useState(0);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPaused, setIsPaused] = useState(true);
    const [volume, setVolume] = useState(0.5);
    const [repeatMode, setRepeatMode] = useState("off");
    const [shuffleMode, setShuffleMode] = useState(false);
    const [useDevice, setUseDevice] = useState(null);

    // Polling para obtener estado de reproducción
    useEffect(() => {
        if (!authToken) return;
        
        let interval = setInterval(async () => {
            try {
                const response = await fetch('https://api.spotify.com/v1/me/player', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                
                // Si es 204, no hay reproductor activo
                if (response.status === 204) {
                    setPlayerState(null);
                    return;
                }

                // Solo intentar parsear JSON si la respuesta no es 204
                if (response.ok) {
                    const state = await response.json();
                    setPlayerState(state);

                    if (state) {
                        setIsPaused(!state.is_playing);
                        setProgress(state.progress_ms && state.item?.duration_ms
                            ? (state.progress_ms / state.item.duration_ms) * 100
                            : 0);
                        setPosition(state.progress_ms || 0);
                        setDuration(state.item?.duration_ms || 0);
                        setVolume((state.device?.volume_percent || 25) / 100);
                        setRepeatMode(state.repeat_state || "off");
                        setShuffleMode(state.shuffle_state || false);
                        setUseDevice(state.device || null);
                    }
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (err) {
                console.error('Error al obtener estado:', err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [authToken]);

    function formatTime(ms) {
        if (!ms || ms < 0) return '0:00';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n) => n.toString().padStart(2, '0');

        if (hours > 0) {
            return `${hours}:${pad(minutes)}:${pad(seconds)}`;
        }
        return `${minutes}:${pad(seconds)}`;
    }

    const getVolumeIcon = (volume) => {
        if (volume === 0) {
            return 'solar:volume-cross-outline';
        } else if (volume <= 0.3) {
            return 'solar:volume-outline';
        } else if (volume <= 0.7) {
            return 'solar:volume-small-outline';
        } else {
            return 'solar:volume-loud-outline';
        }
    };

    return (
        <>
            {playerState && playerState.item ? (
                <div className="bg-zinc-900 rounded-lg p-4"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "200px 1fr 180px",
                        alignItems: "center",
                        gap: "1rem"
                    }}>
                    <div className="flex items-center space-x-4 min-w-0 max-w-[200px] overflow-hidden">
                        <img
                            src={playerState.item.album.images[0].url}
                            alt={playerState.item.name}
                            className="w-12 h-12 rounded"
                        />
                        <div className="min-w-0">
                            <div className="text-white font-semibold truncate" title={playerState.item.name}>{playerState.item.name}</div>
                            <div className="text-gray-400 text-sm truncate" title={playerState.item.artists.map(a => a.name).join(', ')}>
                                {playerState.item.artists.map(a => a.name).join(', ')}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-2 justify-self-center w-full max-w-xl">
                        <div className="text-xs text-center text-cyan-500 mb-2">
                            Solo puedes visualizar el reproductor. Se requiere Spotify Premium para controlar la reproducción.
                        </div>
                        <div className="flex items-center space-x-4">
                            <button disabled className="opacity-50 cursor-not-allowed">
                                <iconify-icon icon="iconamoon:playlist-shuffle-duotone" width="24" height="24" 
                                    className={shuffleMode ? "text-cyan-500" : "text-white/60"} />
                            </button>
                            <button disabled className="opacity-50 cursor-not-allowed">
                                <iconify-icon icon="solar:skip-previous-bold" width="20" height="20" className="text-white/60" />
                            </button>
                            <button disabled className="opacity-50 cursor-not-allowed">
                                {isPaused ? (
                                    <iconify-icon icon="solar:play-bold" width="20" height="20" className="text-white/60" />
                                ) : (
                                    <iconify-icon icon="solar:pause-bold" width="20" height="20" className="text-white/60" />
                                )}
                            </button>
                            <button disabled className="opacity-50 cursor-not-allowed">
                                <iconify-icon icon="solar:skip-next-bold" width="20" height="20" className="text-white/60" />
                            </button>
                            <button disabled className="opacity-50 cursor-not-allowed">
                                <iconify-icon icon={repeatMode === "track" ? "ph:repeat-once-bold" : "ph:repeat-bold"} width="24" height="24" className={repeatMode === "off" ? "text-white/60" : "text-cyan-500"} />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 w-96">
                            <span className="text-xs text-gray-400 w-12 text-right">{formatTime(position)}</span>
                            <div className="flex-1 h-1 bg-gray-600 rounded overflow-hidden">
                                <div className="h-full bg-cyan-500 rounded" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-gray-400 w-12">{formatTime(duration)}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 justify-self-end">
                        <iconify-icon
                            icon={getVolumeIcon(volume)}
                            width="20"
                            height="20"
                            className="text-white"
                        />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            disabled
                            className="w-24 volume-slider opacity-50 cursor-not-allowed"
                            style={{
                                background: `linear-gradient(to right, #00b8db ${volume * 100}%, #4a5565 ${volume * 100}%)`
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-900 rounded-lg p-6 flex flex-col items-center justify-center text-center min-h-[120px]">
                    <div className="text-white text-lg font-semibold mb-2">Empieza a reproducir tu canción en Spotify</div>
                    <div className="text-gray-400 mb-4">Abre Spotify y comienza a reproducir cualquier canción para ver el reproductor aquí.</div>
                    <a
                        href="https://open.spotify.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                    >
                        Ir a Spotify
                    </a>
                </div>
            )}
        </>
    );
}