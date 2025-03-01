import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


export default function Login({ clientId, clientSecret, redirectUri, scopes }) {
    
    const spoty_url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;
    const location = useLocation();
    let navigate = useNavigate();


    useEffect(() => {

        const urlParams = new URLSearchParams(location.search)
        const spotyCode = urlParams.get("code");
        if (spotyCode) {
            autenticateUser(spotyCode)
        }
    })

    const autenticateUser = (spotyCode) => {

        try {
            const searchParams = new URLSearchParams({
                code: spotyCode,
                grant_type: "authorization_code",
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
            });

            axios.post("https://accounts.spotify.com/api/token", searchParams).then(res => {
                localStorage.setItem('access_token', res.data.access_token);
                localStorage.setItem('refresh_token', res.data.refresh_token);
                navigate("/playlists");
            })
        } catch (error) {
            console.log(error);
        }


    }

    function login() {
        window.location.replace(spoty_url);
    };


    return (
        <div className="general" >
            <div id="login">
                <h3 className="subtitle">
                    Visualiza toda la información de tu perfil de Spotify
                </h3>
                <button onClick={login} id="btnLogin" className="btnLogin">
                    INICIAR SESION
                </button>
            </div>
        </div>
    );
}