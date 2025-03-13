import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";



export default function Notifications () {
    return (
        <div className="flex flex-col gap-4 w-full border bg-white p-4 rounded-sm">
            <div className="w-full flex items-center justify-between border-b ">
            <h2 className="text-xs font-semibold capitalize">Alerts & Notifications</h2>
            <Button variant='ghost' size='sm'>Toggle All</Button>
            </div>

            <div className="w-full flex flex-col gap-4 items-start">
                <NotifyComponent 
                    label="property market news"
                    description="Get news, announcements, and updates about the property market."
                />
                <NotifyComponent 
                    label="account activities"
                    description="Get important notifications about your account or activity you've missed."
                />
                <NotifyComponent 
                    label="client inquiries"
                    description="Receive emails from prospective clients looking for rental properties."
                />
                <NotifyComponent 
                    label="meetups near you"
                    description="Get an email when a real estate meetup is posted close to your location."
                />
                <NotifyComponent 
                    label="rental listing updates"
                    description="Get news and announcements for rental listings and market trends."
                />
            </div>
        </div>
    )
}


const NotifyComponent = ({label, description, onClick}: {label: string, description?: string, onClick?: Function}) => {
    return (
        <div className="w-full flex gap-2 items-start">
            <Checkbox/>
            <div className="w-full flex items-start text-muted-foreground flex-col gap-1">
                <h2 className="text-xs capitalize font-medium">{label}</h2>
                <h2 className="text-[10px] capitalize text-muted-foreground">{description}</h2>
            </div>
        </div>
    )
}