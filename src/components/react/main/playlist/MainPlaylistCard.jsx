function MainPlaylistCard({ playlist }) {
    const { id, name, images, owner } = playlist;
    const { display_name } = owner;

    return (
        <a
            href={`/playlists/${id}`}
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
                <span className="text-sm text-gray-400">{display_name}</span>
            </div>
        </a>
    );
}

export default MainPlaylistCard;
