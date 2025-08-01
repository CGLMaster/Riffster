import MainArtistCard from "@/react/main/artist/MainArtistCard.jsx";
import { useTopArtist } from "@/hooks/utils.jsx";
import ClientGridMain from "../global/ClientGridMain.jsx";

export default function ClientTopArtistMain() {
  return (
    <ClientGridMain
      title="Recomendados para ti"
      useItems={useTopArtist}
      CardComponent={MainArtistCard}
      getItem={item => item}
      itemPropName="artist"
    />
  );
}