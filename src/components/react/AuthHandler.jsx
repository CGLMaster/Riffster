import { useEffect } from "react";

export default function AuthHandler({ clientId, clientSecret, redirectUri }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      const fetchToken = async () => {
        const url = "https://accounts.spotify.com/api/token";
        const body = new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          client_id: clientId,
          client_secret: clientSecret,
        });
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });
        const data = await res.json();
        if (data.access_token) {
            console.log("Token de acceso recibido:", data.access_token);
          localStorage.setItem("access_token", data.access_token);
          if (data.refresh_token) {
            console.log("Token de refresco recibido:", data.refresh_token);
            localStorage.setItem("refresh_token", data.refresh_token);
          }
          window.history.replaceState({}, document.title, window.location.pathname);
          window.location.reload();
        }
      };
      fetchToken();
    }
  }, [clientId, clientSecret, redirectUri]);

  return null;
}