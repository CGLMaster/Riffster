import spotifyFetch from '@/components/react/fetcher/spotifyFetch';

export const SpotifyService = {
  getArtist: async (id) => {
    return await spotifyFetch(`/artists/${id}`);
  },
  
  getArtistTopTracks: async (id, market = 'ES') => {
    const response = await spotifyFetch(`/artists/${id}/top-tracks`, { market });
    return response.tracks || [];
  },
  
  getArtistAlbums: async (id, market = 'ES', limit = 12) => {
    const response = await spotifyFetch(`/artists/${id}/albums`, { market, limit });
    return response.items || [];
  },

  getPlaylist: async (id) => {
    return await spotifyFetch(`/playlists/${id}`);
  },

  getPlaylistTracks: async (url) => {
    return await spotifyFetch(url);
  },

  search: async (query, spotifyClientId, spotifyClientSecret) => {
    return await spotifyFetch('/search', {
      q: query,
      type: 'track,artist,album,playlist',
      limit: 20,
      market: 'ES'
    }, spotifyClientId, spotifyClientSecret);
  },

  getCurrentPlayback: async () => {
    return await spotifyFetch('/me/player');
  },

  playTrack: async (trackUri) => {
    const response = await spotifyFetch('/me/player/play', {
      method: 'PUT',
      body: {
        uris: [trackUri],
        position_ms: 0
      }
    });
    return { status: response?.status || 200 };
  },

  playPlaylistTrack: async (playlistId, position) => {
    return await spotifyFetch('/me/player/play', {
      method: 'PUT',
      body: {
        context_uri: `spotify:playlist:${playlistId}`,
        offset: { position },
        position_ms: 0
      }
    });
  },

  getCurrentUser: async () => {
    return await spotifyFetch('/me');
  },

  pause: async () => {
    return await spotifyFetch('/me/player/pause', { method: 'PUT' });
  },

  resume: async () => {
    return await spotifyFetch('/me/player/play', { method: 'PUT' });
  },

  nextTrack: async () => {
    return await spotifyFetch('/me/player/next', { method: 'POST' });
  },

  previousTrack: async () => {
    return await spotifyFetch('/me/player/previous', { method: 'POST' });
  },

  setVolume: async (volumePercent) => {
    return await spotifyFetch(`/me/player/volume?volume_percent=${volumePercent}`, { method: 'PUT' });
  },

  setShuffle: async (state) => {
    return await spotifyFetch(`/me/player/shuffle?state=${state}`, { method: 'PUT' });
  },

  setRepeat: async (state) => {
    return await spotifyFetch(`/me/player/repeat?state=${state}`, { method: 'PUT' });
  },

  transferPlayback: async (deviceId) => {
    return await spotifyFetch('/me/player', {
      method: 'PUT',
      body: {
        device_ids: [deviceId],
        play: true
      }
    });
  }
};
