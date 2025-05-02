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
