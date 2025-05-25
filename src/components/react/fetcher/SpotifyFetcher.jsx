import React, { useEffect } from "react";
import axios from "axios";
import { refreshAccessToken } from "@/hooks/utils";

export default function SpotifyFetcher({
  apiUrl,
  storageKey,
  spotifyClientId,
  spotifyClientSecret,
  params = { limit: 49 }
}) {
  useEffect(() => {
    const fetchData = async () => {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        console.error("No se encontró token de acceso.");
        return;
      }

      try {
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          params,
        });
        let items;
        if (apiUrl.includes("/me/following")) {
          items = response.data.artists?.items ?? [];
        } else {
          items = response.data.items ?? [];
        }
        console.log(`${storageKey} obtenidos:`, items);
        localStorage.setItem(storageKey, JSON.stringify(items));
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const newAccessToken = await refreshAccessToken(spotifyClientId, spotifyClientSecret);
          if (newAccessToken) {
            fetchData();
          } else {
            console.error("No se pudo obtener un nuevo token de acceso");
          }
        } else {
          console.error(`Error al obtener ${storageKey}:`, error);
        }
      }
    };

    fetchData();
  }, [apiUrl, storageKey, spotifyClientId, spotifyClientSecret, params]);

  return null;
}