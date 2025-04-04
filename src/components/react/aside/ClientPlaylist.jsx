import AsideMenuCard from "@/components/react/aside/AsideMenuCard.jsx";
import { usePlaylists } from "@/hooks/utils.jsx";

export default function ClientPlaylistList() {
  const playlists = usePlaylists();

  return (
    <ul id="playlist-list">
      {playlists.map((playlist) => (
        <AsideMenuCard key={playlist.id} playlist={playlist} />
      ))}
    </ul>
  );
}

