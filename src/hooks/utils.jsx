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

export const refreshAccessToken = async (clientId, clientSecret) => {
  const refreshToken = localStorage.getItem("refresh_token");
  console.log("Refresh token:", refreshToken);
  console.log("ClientID:", clientId);
  console.log("ClientSecret:", clientSecret);
  if (!refreshToken) {
      console.error("No se encontró refresh token");
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
          throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);
      if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
      }
      console.log("Token actualizado exitosamente");
      return data.access_token;
  } catch (error) {
      console.error("Error al refrescar token:", error);
      return null;
  }
};

