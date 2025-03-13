"use client"

import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Button } from "@/components/ui/button";
import Routes from "@/Routes";
import HomeFilterForm from "@/sections/filter/HomeFilterForm";
import SingleProperty from "@/sections/property/singleProperty";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";
import { useRouter } from "next/navigation";
import { Fragment } from "react";



export default function Listings () {
    return (
        <LayoutWithImageHeader
            title="Property Listing"
            bgImage="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
             component={
                    <div className="p-2 w-full flex items-center justify-center absolute top-52 md:relative z-20 md:top-0">
                      <HomeSearchBox />
                    </div>
                  }
        >
          <div className="py-32 md:hidden flex" />
            <div className="w-full mx-auto flex items-start pb-10">
              <div className="w-full hidden flex-col items-start max-w-xs md:flex">
                <HomeFilterForm />
                <PropertyNotFound />
              </div>

              <div className="w-full flex flex-col items-center md:grid md:grid-cols-3 gap-6 md:p-10 p-6 ">
                {
                  Array.from({length: 15}).map((_, index) => (
                    <Fragment key={index}>
                      <SingleProperty />
                    </Fragment>
                  ))
                }
              </div>
            </div>
        </LayoutWithImageHeader>
    )
}


const PropertyNotFound = () => {
    const router = useRouter()
  return (
    <div className="p-8 flex flex-col items-start pl-10 gap-2 bg-slate-900 border-b border-muted-foreground">
      <h2 className="text-lg text-left font-semibold text-white">Didn’t find what you <br /> are looking for?</h2>
      <p className="text-xs text-white">Let us know your specification and our team will reach out to assit.</p>
      <Button onClick={() => router.push(Routes.contact)} className="w-full h-12 mt-4">
        Get in Touch
      </Button>
    </div>
  )
}