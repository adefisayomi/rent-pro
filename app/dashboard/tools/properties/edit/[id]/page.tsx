import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import EditProperty from "../EditProperty";
import { getPropertyById } from "@/actions/property";

type Props = {
    params: Promise<{ id: string }>;
  };

async function fetchProperty(id: string): Promise<NewPropertySchemaType | null> {
  try {
    const response = await getPropertyById(id);
    return response?.data as NewPropertySchemaType;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const property = await fetchProperty(id);

  return {
    title:`editing / ${property?.title.replaceAll(" ", '-')} - Listings | Rent-House® - Your Trusted Home Rental Partner` || "Property Details",
  };
}

export default async function EditPage ({ params }: Props) {
    const { id } = await params;
  const property = await fetchProperty(id); 
    return <EditProperty property={property! as NewPropertySchemaType & {id: string}}/>
}