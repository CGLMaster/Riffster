import axios from "axios";
import { refreshAccessToken } from "@/hooks/utils";

export default async function spotifyFetch(endpoint, options = {}, spotifyClientId, spotifyClientSecret) {
  let access_token = localStorage.getItem("access_token");
  if (!access_token) throw new Error("No se encontró token de acceso.");

  const baseUrl = "https://api.spotify.com/v1";
  let url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  try {
    const isOptionsObject = options.method || options.body;
    const method = isOptionsObject ? options.method || 'GET' : 'GET';
    const params = isOptionsObject ? (method === 'GET' ? options.params : undefined) : options;
    
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      }
    };

    if (params && Object.keys(params).length > 0) {
      config.params = params;
    }

    if (isOptionsObject && options.body && method !== 'GET') {
      config.data = options.body;
    }

    const response = await axios(config);
    return method === 'GET' ? response.data : response;
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken(spotifyClientId, spotifyClientSecret);
        if (newAccessToken) {
          localStorage.setItem("access_token", newAccessToken);
          
          const config = {
            method,
            url,
            headers: {
              'Authorization': `Bearer ${newAccessToken}`,
              'Content-Type': 'application/json',
            }
          };

          if (params && Object.keys(params).length > 0) {
            config.params = params;
          }

          if (isOptionsObject && options.body && method !== 'GET') {
            config.data = options.body;
          }

          const retryResponse = await axios(config);
          return method === 'GET' ? retryResponse.data : retryResponse;
        }
      } catch (retryError) {
        throw retryError;
      }
    }
    throw error;
  }
}
