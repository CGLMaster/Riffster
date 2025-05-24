import MainPlaylistCard from "@/components/react/main/playlist/MainPlaylistCard.jsx";
import { usePlaylists } from "@/hooks/utils.jsx";
import ClientGridMain from "../global/ClientGridMain.jsx";

export default function ClientPlaylistMain() {
  return (
    <ClientGridMain
      title="Escuchado recientemente"
      useItems={usePlaylists}
      CardComponent={MainPlaylistCard}
      getItem={item => item}
      itemPropName="playlist"
    />
  );
}