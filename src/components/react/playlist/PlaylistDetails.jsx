import React, { useEffect, useState } from "react";
import PlaylistList from "@/react/playlist/PlaylistList";
import { refreshAccessToken } from "@/hooks/utils";

export default function PlaylistDetails({id, spotifyClientId, spotifyClientSecret}) {
  const [playlist, setPlaylist] = useState(null);
  const [allTracks, setAllTracks] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      setError("No token disponible");
      return;
    }

    const fetchAllTracks = async (url, accumulatedTracks = []) => {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (response.status === 401) {
          console.log("Refresh Token");
          console.log(spotifyClientId)
          const newAccessToken = await refreshAccessToken(spotifyClientId, spotifyClientSecret);
          if (newAccessToken) {
            return fetchData(url, newAccessToken);
          } else {
            setError("No se pudo obtener un nuevo token");
            return;
          }
        }

        const data = await response.json();

        if (data.error) {
          setError(data.error.message);
          return;
        }

        const newTracks = accumulatedTracks.concat(data.items);

        if (data.next) {
          fetchAllTracks(data.next, newTracks);
        } else {
          setAllTracks(newTracks);
          setIsLoading(false);
        }
      } catch (err) {
        setError("Error de red: " + err.message);
      }
    };

    fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error.message);
        } else {
          setPlaylist(data);
          fetchAllTracks(data.tracks.href);
        }
      })
      .catch((err) => {
        setError("Error de red: " + err.message);
      });
  }, [id]);

  if (error) return <div>Error: {error}</div>;

  if (isLoading || !playlist) return <div>Cargando...</div>;

  const trackCount = allTracks.length;

  const totalDurationMs = allTracks.reduce((sum, item) => sum + item.track.duration_ms, 0);
  const totalSeconds = Math.floor(totalDurationMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  let time;
  if (totalHours >= 24) {
    time = "Más de 24h";
  } else if (totalHours >= 10) {
    time = `${totalHours}h aproximadamente`;
  } else if (totalHours >= 1) {
    if (remainingMinutes >= 45) {
      time = `${totalHours + 1}h aproximadamente`;
    } else if (remainingMinutes >= 30) {
      time = `${totalHours}h 30min aproximadamente`;
    } else if (remainingMinutes >= 15) {
      time = `${totalHours}h 15min aproximadamente`;
    } else {
      time = `${totalHours}h aproximadamente`;
    }
  } else {
    time = `${totalMinutes} min ${totalSeconds % 60} seg`;
  }

  return (
    <div className="relative playlist-scroll h-full overflow-y-auto min-w-[570px]">
      <div className="relative z-10 bg-gradient-to-b from-[#942a2a] to-[#530f0f]">
        <div className="px-6 pt-10 flex items-end gap-5 pb-6">
          <img
            src={playlist.images[0]?.url}
            alt="Playlist cover"
            className="object-cover w-[23%] h-[23%] rounded-md shadow-xl shadow-black/40"
          />
          <div className="flex flex-col">
            {/* Cambié los tamaños con clamp() */}
            <h4 className="text-[1rem] font-[400]">
              {playlist.public ? "Lista pública" : "Lista Privada"}
            </h4>
            <h1 className="text-[5vw] font-bold sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px]">
                {playlist.name}
            </h1>
            <h4 className="text-[1rem]">
              <b>{playlist.owner.display_name}</b> • {trackCount} canciones, {time}
            </h4>
          </div>
        </div>
      </div>
      <PlaylistList allTracks={allTracks} />
      <style>{`
        .playlist-scroll {
          position: relative; /* Asegura que el scroll se posicione correctamente sobre el contenido */
        }
        .playlist-scroll::-webkit-scrollbar {
          width: 10px;
          z-index: 1000; /* Asegura que el scrollbar esté sobre el contenido, pero sin cortar el fondo */
        }
        .playlist-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .playlist-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 0px;
        }
        .playlist-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
