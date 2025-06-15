function AsideMenuCard({ playlist }) {
  const { id, name, images, owner } = playlist;
  const { display_name } = owner;

  return (
    <a
      href={`/playlists/${id}`}
      className="playlist-item flex relative p-2 overflow-hidden items-center gap-5 rounded-md hover:bg-zinc-800 group"
    >
      <div className="relative w-12 h-12">
        <img
          src={images && images[0]?.url ? images[0].url : "/src/assets/img/riffter_logo.png"}
          alt={name}
          className="object-cover w-full h-full rounded-md"
        />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
          <iconify-icon
            icon="solar:play-bold"
            class="text-2xl text-white"
          ></iconify-icon>
        </div>
      </div>
      <div className="flex flex-auto flex-col truncate">
        <h4>{name}</h4>
        <span className="text-sm text-gray-400">{display_name}</span>
      </div>
    </a>
  );
}

export default AsideMenuCard;
