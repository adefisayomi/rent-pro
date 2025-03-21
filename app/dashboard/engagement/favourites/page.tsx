import { getUserFavourites } from "@/actions/favourites";
import Favourites from "./Favourites";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {

  const favouriteProperties = (await getUserFavourites()).data;

  return <Favourites favourites={favouriteProperties as any} />;
}
