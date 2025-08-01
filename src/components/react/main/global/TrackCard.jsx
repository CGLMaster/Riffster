export default function TrackCard({ item, onPlay }) {
  const artistNames = (item.artists || []).map(a => a.name).join(", ");
  return (
    <div
      onClick={() => onPlay(item.uri)}
      className="playlist-item flex flex-col w-44 relative p-2 overflow-hidden gap-2 rounded-md hover:bg-zinc-800 shadow-lg hover:shadow-xl bg-zinc-500/30 transition-all duration-300 cursor-pointer group"
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter') onPlay(item.uri); }}
    >
      <div className="w-full aspect-square overflow-hidden rounded-md relative">
        <img
          src={item.album?.images?.[0]?.url || "/assets/img/riffter_logo.png"}
          alt={item.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute bottom-2 right-2 bg-cyan-600/90 rounded-full p-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
          <iconify-icon icon="solar:play-bold" width="24" height="24" className="text-white" />
        </div>
      </div>
      <div className="flex flex-col px-2">
        <h4 className="truncate">{item.name}</h4>
        <span className="text-sm text-gray-400 truncate" title={artistNames}>{artistNames}</span>
      </div>
    </div>
  );
}
