import { getUserFavourites } from "@/actions/favourites";
import Favourites from "./Favourites";

export default async function Page() {

  const favouriteProperties = (await getUserFavourites()).data;

  return <Favourites favourites={favouriteProperties as any} />;
}
