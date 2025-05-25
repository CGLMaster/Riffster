import { useEffect, useState } from "react";

export function usePlaylists() {
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

  return playlists;
}

export function useAlbums() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const albumsJSON = localStorage.getItem("albums");
    if (albumsJSON) {
      try {
        const parsed = JSON.parse(albumsJSON);
        console.log("Albums:", parsed);
        setAlbums(parsed);
      } catch (e) {
        console.error("Error parseando Albums:", e);
      }
    }
  }, []);

  return albums;
}

export function useArtist() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const artistsJSON = localStorage.getItem("artists");
    if (artistsJSON) {
      try {
        const parsed = JSON.parse(artistsJSON);
        console.log("Artistas:", parsed);
        setArtists(parsed);
      } catch (e) {
        console.error("Error parseando Artistas:", e);
      }
    }
  }, []);

  return artists;
}
export function useTopArtist() {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const topArtistsJSON = localStorage.getItem("topArtists");
    if (topArtistsJSON) {
      try {
        const parsed = JSON.parse(topArtistsJSON);
        console.log("Top Artistas:", parsed);
        setTopArtists(parsed);
      } catch (e) {
        console.error("Error parseando Top Artistas:", e);
      }
    }
  }, []);

  return topArtists;
}

export const refreshAccessToken = async (clientId, clientSecret) => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
      console.error("No se encontró refresh token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
  }

  const url = "https://accounts.spotify.com/api/token";
  const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
  });

  if (clientSecret) {
      params.append("client_secret", clientSecret);
  }

  const payload = {
      method: "POST",
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
  };

  try {
      const res = await fetch(url, payload);
      if (!res.ok) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      if (!data.access_token) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return null;
      }

      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
      }
      console.log("Token actualizado exitosamente");
      return data.access_token;
  } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      console.error("Error al refrescar token:", error);
      return null;
  }
};

