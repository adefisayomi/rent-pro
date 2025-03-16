"use client"

import { AccountinformationType, NotificationType, ProfessionalDetailType, SocialsType,  } from "./formSchemas"
import Routes from "@/Routes"
import { usePathname, useRouter } from "next/navigation"
import SocialsComponent from "./Socials"
import ChangePassword from "./password"
import useAuthStore from "@/contexts/useAuth"
import AccountInformation from "./AccountInformation"
import { useEffect, useState } from "react"
import Notifications from "./notifications"
import ProfessionalDetails from "./professionalDetails"
import Plan from "./Plan"

type DataProps = {
    socials: SocialsType,
    details: ProfessionalDetailType,
    notify: NotificationType,
}


export default function Dashboard ({props}: {props: DataProps}) {

    const {user} = useAuthStore()
    const {notify, details, socials} = props
    const passwordResetActive = user?.providerData?.some(res => res.providerId === "password");
    const pathname = usePathname()
    
    const [activePageTitle, setActivePageTitle] = useState<string | ''>('');

    useEffect(() => {
        if (typeof window !== "undefined") {
        const storedTitle = localStorage.getItem("activeNavDiv");
        setActivePageTitle(storedTitle ? JSON.parse(storedTitle).title : '');
        }
    }, [pathname]);

    switch (pathname.toLowerCase()) {
        case Routes.dashboard["account management"]["account information"].toLowerCase() :
            return <AccountInformation title={activePageTitle!}/>

        case Routes.dashboard["account management"]["social profile"].toLowerCase() :
            return <SocialsComponent socials={socials!} title={activePageTitle!}/>

        case Routes.dashboard["account management"]["password"].toLowerCase() && passwordResetActive :
            return <ChangePassword title={activePageTitle!}/>

        case Routes.dashboard["professional tools"]["professional details"].toLowerCase() :
            return <ProfessionalDetails details={details} title={activePageTitle!}/>

        case Routes.dashboard.settings["alarm & nofitications"].toLowerCase() :
            return <Notifications notify={notify} title={activePageTitle}/>

        case Routes.dashboard["professional tools"]["my plan"].toLowerCase() :
            return <Plan title={activePageTitle!}/>

        default :
            return <InvalidPage/>
    }
}


function InvalidPage () {
    const router = useRouter()
    useEffect(() => {router.back()}, [])
    return null
}
