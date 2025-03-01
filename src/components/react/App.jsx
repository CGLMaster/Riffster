import { BrowserRouter } from "react-router-dom";
import Login from "./Login.jsx";
import RefreshToken from "./RefreshToken.jsx";

export default function App({ clientId, clientSecret, redirectUri, scopes }) {
    return (
        <BrowserRouter>
            <Login
                clientId={clientId}
                clientSecret={clientSecret}
                redirectUri={redirectUri}
                scopes={scopes}
            />
            <RefreshToken client:only="react" clientId={clientId} clientSecret={clientSecret} />
        </BrowserRouter>
    );
}
