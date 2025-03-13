import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";



export default function Plan () {
    return (
        <div className="w-full flex flex-col gap-10">
            <div className="grid grid-cols-2 border rounded-md">
                <div className="flex flex-col gap-2 p-5">
                    <h4 className="text-xs font-semibold text-slate-800 capitalize">Current Plan (Standard)</h4>
                    <p className="text-muted-foreground text-[11px] ">Unlimited access to our legal document library and online rental application tool, billed monthly. </p>
                </div>

                <div className="flex items-start gap-2 p-5 border-l">
                    <h1 className="text-3xl font-bold text-slate-800">₦10k</h1>
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-semibold text-slate-800 capitalize">Monthly Plan</h4>
                        <p className="text-muted-foreground text-[11px] ">Your subscription renews <span className="font-semibold text-slate-600">July 12th, 2025</span></p>
                        <button className="text-[11px] px-1 w-fit font-semibold text-primary">Cancel Current Plan</button>
                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-3 gap-4">
                <RateCard title="free plan" price="0" />
                <RateCard title="standard" price="₦10k" defaultChecked />
                <RateCard title="business" price="₦25k" />
            </div>
        </div>
    )
}


function RateCard ({title, price, defaultChecked}: {title: string, price: string, defaultChecked?: boolean}) {
    return (
        <div className="">
            <input type="radio" id={title} defaultChecked={defaultChecked} name="plan" value={title} className="hidden peer"/>
            <label htmlFor={title} className=" rounded-md px-4 py-6 border group flex w-full  flex-col gap-5 text-gray-700 peer-checked:text-white cursor-pointer  peer-checked:bg-primary ">
                <div className="w-full flex flex-col items-center gap-2">
                    <h1 className="text-xl font-medium capitalize">{title}</h1>
                    <p className="text-[11px] text-center font-medium ">Automatically reach potential customers</p>
                </div>

                <div className="w-full flex flex-col items-center gap-2 border-b pb-3">
                    <h1 className="text-3xl font-medium capitalize">{price}</h1>
                    <p className="text-[11px]  text-center font-medium ">Per month, per company or team members</p>
                </div>

                <ul className="py-3 flex flex-col gap-2">
                    <li className="flex items-center gap-1 text-[11px]  font-medium">
                        <Checkbox checked disabled className="rounded-full border-2 border-primary" /> Listing free
                    </li>
                    <li className="flex items-center gap-1 text-[11px]  font-medium">
                        <Checkbox checked disabled className="rounded-full border-2 border-primary" /> Support 24/7
                    </li>
                    <li className="flex items-center gap-1 text-[11px]  font-medium">
                        <Checkbox checked disabled className="rounded-full border-2 border-primary" /> Quick access to customers
                    </li>
                    <li className="flex items-center gap-1 text-[11px]  font-medium">
                        <Checkbox checked disabled className="rounded-full border-2 border-primary" /> Auto refresh ads
                    </li>
                </ul>

                <Button variant='outline' className="capitalize text-gray-700 text-xs font-medium h-11 rounded-lg">
                    Chose Plan
                </Button>
            </label>

        </div>
    )
}