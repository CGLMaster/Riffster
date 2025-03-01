import { useEffect } from "react";

export default function RefreshToken({ clientId, clientSecret }) {
  useEffect(() => {
    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        console.error("No se encontró refresh token");
        return;
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
      } catch (error) {
        console.error("Error al refrescar token:", error);
      }
    };

    refreshAccessToken();
  }, [clientId, clientSecret]);

  return null;
}
