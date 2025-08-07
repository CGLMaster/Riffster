
import React, { useEffect, useState } from "react";
import ArtistTrackList from "./ArtistTrackList";
import MainAlbumCard from "@/components/react/main/album/MainAlbumCard";
import spotifyFetch from "@/components/react/fetcher/spotifyFetch";

export default function ClientArtistMain({ id }) {
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    async function fetchAll() {
      try {
        const artistData = await spotifyFetch(`/artists/${id}`);
        const topTracksData = await spotifyFetch(`/artists/${id}/top-tracks`, { market: "ES" });
        const albumsData = await spotifyFetch(`/artists/${id}/albums`, { market: "ES", limit: 12 });
        if (!isMounted) return;
        setArtist(artistData);
        setTracks(topTracksData.tracks || []);
        setAlbums(albumsData.items || []);
      } catch (err) {
        setError("No se pudo cargar la información del artista.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) return <div className="text-center py-20 text-lg text-gray-400">Cargando artista...</div>;
  if (error) return <div className="text-center py-20 text-lg text-red-400">{error}</div>;
  if (!artist) return <div className="text-center py-20 text-lg text-red-400">Artista no encontrado.</div>;


  return (
    <div className="w-full">
      <ArtistHeader artist={artist} />
      <div className="px-4 md:px-8 flex flex-col xl:flex-row gap-10">
        <div className="flex-1">
          <ArtistTrackList tracks={tracks} />
        </div>
        <div className="w-full xl:w-96 flex-shrink-0 md:pl-8">
          <ArtistInfoPanel artist={artist} />
        </div>
      </div>
      <div className="px-4 md:px-8 mt-12">
        <h2 className="text-2xl font-bold mb-6">Discografía</h2>
        <ResponsiveAlbumGrid albums={albums} />
      </div>
    </div>
  );
}

function ArtistHeader({ artist }) {
  return (
    <div className="w-full min-h-[320px] bg-gradient-to-b from-cyan-900 to-[#18181b] relative flex items-end">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-end md:items-center px-4 md:px-8 pb-8 gap-8">
        <img
          src={artist.images?.[0]?.url}
          alt={artist.name}
          className="w-40 h-40 rounded-full object-cover shadow-2xl bg-black/30"
          style={{ minWidth: 120, minHeight: 120 }}
        />
        <div className="flex-1 min-w-0">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2 truncate">{artist.name}</h1>
          <div className="text-lg text-white/80 mb-2">{artist.followers?.total?.toLocaleString()} seguidores</div>
        </div>
      </div>
    </div>
  );
}

function ArtistInfoPanel({ artist }) {
  const isFollowing = true;
  return (
    <div className="bg-black/30 rounded-xl p-6 border border-zinc-800 shadow-lg flex flex-row sm:flex-col xl:flex-col gap-4 items-center relative justify-between">
      <div className="min-w-28 min-h-28 relative mb-2 me-5 sm:me-0 xl:me-0">
        <img
          src={artist.images?.[0]?.url}
          alt={artist.name}
          className="w-28 h-28 rounded-full object-cover shadow-lg"
        />
        {isFollowing && (
          <span className="absolute -bottom-2 -right-2 rounded-full bg-cyan-900 border-4 border-[#111113] w-10 h-10 flex items-center justify-center shadow-md">
            <iconify-icon icon="mdi:heart" width="20" height="20" className="text-white" />
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-lg font-bold text-white text-start sm:text-center xl:text-center">{artist.name}</div>
        <div className="text-white/80 text-start sm:text-center xl:text-center">{artist.followers?.total?.toLocaleString()} seguidores</div>
        <div className="text-white/70 text-start sm:text-center xl:text-center">Popularidad: {artist.popularity}/100</div>
        {artist.genres?.length > 0 && (
          <div className="text-white/60 text-start sm:text-center xl:text-center">{artist.genres.join(", ")}</div>
        )}
      </div>
    </div>
  );
}


function ResponsiveAlbumGrid({ albums }) {
  const [columns, setColumns] = useState(2);
  const gridRef = React.useRef(null);

  React.useEffect(() => {
    function updateColumns() {
      if (!gridRef.current) return;
      const width = gridRef.current.offsetWidth;
      const cols = Math.max(2, Math.floor(width / 196));
      setColumns(cols);
    }
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return (
    <div ref={gridRef} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: 16 }}>
      {albums.map(album => (
        <MainAlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
