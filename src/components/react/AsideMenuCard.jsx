import React from 'react';

function AsideMenuCard({ playlist }) {
  const { id, name, images, owner } = playlist;
  const { display_name } = owner;

  return (
    <a
      href={`/playlists/${id}`}
      className="playlist-item flex relative p-2 overflow-hidden items-center gap-5 rounded-md hover:bg-zinc-800"
    >
      <picture className="w-12 h-12">
        <img
          src={images[0].url}
          alt={name}
          className="object-cover w-full h-full rounded-md"
        />
      </picture>
      <div className="flex flex-auto flex-col truncate">
        <h4>{name}</h4>
        <span className="text-sm text-gray-400">{display_name}</span>
      </div>
    </a>
  );
}

export default AsideMenuCard;
