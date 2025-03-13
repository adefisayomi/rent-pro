import Plan from "@/sections/dashboard/Plan";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Tools - My Plan ",
    description: "tools management."
  };

export default async function Socials () {
    return <Plan />
}