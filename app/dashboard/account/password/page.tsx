import ChangePassword from "@/sections/dashboard/password";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Account - Password ",
    description: "password management."
  };

export default async function Page () {
    return <ChangePassword />
}