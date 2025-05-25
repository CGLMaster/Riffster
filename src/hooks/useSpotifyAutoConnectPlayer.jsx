import { useEffect } from "react";

export function useSpotifyAutoConnectPlayer(accessToken, deviceId) {
  useEffect(() => {
    if (!accessToken || !deviceId) return;

    const transferPlayback = async () => {
      try {
        await fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            device_ids: [deviceId],
            play: true,
          }),
        });
        console.log("Dispositivo seleccionado:", deviceId);
      } catch (err) {
        console.error("Error al transferir la reproducción:", err);
      }
    };

    transferPlayback();
  }, [accessToken, deviceId]);
}

export async function getSpotifyPlayerState(accessToken, refreshAccessToken) {
  if (!accessToken) return null;
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.status === 401 && typeof refreshAccessToken === "function") {
      console.log("Entro")
      const newToken = await refreshAccessToken();
      if (newToken) {
        return await getSpotifyPlayerState(newToken, refreshAccessToken);
      }
      throw new Error("No se pudo refrescar el token de acceso");
    }
    if (!response.ok) throw new Error("No se pudo obtener el estado del reproductor");
    return await response.json();
  } catch (err) {
    console.error("Error al obtener el estado del reproductor:", err);
    return null;
  }
}
