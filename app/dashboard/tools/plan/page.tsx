import Plan from "@/sections/dashboard/Plan";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools - Plan",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    return <Plan title="my plan"/>
}