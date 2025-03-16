import { getNotifications } from "@/actions/notification"
import { getSocial } from "@/actions/social"
import Dashboard from "@/sections/dashboard"
import { NotificationType, ProfessionalDetailType, SocialsType } from "@/sections/dashboard/formSchemas"


export default async function DashboardComponents () {
    const socials = await (await getSocial()).data as SocialsType
    const notify = await (await getNotifications()).data as NotificationType
    const details = await (await getSocial()).data as ProfessionalDetailType
    return (
        <div>
                <Dashboard
                    props={{
                        socials,
                        details,
                        notify
                    }}
                />
        </div>
    )
}