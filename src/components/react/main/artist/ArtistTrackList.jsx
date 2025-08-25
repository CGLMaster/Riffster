import { useState } from "react";
import { useCurrentTrackId } from "@/hooks/useCurrentTrackId";
import ModalPremiumAlert from "@/components/react/main/global/ModalPremiumAlert";
import { SpotifyService } from "@/services/spotify.service";


export default function ArtistTrackList({ tracks }) {
  const [showAll, setShowAll] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const access_token = localStorage.getItem("access_token");
  const currentTrackId = useCurrentTrackId(access_token, 1000);
  const visibleTracks = showAll ? tracks.slice(0, 10) : tracks.slice(0, 5);

  const playTrack = async (trackId) => {
    try {
      await SpotifyService.playTrack(`spotify:track:${trackId}`);
    } catch (err) {
      if (err.response?.status === 403) {
        setShowPremiumAlert(true);
      }
      console.error("Error al reproducir la canción:", err);
    }
  };

  return (
    <div>
      <ModalPremiumAlert open={showPremiumAlert} onClose={() => setShowPremiumAlert(false)} />
      <div className="font-bold text-2xl mb-4">Populares</div>
      <div className="w-full flex flex-col gap-1">
        {visibleTracks.map((track, i) => {
          const isCurrent = track.id === currentTrackId;
          return (
            <div
              key={track.id}
              className={`grid grid-cols-[30px_1.5fr_1.5fr_1fr_60px] items-center gap-2 p-2 rounded-md relative group transition ${isCurrent ? "bg-white/20" : "hover:bg-gray-800"}`}
            >
              <div className="flex items-center justify-start relative">
                <div className="group-hover:hidden">{i + 1}</div>
                <div
                  className="hidden group-hover:flex absolute inset-0 items-center justify-start bg-white/5 rounded-md cursor-pointer"
                  onClick={() => playTrack(track.id)}
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
                  <div className="font-medium truncate text-white" title={track.name}>{track.name}</div>
                  <div className="text-white/60 truncate" title={track.artists.map((a) => a.name).join(", ")}>
                    {track.artists.map((a) => a.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="truncate pl-2 text-white/60" title={track.album.name}>{track.album.name}</div>
              <div className="text-right text-white/60"></div>
              <div className="text-right text-white/60">{msToMinSec(track.duration_ms)}</div>
            </div>
          );
        })}
      </div>
      {tracks.length > 5 && (
        <div className="mt-2 text-right">
          <button
            className="text-sm hover:underline focus:outline-none px-4 py-1 rounded text-white/60 hover:text-white cursor-pointer"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? "Ver menos" : "Ver más"}
          </button>
        </div>
      )}
    </div>
  );
}

function msToMinSec(ms) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000).toString().padStart(2, "0");
  return `${min}:${sec}`;
}
