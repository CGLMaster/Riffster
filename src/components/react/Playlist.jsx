import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tracksByPlaylist, setTracksByPlaylist] = useState({});

    useEffect(() => {
        const access_token = localStorage.getItem("access_token");

        if (access_token) {
            axios
                .get("https://api.spotify.com/v1/me/playlists", {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                    params: {
                        limit: 20,
                    },
                })
                .then((response) => {
                    console.log("Playlists:", response.data.items);
                    setPlaylists(response.data.items);
                    localStorage.setItem("playlists", JSON.stringify(response.data.items));
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error al obtener playlists:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const fetchTracks = (playlist) => {
        const access_token = localStorage.getItem("access_token");
        if (!access_token) return;

        axios
            .get(playlist.tracks.href, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                params: {
                    limit: 100,
                },
            })
            .then((response) => {
                console.log("Canciones:", response.data.items);
                setTracksByPlaylist((prev) => ({
                    ...prev,
                    [playlist.id]: response.data.items,
                }));
            })
            .catch((error) => {
                console.error("Error al obtener tracks:", error);
            });
    };

    if (loading) {
        return <div>Cargando playlists...</div>;
    }

    return (
        <div>
            <h1>Mis Playlists</h1>
            {playlists.length > 0 ? (
                <ul>
                    {playlists.map((playlist) => (
                        <li key={playlist.id}>
                            <h3>{playlist.name}</h3>
                            {playlist.images && playlist.images[0] && (
                                <img
                                    src={playlist.images[0].url}
                                    alt={playlist.name}
                                    width="200"
                                />
                            )}
                            <p>{playlist.description || "Sin descripción"}</p>
                            <button onClick={() => fetchTracks(playlist)}>
                                Mostrar canciones
                            </button>
                            {tracksByPlaylist[playlist.id] && (
                                <ul>
                                    {tracksByPlaylist[playlist.id].map((trackItem) => {
                                        const track = trackItem.track;
                                        return (
                                            <li key={track.id}>
                                                {track.name} -{" "}
                                                {track.artists.map((artist) => artist.name).join(", ")}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No se encontraron playlists.</p>
            )}
        </div>
    );
}
