import MainAlbumCard from "@/components/react/main/album/MainAlbumCard.jsx";
import { useAlbums } from "@/hooks/utils.jsx";
import ClientGridMain from "../global/ClientGridMain.jsx";

export default function ClientAlbumMain() {
  return (
    <ClientGridMain
      title="Albumnes seguidos"
      useItems={useAlbums}
      CardComponent={MainAlbumCard}
      getItem={item => item.album}
      itemPropName="album"
    />
  );
}