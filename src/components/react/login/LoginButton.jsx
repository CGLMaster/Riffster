export default function LoginButton({ clientId, redirectUri, scopes }) {
    const spoty_url =
      `https://accounts.spotify.com/authorize` +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&show_dialog=true`;
  
    function login() {
      window.location.replace(spoty_url);
    }
  
    return (
      <>
        <button
          onClick={login}
          className="relative z-10 cursor-pointer border-2 border-green-600 px-10 py-2 rounded-lg hover:bg-green-500 text-white font-bold text-lg transition duration-300 ease-in-out"
        >
          INICIAR SESIÓN
        </button>
        <p className="text-center text-gray-300 mt-2">Visualiza toda la información de tu perfil de Spotify</p>
      </>
    );
  }
  