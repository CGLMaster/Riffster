import { useCallback, useEffect, useState } from 'react';
import {
    WebPlaybackSDK,
} from 'react-spotify-web-playback-sdk';
import { refreshAccessToken } from '@/hooks/utils';
import '@/styles/player/player.css';
import PlayerUI from './PlayerUI/PlayerUI.jsx';
import PlayerNoPremiumUI from './PlayerUI/PlayerNoPremiumUI.jsx';

export default function Player({ spotifyClientId, spotifyClientSecret }) {
    const [authToken, setAuthToken] = useState(null);
    const [authError, setAuthError] = useState(null);
    const [isPremium, setIsPremium] = useState(false);
    const [isPremiumChecked, setIsPremiumChecked] = useState(false);
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

    useEffect(() => {
        if (!authToken) return;

        async function checkPremium() {
            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
                const data = await response.json();
                setIsPremium(data.product === 'premium');
            } catch (err) {
                console.error('Error verificando estado Premium:', err);
                setIsPremium(false);
            } finally {
                setIsPremiumChecked(true);
            }
        }

        checkPremium();
    }, [authToken]);

    if (authError) {
        return <div className="p-4 text-center text-white">Auth Error: {authError}</div>;
    }
    if (!authToken || !isPremiumChecked) {
        return <div className="p-4 text-center text-gray-400">Cargando reproductor...</div>;
    }

    return isPremium ? (
        <WebPlaybackSDK
            initialDeviceName="Riffter Player"
            getOAuthToken={getOAuthToken}
            initialVolume={0.5}
        >
            <PlayerUI
                authToken={authToken}
                spotifyClientId={spotifyClientId}
                spotifyClientSecret={spotifyClientSecret}
            />
        </WebPlaybackSDK>
    ) : (
        <PlayerNoPremiumUI
            authToken={authToken}
        />
    );
}
