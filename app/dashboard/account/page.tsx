import { getUser } from "@/actions/user";
import AccountInformation from "@/sections/dashboard/AccountInformation";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Account - information ",
    description: "account management."
  };

export default async function Page () {
    const {data, message, success} = await getUser()
    return <AccountInformation user={data!}/>
}