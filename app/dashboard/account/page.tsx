import { getUserDetails } from "@/actions/userInformation";
import AccountInformation from "@/sections/dashboard/AccountInformation";
import { AccountinformationType } from "@/sections/dashboard/formSchemas";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Account - Profile",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
  const userDetails = (await getUserDetails()).data as AccountinformationType
    return <AccountInformation title="account information" userDetails={userDetails as AccountinformationType}/>
}