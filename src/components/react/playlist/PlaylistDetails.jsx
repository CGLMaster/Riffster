import React, { useEffect, useState } from "react";
import PlaylistList from "@/react/playlist/PlaylistList";
import { refreshAccessToken } from "@/hooks/utils";
import Loader from "@/react/playlist/Loader";

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
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
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

  if (isLoading || !playlist) return <Loader />;

  const trackCount = allTracks.length;

  const totalDurationMs = allTracks.reduce((sum, item) => sum + item.track.duration_ms, 0);
  const totalSeconds = Math.floor(totalDurationMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const time = totalHours > 0 ? `${totalHours}h ${remainingMinutes}m` : `${totalMinutes}m`;

  return (
    <div className="relative h-full overflow-hidden min-w-[570px] flex flex-col">
      <div className="relative z-10 bg-gradient-to-b bg-cyan-900 flex-shrink-0">
        <div className="px-6 pt-10 flex items-end gap-5 pb-6">
          <img
            src={playlist.images[0]?.url}
            alt="Playlist cover"
            className="object-cover w-[15%] h-[15%] rounded-md shadow-xl shadow-black/40"
          />
          <div className="flex flex-col">
            <h4 className="text-[1rem] font-[400] text-white/80">
              {playlist.public ? "Lista pública" : "Lista Privada"}
            </h4>
            <h1 className="text-[5vw] font-bold sm:text-[40px] md:text-[50px] lg:text-[60px] xl:text-[70px]">
                {playlist.name}
            </h1>
            <h4 className="text-[1rem] text-white/80">
              <b className="text-white">{playlist.owner.display_name}</b> • {trackCount} canciones, {time}
            </h4>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <PlaylistList allTracks={allTracks} playlistId={id} />
      </div>
    </div>
  );
}
