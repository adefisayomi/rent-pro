import MyProperty from "@/sections/dashboard/MyProperties";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tools - My properties",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    return <MyProperty title="my properties"/>
}