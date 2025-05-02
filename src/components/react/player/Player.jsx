import React, { useCallback, useEffect, useState } from 'react';
import {
    WebPlaybackSDK,
    useSpotifyPlayer,
    usePlaybackState,
    usePlayerDevice,
    useErrorState
} from 'react-spotify-web-playback-sdk';
import { refreshAccessToken } from '@/hooks/utils';
import { useSpotifyAutoConnectPlayer } from "@/hooks/useSpotifyAutoConnectPlayer";

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
            <PlayerUI authToken={authToken} />
        </WebPlaybackSDK>
    );
}

function PlayerUI({ authToken }) {
    const player = useSpotifyPlayer();
    const playbackState = usePlaybackState();
    const device = usePlayerDevice();
    const error = useErrorState();

    const [isPaused, setIsPaused] = useState(playbackState?.paused);
    const [progress, setProgress] = useState(0);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useSpotifyAutoConnectPlayer(authToken, device?.device_id);

    useEffect(() => {
        if (playbackState) {
            setIsPaused(playbackState.paused);
            setDuration(playbackState.duration || 0);
        }
    }, [playbackState]);

    useEffect(() => {
        if (!player) return;

        const interval = setInterval(async () => {
            const state = await player.getCurrentState();
            if (state) {
                setPosition(state.position);
                setDuration(state.duration);
                setProgress((state.position / state.duration) * 100);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [player]);

    if (error) {
        return <div className="p-4 text-center text-white">Error: {error.message}</div>;
    }

    if (!playbackState || !playbackState.track_window?.current_track) {
        return <div className="p-4 text-center text-gray-400">Conectando al reproductor...</div>;
    }

    const { current_track } = playbackState.track_window;

    const handlePlayPause = () => {
        if (isPaused) {
            player.resume();
        } else {
            player.pause();
        }
    };

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

    return (
        <div className="flex items-center justify-between bg-zinc-900 rounded-lg p-4">
            <div className="flex items-center space-x-4">
                <img
                    src={current_track.album.images[0].url}
                    alt={current_track.name}
                    className="w-12 h-12 rounded"
                />
                <div>
                    <div className="text-white font-semibold">{current_track.name}</div>
                    <div className="text-gray-400 text-sm">
                        {current_track.artists.map(a => a.name).join(', ')}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-4">
                    <button onClick={() => player.previousTrack()} className="text-white hover:text-green-500">
                        <iconify-icon icon="solar:skip-previous-bold" width="20" height="20" className="text-white/60" />
                    </button>
                    <button onClick={handlePlayPause} className="text-white hover:text-green-500">
                        {isPaused ? (
                            <iconify-icon icon="solar:play-bold" width="20" height="20" className="text-white/60" />
                        ) : (
                            <iconify-icon icon="solar:pause-bold" width="20" height="20" className="text-white/60" />
                        )}
                    </button>
                    <button onClick={() => player.nextTrack()} className="text-white hover:text-green-500">
                        <iconify-icon icon="solar:skip-next-bold" width="20" height="20" className="text-white/60" />
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
            <div className="flex items-center space-x-2">
                <iconify-icon icon="solar:volume-bold" width="20" height="20" className="text-white" />
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={(playbackState.volume ?? 0.5).toFixed(2)}
                    onChange={e => player.setVolume(parseFloat(e.target.value))}
                    className="w-24"
                />
            </div>
        </div>
    );
}

