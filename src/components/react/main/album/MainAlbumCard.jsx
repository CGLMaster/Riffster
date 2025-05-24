function MainAlbumCard({ album }) {
    const { id, name, images, artists } = album;
    const artistName = artists && artists[0] && artists[0].name ? artists[0].name : "Unknown Artist";

    return (
        <a
            href={`/albums/${id}`}
            className="playlist-item flex flex-col w-44 relative p-2 overflow-hidden gap-2 rounded-md hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 transition-all duration-300"
        >
            <div className="w-full aspect-square overflow-hidden rounded-md">
                <img
                    src={images[0].url}
                    alt={name}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col px-2">
                <h4 className="truncate">{name}</h4>
                <span className="text-sm text-gray-400">{artistName}</span>
            </div>
        </a>
    );
}

export default MainAlbumCard;