import AccountInformation from "@/sections/dashboard/AccountInformation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account - Profile",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
    return <AccountInformation title="account information"/>
}