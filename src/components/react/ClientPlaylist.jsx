import{ useEffect, useState } from "react";
import AsideMenuCard from "@/react/AsideMenuCard.jsx";

export default function ClientPlaylistList() {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const playlistsJSON = localStorage.getItem("playlists");
    if (playlistsJSON) {
      try {
        const parsed = JSON.parse(playlistsJSON);
        console.log("Playlists:", parsed);
        setPlaylists(parsed);
      } catch (e) {
        console.error("Error parseando playlists:", e);
      }
    }
  }, []);

  return (
    <ul id="playlist-list">
      {playlists.map((playlist) => (
        <>
        {console.log("Playlist:", playlist)}
        <AsideMenuCard key={playlist.id} playlist={playlist} />
        </>
      ))}
    </ul>
  );
}
