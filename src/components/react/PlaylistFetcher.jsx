import React, { useEffect } from "react";
import axios from "axios";

export default function PlaylistFetcher() {
  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      axios
        .get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params: { limit: 20 },
        })
        .then((response) => {
          console.log("Playlists obtenidas:", response.data.items);
          localStorage.setItem("playlists", JSON.stringify(response.data.items));
        })
        .catch((error) => {
          console.error("Error al obtener playlists:", error);
        });
    }
  }, []);

  return null;
}
