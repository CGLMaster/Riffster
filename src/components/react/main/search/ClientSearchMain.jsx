import { useState, useEffect, useCallback } from 'react';
import load from 'lodash';
import spotifyFetch from '@/components/react/fetcher/spotifyFetch';
import GridSection from '@/components/react/main/global/GridSection';
import MainArtistCard from '@/components/react/main/artist/MainArtistCard';
import MainPlaylistCard from '@/components/react/main/playlist/MainPlaylistCard';
import TrackCard from '@/components/react/main/global/TrackCard.jsx';
import ModalPremiumAlert from '@/components/react/main/global/ModalPremiumAlert';

function ClientSearchMain() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState({
        tracks: [],
        artists: [],
        albums: [],
        playlists: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPremiumAlert, setShowPremiumAlert] = useState(false);

    const performSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults({
                tracks: [],
                artists: [],
                albums: [],
                playlists: []
            });
            return;
        }

        setIsLoading(true);
        try {
            const spotifyClientId = import.meta.env.PUBLIC_SPOTIFY_CLIENT_ID;
            const spotifyClientSecret = import.meta.env.PUBLIC_SPOTIFY_CLIENT_SECRET;
            const response = await spotifyFetch(
                `/search`,
                { q: query, type: 'track,artist,album,playlist', limit: 20 },
                spotifyClientId,
                spotifyClientSecret
            );
            setSearchResults({
                tracks: response.tracks?.items?.filter(Boolean) || [],
                artists: response.artists?.items?.filter(Boolean) || [],
                albums: response.albums?.items?.filter(Boolean) || [],
                playlists: response.playlists?.items?.filter(Boolean) || []
            });

            console.log('Search results:', response);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedSearch = useCallback(
        load.debounce((query) => performSearch(query), 500),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);

    const getImage = (obj) => {
        if (!obj) return '/assets/img/riffter_logo.png';
        if (Array.isArray(obj.images) && obj.images.length > 0 && obj.images[0]?.url) return obj.images[0].url;
        return '/assets/img/riffter_logo.png';
    };

    const playTrack = async (trackUri) => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;
        try {
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers:
                {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uris: [trackUri], position_ms: 0 }),
            });
            if (response.status === 403) {
                setShowPremiumAlert(true);
            }
        } catch (err) {
            setShowPremiumAlert(true);
            console.error("Error al reproducir la canción:", err);
        }
    };

    return (
        <div style={{ height: '100%' }}>
            <ModalPremiumAlert open={showPremiumAlert} onClose={() => setShowPremiumAlert(false)} />
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="¿Qué quieres escuchar?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-4 py-2 text-white bg-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>

            {(!searchTerm || searchTerm.trim().length === 0) && (
                <div className="flex flex-col items-center justify-center h-[60vh] w-full">
                    <img
                        src="/src/assets/img/riffter_search.png"
                        alt="Buscar en Riffster"
                        className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mb-6 max-w-full object-contain"
                    />
                    <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-semibold text-center max-w-xs sm:max-w-md md:max-w-lg px-2">
                        ¡Empieza a buscar tu música favorita, artistas, álbumes o playlists y descubre todo lo que Riffster puede encontrar para ti!
                    </p>
                </div>
            )}

            {searchTerm && searchTerm.trim().length > 0 && (
                isLoading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        <GridSection
                            title="Canciones"
                            items={searchResults.tracks}
                            CardComponent={({ item }) => (
                                <TrackCard item={item} onPlay={playTrack} />
                            )}
                            itemPropName="item"
                            minCardWidth={180}
                            showCount={1}
                        />
                        <GridSection
                            title="Artistas"
                            items={searchResults.artists}
                            CardComponent={MainArtistCard}
                            itemPropName="artist"
                        />
                        <GridSection
                            title="Álbumes"
                            items={searchResults.albums}
                            CardComponent={({ item }) => (
                                <a
                                    href={item.external_urls?.spotify}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="playlist-item flex flex-col w-44 relative p-2 overflow-hidden gap-2 rounded-md hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 transition-all duration-300"
                                >
                                    <div className="w-full aspect-square overflow-hidden rounded-md">
                                        <img
                                            src={getImage(item)}
                                            alt={item.name}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div className="flex flex-col px-2">
                                        <h4 className="truncate">{item.name}</h4>
                                        <span className="text-sm text-gray-400">{item.artists[0]?.name}</span>
                                    </div>
                                </a>
                            )}
                            itemPropName="item"
                        />
                        <GridSection
                            title="Playlists"
                            items={searchResults.playlists}
                            CardComponent={MainPlaylistCard}
                            itemPropName="playlist"
                        />
                    </div>
                )
            )}
        </div>
    );
}

export default ClientSearchMain;
