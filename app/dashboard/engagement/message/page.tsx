import { getCustomClaims } from "@/actions/auth";
import Message from "./Message";
import { getUserMessages } from "@/actions/messaging";



export default async function Page () {
    const claim = (await getCustomClaims()).data;
    const allMessages = (await getUserMessages()).data
    return <Message title="message" accountType={claim?.accountType} allMessages={allMessages} />
}