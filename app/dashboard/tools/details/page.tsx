import { getProfessionalDetail } from "@/actions/professional";
import { ProfessionalDetailType } from "@/sections/dashboard/formSchemas";
import ProfessionalDetails from "@/sections/dashboard/professionalDetails";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Tools - Professional Details ",
    description: "tools management."
  };

export default async function Socials () {
    const {data} = await getProfessionalDetail()
    return <ProfessionalDetails details={data as ProfessionalDetailType} />
}