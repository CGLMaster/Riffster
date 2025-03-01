import { BrowserRouter } from "react-router-dom";
import Login from "./Login.jsx";

export default function App({ clientId, clientSecret, redirectUri, scopes }) {
    return (
        <BrowserRouter>
            <Login
                clientId={clientId}
                clientSecret={clientSecret}
                redirectUri={redirectUri}
                scopes={scopes}
            />
        </BrowserRouter>
    );
}
