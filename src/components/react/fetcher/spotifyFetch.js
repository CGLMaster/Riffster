import axios from "axios";
import { refreshAccessToken } from "@/hooks/utils";

export default async function spotifyFetch(endpoint, params = {}, spotifyClientId, spotifyClientSecret) {
  let access_token = localStorage.getItem("access_token");
  if (!access_token) throw new Error("No se encontró token de acceso.");

  const baseUrl = "https://api.spotify.com/v1";
  let url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      const newAccessToken = await refreshAccessToken(spotifyClientId, spotifyClientSecret);
      if (newAccessToken) {
        localStorage.setItem("access_token", newAccessToken);
        const retryResponse = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
          params,
        });
        return retryResponse.data;
      }
    }
    throw error;
  }
}
