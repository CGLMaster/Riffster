function MainArtistCard({ artist }) {
    const { id, name, images } = artist;

    return (
        <a
            href={`/artists/${id}`}
            className="playlist-item flex flex-col w-44 relative p-2 overflow-hidden gap-2 rounded-md hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 transition-all duration-300 items-center"
        >
            <div className="w-35 h-35 overflow-hidden rounded-full mb-2">
                <img
                    src={images?.[0]?.url || '/src/assets/img/riffter_logo.png'}
                    alt={name}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="flex flex-col px-2 items-center">
                <h4 className="truncate text-center">{name}</h4>
                <span className="text-xs text-gray-400">Artista</span>
            </div>
        </a>
    );
}

export default MainArtistCard;