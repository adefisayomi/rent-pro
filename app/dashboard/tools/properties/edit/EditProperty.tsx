"use client"


import { _africanCountries, _generalAmenities, _listedIn, _propertyTypes, _status } from "@/_data/images"
import DropDownComp from "@/components/DropdownComp"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import yup from 'yup'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox"
import useAlert from "@/hooks/useAlert"
import { updateProperty } from "@/actions/property"
import dynamic from "next/dynamic"
import { newPropertySchema, NewPropertySchemaType } from "@/sections/dashboard/formSchemas"
import AutocompleteComponent from "@/sections/SearchForms/AutocompleteComponent"
import NewPropImagesUploader from "@/sections/dashboard/NewPropertyImageUploader"
import BreadcrumbHeader from "@/components/Breadcrumbs"
import { useParams, usePathname, useRouter } from "next/navigation"
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { ssr: false });



const fieldNames = ["bedrooms", "bathrooms", "kitchens", "parking"] as const;

export default function EditProperty ({property}: {property: NewPropertySchemaType & {id: string}}) {

    const param = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const {setAlert} = useAlert()
    const form = useForm<yup.InferType<typeof newPropertySchema>>({
        resolver: yupResolver(newPropertySchema),
        defaultValues: {}
      })
    async function onSubmit(data: yup.InferType<typeof newPropertySchema>) {
        try {
            if (!param?.id || typeof param.id !== "string") {
                throw new Error("Invalid or missing property ID");
              }
              
            const { success, message } = await updateProperty(param.id, data);
            if (!success && message) throw new Error(message)
            // 
            setAlert(message, 'success')
            return 
        }
        catch(err: any) {
            return setAlert(err.message, 'error')
        }
      }

      const [location, setLocation] = useState<any>('');
      useEffect(() => {
        const handleResetAddress = () => {
            if (location) {
                if (location?.address?.country) form.setValue("country", location.address.country)
                if (location?.address?.county) form.setValue("city", location.address.county)
                if (location?.address?.postcode) form.setValue("zip", location.address.postcode)
                if (location?.address?.state) form.setValue("state", location.address.state)
                if (location?.display_address) form.setValue("address", location.display_address)
                 if (location?.lat && location?.lon) form.setValue("cordinates", `[ ${location.lat}, ${location.lon} ]`)
             }
        }
        handleResetAddress()
      }, [location, form])

      useEffect(() => {
        form.reset(property)
      }, [pathname, form])


    return (
        <Form {...form}>
            <form  onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
                <BreadcrumbHeader className="text-[11px] font-medium" />

                {/* Basic information */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">basic information</h2>

                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormLabel className="">Property Title*</FormLabel>
                            <FormControl>
                                <Input {...field} className='bg-slate-50' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Description*</FormLabel>
                                <FormControl>
                                    <Textarea rows={6} className="bg-slate-50" placeholder="Type your description..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="">Property Type*</FormLabel>
                            <FormControl>
                            <DropDownComp
                                title={field.value || '-'}
                                className="border bg-slate-50 rounded-md lowercase"
                                component={
                                <div className="flex w-full flex-col gap-1 items-start">
                                    {_propertyTypes.map((type, index) => (
                                    <Button
                                        size="sm"
                                        onClick={() => field.onChange(type)}
                                        variant="ghost"
                                        key={index}
                                        className="text-[11px] w-full flex justify-start items-center rounded-none lowercase"
                                    >
                                        {type}
                                    </Button>
                                    ))}
                                </div>
                                }
                            />
                            </FormControl>
                        </FormItem>
                        )}
                    />

                    <div className="w-full grid gap-4 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="listedIn"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Listed in*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || '-'}
                                    className="border bg-slate-50 rounded-md capitalize"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {_listedIn.map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                        >
                                            {type}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Status*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || '-'}
                                    className="border bg-slate-50 rounded-md capitalize"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {_status.map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                        >
                                            {type}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full grid gap-4 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Price*</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="taxRate"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Yearly Tax Rate*</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Additional information */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">additional information</h2>
                        
                    <div className="w-full grid md:grid-cols-4 grid-cols-1 gap-4">
                    {
                        fieldNames.map((res, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={res}
                                render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel className="capitalize">{res}*</FormLabel>
                                    <FormControl>
                                    <DropDownComp
                                        title={field.value || '-'}
                                        className="border bg-slate-50 rounded-md capitalize"
                                        component={
                                        <div className="flex w-full flex-col gap-1 items-start">
                                            {Array.from({length: 10}).map((_, index) => (
                                            <Button
                                                size="sm"
                                                onClick={() => field.onChange(index + 1)}
                                                variant="ghost"
                                                key={index}
                                                className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                            >
                                                {index + 1}
                                            </Button>
                                            ))}
                                        </div>
                                        }
                                    />
                                    </FormControl>
                                </FormItem>
                                )}
                            />
                        ))
                    }
                    </div>
                </div>

                {/* Address and Location */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">address & location</h2>

                    <div className="w-full grid gap-4 grid-cols-5">
                    <FormField
                        control={form.control}
                        name="address"
                        render={() => (
                            <FormItem className="w-full col-span-3">
                            <FormLabel className="">Address*</FormLabel>
                            <FormControl>
                                <AutocompleteComponent simple setLocation={setLocation} className='bg-slate-50' />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                        <FormField
                            control={form.control}
                            name="cordinates"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-2">
                                <FormLabel className="">Map Location</FormLabel>
                                <FormControl>
                                    <Input readOnly disabled {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full grid gap-4 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">Country*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || 'Nigeria'}
                                    className="border bg-slate-50 rounded-md capitalize"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {Object.keys(_africanCountries).map((type, index) => (
                                        <Button
                                            size="sm"
                                            onClick={() => field.onChange(type)}
                                            variant="ghost"
                                            key={index}
                                            className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                        >
                                            {type}
                                        </Button>
                                        ))}
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="">State*</FormLabel>
                                <FormControl>
                                <DropDownComp
                                    title={field.value || '-'}
                                    className="border bg-slate-50 rounded-md capitalize"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {_africanCountries[form.watch("country")?.toLowerCase() as keyof typeof _africanCountries] ? 
                                            _africanCountries[form.watch("country")?.toLowerCase() as keyof typeof _africanCountries].map((type, index) => (
                                                <Button
                                                    size="sm"
                                                    onClick={() => field.onChange(type)}
                                                    variant="ghost"
                                                    key={index}
                                                    className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                                >
                                                    {type}
                                                </Button>
                                            )) : (
                                                <p className="text-gray-500 text-sm">No states available</p>
                                            )
                                        }
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full grid gap-4 grid-cols-2">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">City*</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="zip"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                <FormLabel className="">Zip</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="w-full h-80 border rounded-lg bg-slate-50">
                    <LeafletMap className="h-80 rounded-lg"/>

                    </div>
                </div>

                {/* Phot & video attachment */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">photos & video attachment</h2>

                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem className="w-full">
                            <FormMessage />
                            <FormControl>
                                <NewPropImagesUploader
                                images={Array.isArray(field.value) ? field.value.filter((img): img is File | string => img instanceof File || typeof img === "string") : []}
                                setImages={(newImages: (File | string)[]) => {
                                    field.onChange(newImages); // Ensure both File and URL strings are handled
                                }}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />

                    <h2 className="text-xs font-semibold capitalize">video attachment</h2>
                    <div className="w-full grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="videoFrom"
                        render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel className="">Video From</FormLabel>
                            <FormControl>
                                <DropDownComp
                                    title={field.value || '-'}
                                    className="border bg-slate-50 rounded-md capitalize"
                                    component={
                                    <div className="flex w-full flex-col gap-1 items-start">
                                        {["vimeo", "youtube"].map((type, index) => (
                                                <Button
                                                    size="sm"
                                                    onClick={() => field.onChange(type)}
                                                    variant="ghost"
                                                    key={index}
                                                    className="text-[11px] w-full flex justify-start items-center rounded-none capitalize"
                                                >
                                                    {type}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                    }
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="videoLink"
                            render={({ field }) => (
                                <FormItem className="w-full col-span-2">
                                <FormLabel className="">Video link</FormLabel>
                                <FormControl>
                                    <Input {...field} className='bg-slate-50' />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Select Amenities */}
                <div className="w-full bg-white flex flex-col gap-5  p-6 rounded-sm border">
                    <h2 className="text-xs font-semibold capitalize pb-2">select amenities</h2>
                    <div className="w-full grid grid-cols-4 gap-4">
                        {Object.entries(_generalAmenities).map(([category, amenities], index) => (
                            <div key={index} className="flex flex-col gap-3">
                            <FormLabel className="text-[11px] text-gray-700 capitalize font-semibold">{amenities.label}</FormLabel>
                            {amenities.list.map((amenity) => (
                                <FormField
                                key={amenity}
                                control={form.control}
                                name={category as keyof typeof _generalAmenities} // Store checked values as an array
                                render={({ field }) => {
                                  const valueArray = Array.isArray(field.value) ? field.value.filter((item): item is string => typeof item === "string") : [];
                                  
                                  return (
                                    <FormItem className="flex items-center gap-2 text-gray-600 capitalize text-[11px]">
                                      <FormControl className="flex items-center gap-2 text-gray-600 capitalize text-[11px]">
                                        <Checkbox
                                          id={amenity}
                                          checked={valueArray.includes(amenity)} // Ensure correct boolean check
                                          onCheckedChange={(checked) => {
                                            field.onChange(
                                              checked
                                                ? [...valueArray, amenity] // Add to array if checked
                                                : valueArray.filter((item) => item !== amenity) // Remove if unchecked
                                            );
                                          }}
                                        />
                                      </FormControl>
                                      <label htmlFor={amenity}>{amenity}</label>
                                    </FormItem>
                                  );
                                }}
                              />
                              
                            ))}
                            <FormMessage />
                            </div>
                        ))}
                        </div>
                </div>

                <div className='flex items-center justify-end gap-3'>
                        <Button onClick={() => router.back()} variant='destructive' type='button' size='lg' className="border-primary text-xs"> 
                            Cancel
                        </Button>

                        <Button type='submit' loading={form.formState.isSubmitting} size='lg' className="border-primary text-xs"> 
                            Update Property
                        </Button>
                </div>
            </form>
        </Form>
    )
}
