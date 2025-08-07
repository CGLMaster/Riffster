const ArtistAlbumList = ({ albums }) => {
  if (!albums?.length) return null;
  return (
    <div className="artist-album-list">
      <h3 className="text-xl font-semibold mb-3">Álbumes</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {albums.map((album) => (
          <div key={album.id} className="bg-gray-900 rounded p-3 flex flex-col items-center">
            <img src={album.images?.[0]?.url} alt={album.name} className="w-24 h-24 rounded mb-2 object-cover" />
            <div className="text-center">
              <div className="font-medium">{album.name}</div>
              <div className="text-gray-400 text-xs">{album.release_date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistAlbumList;
