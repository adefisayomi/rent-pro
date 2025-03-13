import { _propertyTypes } from "@/_data/images"
import DropDownComp from "@/components/DropdownComp"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"



export default function AddNewProperty () {
    return (
        <div className="w-full flex flex-col gap-5">
            <BasicInformation />
            <AdditionalInformation />
        </div>
    )
}


function AdditionalInformation () {

    return (
        <div className='w-full flex items-start flex-col gap-4'>

            <div className="w-full grid grid-cols-4 gap-6">
                <div className="flex flex-col gap-1 ">
                    <p className="text-[10px] ml-1 capitalize font-medium text-muted-foreground">bedrooms*</p>
                    <DropDownComp 
                        title="1"
                        className="bg-slate-100"
                        component={
                            <ul>
                                {
                                    Array.from({length: 9}).map((_, i) => (
                                        <li key={i} className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md">{i + 1}</li>
                                    ))
                                }
                            </ul>
                        }
                    />
                </div>

                <div className="flex flex-col gap-1 ">
                    <p className="text-[10px] ml-1 capitalize font-medium text-muted-foreground">bathrooms*</p>
                    <DropDownComp 
                        title="1"
                        className="bg-slate-100"
                        component={
                            <ul>
                                {
                                    Array.from({length: 9}).map((_, i) => (
                                        <li key={i} className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md">{i + 1}</li>
                                    ))
                                }
                            </ul>
                        }
                    />
                </div>

                <div className="flex flex-col gap-1 ">
                    <p className="text-[10px] ml-1 capitalize font-medium text-muted-foreground">kitchens*</p>
                    <DropDownComp 
                        title="1"
                        className="bg-slate-100"
                        component={
                            <ul>
                                {
                                    Array.from({length: 9}).map((_, i) => (
                                        <li key={i} className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md">{i + 1}</li>
                                    ))
                                }
                            </ul>
                        }
                    />
                </div>

                <div className="flex flex-col gap-1 ">
                    <p className="text-[10px] ml-1 capitalize font-medium text-muted-foreground">parking space*</p>
                    <DropDownComp 
                        title="1"
                        className="bg-slate-100"
                        component={
                            <ul>
                                {
                                    Array.from({length: 9}).map((_, i) => (
                                        <li key={i} className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md">{i + 1}</li>
                                    ))
                                }
                            </ul>
                        }
                    />
                </div>
            </div>
        </div>
    )
}


function BasicInformation () {
    return (
        <div className="w-full flex items-start flex-col gap-5 p-6 rounded-sm border bg-background">
            <p className="text-xs capitalize font-semibold">basic information</p>

            <div className="w-full flex flex-col items-start gap-1">
                <p className="text-[11px] capitalize font-medium text-muted-foreground ml-1">property title*</p>
                <Input placeholder="Property title" className="bg-slate-50" />
            </div>

            <div className="w-full flex flex-col items-start gap-1">
                <p className="text-[11px] capitalize font-medium text-muted-foreground ml-1">description*</p>
                <Textarea placeholder="Description" className="bg-slate-50" />
            </div>

            <div className="w-full flex flex-col items-start gap-1">
                <p className="text-[11px] capitalize font-medium text-muted-foreground ml-1">property type*</p>
                <DropDownComp 
                    title="Select property type" 
                    className="bg-slate-50 text-[11px]"
                    component={
                        <ul>
                            {
                                _propertyTypes.map((property, i) => (
                                    <li key={i} className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md">{property}</li>
                                ))
                            }
                        </ul>
                    }
                />
            </div>
        </div>
    )
}