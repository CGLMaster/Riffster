import React, { useEffect } from "react";
import axios from "axios";
import { refreshAccessToken } from "@/hooks/utils";

export default function PlaylistFetcher({spotifyClientId, spotifyClientSecret}) {
  useEffect(() => {
    const fetchPlaylists = async () => {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        console.error("No se encontró token de acceso.");
        return;
      }

      try {
        const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: { limit: 20 },
        });
        console.log("Playlists obtenidas:", response.data.items);
        localStorage.setItem("playlists", JSON.stringify(response.data.items));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("Refresh Token")
          console.log(spotifyClientId)
          const newAccessToken = await refreshAccessToken(spotifyClientId, spotifyClientSecret);
          if (newAccessToken) {
            fetchPlaylists();
          } else {
            console.error("No se pudo obtener un nuevo token de acceso");
          }
        } else {
          console.error("Error al obtener playlists:", error);
        }
      }
    };

    fetchPlaylists();
  }, []);

  return null;
}
