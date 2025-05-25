import MainTopArtistCard from "@/react/main/artist/MainTopArtistCard.jsx";
import { useTopArtist } from "@/hooks/utils.jsx";
import ClientGridMain from "../global/ClientGridMain.jsx";

export default function ClientTopArtistMain() {
  return (
    <ClientGridMain
      title="Recomendados para ti"
      useItems={useTopArtist}
      CardComponent={MainTopArtistCard}
      getItem={item => item}
      itemPropName="artist"
    />
  );
}