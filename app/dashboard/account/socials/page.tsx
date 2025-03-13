import { getSocial } from "@/actions/social";
import SocialsComponent from "@/sections/dashboard/Socials";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Account - socials ",
    description: "socials management."
  };

export default async function Socials () {
    const data = await getSocial()
    return <SocialsComponent socials={data!}/>
}