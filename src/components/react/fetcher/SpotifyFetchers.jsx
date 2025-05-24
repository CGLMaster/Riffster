import SpotifyFetcher from "./SpotifyFetcher";

export default function SpotifyFetchers({ configs }) {
  return (
    <>
      {configs.map(cfg => (
        <SpotifyFetcher
          key={cfg.storageKey}
          apiUrl={cfg.apiUrl}
          storageKey={cfg.storageKey}
          spotifyClientId={cfg.spotifyClientId}
          spotifyClientSecret={cfg.spotifyClientSecret}
        />
      ))}
    </>
  );
}