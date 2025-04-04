import MainPlaylistCard from "@/react/main/MainPlaylistCard.jsx";
import { usePlaylists } from "@/hooks/utils.jsx";

export default function ClientPlaylistMain() {
  const playlists = usePlaylists();

  return (
    <ul id="playlist-list" className="flex gap-4">
      {playlists.map((playlist) => (
        <MainPlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </ul>
  );
}

