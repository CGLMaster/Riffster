import MainArtistCard from "@/react/main/artist/MainArtistCard.jsx";
import { useArtist } from "@/hooks/utils.jsx";
import ClientGridMain from "../global/ClientGridMain.jsx";

export default function ClientArtistMain() {
  return (
    <ClientGridMain
      title="Artistas que sigues"
      useItems={useArtist}
      CardComponent={MainArtistCard}
      getItem={item => item}
      itemPropName="artist"
    />
  );
}