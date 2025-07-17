import { getUserDetails, getUserProfileCompletion } from "@/actions/userInformation";
import AccountInformation from "@/sections/dashboard/AccountInformation";
import { AccountinformationType } from "@/sections/dashboard/formSchemas";
import { Metadata } from "next";
import Verification, { TrustScore } from "./Verification";
import { getCustomClaims } from "@/actions/auth";

export const metadata: Metadata = {
    title: "Account - Profile",
    description: "Manage all your activities here",
  };
  

export default async function Page () {
  const userDetails = (await getUserDetails()).data as AccountinformationType
  const userScore = (await getUserProfileCompletion()).data
  const claim = (await getCustomClaims()).data;
    return (
      <div className="w-full flex flex-col gap-4">
        {claim?.accountType === 'agent' && <Verification title="identity verification" userScore={userScore} />}
        {claim?.accountType === 'agent' && <TrustScore userScore={userScore} />}
        <AccountInformation title="account information" userDetails={userDetails as AccountinformationType}/>
      </div>
    )
}