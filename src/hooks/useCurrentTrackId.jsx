import { useState, useEffect } from "react";

export function useCurrentTrackId(authToken, pollInterval = 5000) {
  const [currentTrackId, setCurrentTrackId] = useState(null);

  useEffect(() => {
    if (!authToken) return;

    let cancelled = false;

    const fetchCurrent = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (res.status === 204 || res.status === 404) {
          if (!cancelled) setCurrentTrackId(null);
          return;
        }
        if (!res.ok) {
          console.warn("No se pudo obtener current-playing:", res.status);
          return;
        }
        const data = await res.json();
        const playingId = data?.item?.id || null;
        if (!cancelled) setCurrentTrackId(playingId);
      } catch (e) {
        console.error("Error fetch current-playing:", e);
      }
    };

    fetchCurrent();
    const interval = setInterval(fetchCurrent, pollInterval);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [authToken, pollInterval]);

  return currentTrackId;
}
