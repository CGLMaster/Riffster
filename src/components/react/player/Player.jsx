import React, { useCallback, useEffect, useState } from 'react';
import {
    WebPlaybackSDK,
    useSpotifyPlayer,
    usePlaybackState,
    usePlayerDevice,
    useErrorState
} from 'react-spotify-web-playback-sdk';
import { refreshAccessToken } from '@/hooks/utils';
import { useSpotifyAutoConnectPlayer, getSpotifyPlayerState } from "@/hooks/useSpotifyAutoConnectPlayer";
import '@/styles/player/player.css';

export default function Player({ spotifyClientId, spotifyClientSecret }) {
    const [authToken, setAuthToken] = useState(null);
    const [authError, setAuthError] = useState(null);
    const getOAuthToken = useCallback(cb => cb(authToken), [authToken]);

    useEffect(() => {
        let mounted = true;
        async function loadToken() {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) throw new Error('No hay token en localStorage');
                if (mounted) setAuthToken(token);
            } catch {
                try {
                    const newToken = await refreshAccessToken(spotifyClientId, spotifyClientSecret);
                    if (!newToken) throw new Error('No se pudo refrescar token');
                    localStorage.setItem('access_token', newToken);
                    if (mounted) setAuthToken(newToken);
                } catch (err) {
                    if (mounted) setAuthError(err.message);
                }
            }
        }
        loadToken();
        return () => { mounted = false; };
    }, [spotifyClientId, spotifyClientSecret]);

    if (authError) {
        return <div className="p-4 text-center text-white">Auth Error: {authError}</div>;
    }
    if (!authToken) {
        return <div className="p-4 text-center text-gray-400">Obteniendo token...</div>;
    }

    return (
        <WebPlaybackSDK
            initialDeviceName="Riffter Player"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
            connectOnInitialized={true}
        >
            <PlayerUI authToken={authToken} spotifyClientId={spotifyClientId} spotifyClientSecret={spotifyClientSecret} />
        </WebPlaybackSDK>
    );
}

function PlayerUI({ authToken, spotifyClientId, spotifyClientSecret }) {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();
    const device = usePlayerDevice();
    const error = useErrorState();

    const [isPaused, setIsPaused] = useState(playbackState?.paused);
    const [optimisticPaused, setOptimisticPaused] = useState(null);
    const [progress, setProgress] = useState(0);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [lastVolumeChange, setLastVolumeChange] = useState(0);
    const [optimisticVolume, setOptimisticVolume] = useState(null);
    const [repeatMode, setRepeatMode] = useState("off");
    const [shuffleMode, setShuffleMode] = useState(false);
    const [playerState, setPlayerState] = useState(null);

    useSpotifyAutoConnectPlayer(authToken, device?.device_id);

    useEffect(() => {
        if (!authToken) return;
        let interval = setInterval(async () => {
            const state = await getSpotifyPlayerState(
                authToken,
                () => refreshAccessToken(spotifyClientId, spotifyClientSecret)
            );
            setPlayerState(state);

            if (state) {
                if (optimisticPaused !== null) {
                    if (state.is_playing === !optimisticPaused) {
                        setOptimisticPaused(null);
                    }
                }
                setIsPaused(!state.is_playing);
                setProgress(state.progress_ms && state.item?.duration_ms
                    ? (state.progress_ms / state.item.duration_ms) * 100
                    : 0);
                setPosition(state.progress_ms || 0);
                setDuration(state.item?.duration_ms || 0);
                let apiVolume = state.device?.volume_percent;
                if (typeof apiVolume !== "number" || isNaN(apiVolume)) apiVolume = 50;
                const apiVolumeNormalized = apiVolume / 100;
                if (optimisticVolume !== null) {
                    if (Math.abs(apiVolumeNormalized - optimisticVolume) < 0.01) {
                        setOptimisticVolume(null);
                    }
                }
                if (optimisticVolume === null && Date.now() - lastVolumeChange > 1200) {
                    setVolume(apiVolumeNormalized);
                }
                setRepeatMode(state.repeat_state || "off");
                setShuffleMode(state.shuffle_state || false);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [authToken, lastVolumeChange, spotifyClientId, spotifyClientSecret]);

    if (error) {
        return <div className="p-4 text-center text-white">Error: {error.message}</div>;
    }

    if (!playbackState || !playbackState.track_window?.current_track) {
        return <div className="p-4 text-center text-gray-400">Conectando al reproductor...</div>;
    }

    const { current_track } = playbackState.track_window;

    const handlePlayPause = async () => {
        try {
            if (isPaused) {
                setOptimisticPaused(false);
                await fetch("https://api.spotify.com/v1/me/player/play", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            } else {
                setOptimisticPaused(true);
                await fetch("https://api.spotify.com/v1/me/player/pause", {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            }
        } catch (err) {
            setOptimisticPaused(null);
            console.error("Error al pausar/reanudar la reproducción:", err);
        }
    };

    const pausedToShow = optimisticPaused !== null ? optimisticPaused : isPaused;

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

    const handleVolumeChange = async (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setOptimisticVolume(newVolume);
        setLastVolumeChange(Date.now());
        try {
            await fetch(
                `https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(newVolume * 100)}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
        } catch (err) {
            console.error("Error al cambiar el volumen:", err);
        }
    };

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

    const handleShuffleClick = async () => {
        try {
            await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${!shuffleMode}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setShuffleMode(!shuffleMode);
        } catch (err) {
            console.error("Error al cambiar el modo de mezclado:", err);
        }
    };
    const handleRepeatClick = async () => {
        const nextMode = repeatMode === "off" ? "context" : repeatMode === "context" ? "track" : "off";
        try {
            await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${nextMode}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setRepeatMode(nextMode);
        } catch (err) {
            console.error("Error al cambiar el modo de repetición:", err);
        }
    };
    const handleNextTrack = async () => {
        try {
            await fetch("https://api.spotify.com/v1/me/player/next", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        } catch (err) {
            console.error("Error al pasar a la siguiente canción:", err);
        }
    };

    const handlePreviousTrack = async () => {
        try {
            await fetch("https://api.spotify.com/v1/me/player/previous", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        } catch (err) {
            console.error("Error al volver a la canción anterior:", err);
        }
    };

    return (
        <div
            className="bg-zinc-900 rounded-lg p-4"
            style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 180px",
                alignItems: "center",
                gap: "1rem"
            }}
        >
            <div className="flex items-center space-x-4 min-w-0 max-w-[200px] overflow-hidden">
                <img
                    src={current_track.album.images[0].url}
                    alt={current_track.name}
                    className="w-12 h-12 rounded"
                />
                <div className="min-w-0">
                    <div className="text-white font-semibold truncate">{current_track.name}</div>
                    <div className="text-gray-400 text-sm truncate">
                        {current_track.artists.map(a => a.name).join(', ')}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-2 justify-self-center w-full max-w-xl">
                <div className="flex items-center space-x-4">
                    <button onClick={handleShuffleClick} className="hover:cursor-pointer" title="Mezclar">
                        <iconify-icon icon={"iconamoon:playlist-shuffle-duotone"} width="24" height="24" className={shuffleMode ? "text-green-500" : "text-white/60"} />
                    </button>
                    <button onClick={handlePreviousTrack} className="hover:cursor-pointer">
                        <iconify-icon icon="solar:skip-previous-bold" width="20" height="20" className="text-white/60 hover:text-white" />
                    </button>
                    <button onClick={handlePlayPause} className="hover:cursor-pointer">
                        {pausedToShow ? (
                            <iconify-icon icon="solar:play-bold" width="20" height="20" className="text-white/60 hover:text-white" />
                        ) : (
                            <iconify-icon icon="solar:pause-bold" width="20" height="20" className="text-white/60 hover:text-white" />
                        )}
                    </button>
                    <button onClick={handleNextTrack} className="hover:cursor-pointer">
                        <iconify-icon icon="solar:skip-next-bold" width="20" height="20" className="text-white/60 hover:text-white" />
                    </button>
                    <button onClick={handleRepeatClick} className="hover:cursor-pointer" title="Repetir">
                        <iconify-icon icon={repeatMode === "track" ? "ph:repeat-once-bold" : "ph:repeat-bold"} width="24" height="24" className={repeatMode === "off" ? "text-white/60" : "text-green-500"} />
                    </button>
                </div>
                <div className="flex items-center space-x-2 w-96">
                    <span className="text-xs text-gray-400 w-12 text-right">{formatTime(position)}</span>
                    <div className="flex-1 h-1 bg-gray-600 rounded overflow-hidden">
                        <div className="h-full bg-green-500 rounded" style={{ width: `${progress}%` }} />
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
                    onChange={handleVolumeChange}
                    className="w-24 volume-slider"
                    style={{
                        background: `linear-gradient(to right, #00c951 ${volume * 100}%, #4a5565 ${volume * 100}%)`
                    }}
                />
            </div>
        </div>
    );
}

