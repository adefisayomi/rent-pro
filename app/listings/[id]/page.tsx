"use client"

import { ArrowRight, Bath, BedDouble, CarFront, MapPin, Ratio } from "lucide-react";
import { _properties } from "@/_data/images";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Button } from "@/components/ui/button";
import TestimonialSlider from "@/sections/home/TestimonialSlider";
import Image from "next/image";




export default function ListingDetails () {
    return (
        <LayoutWithImageHeader
            title="Victorial bliss residence"
            bgImage="https://images.unsplash.com/photo-1720065609938-ec0e33ffd9ad?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            showCrumbs={false}
        >
            <div className="w-full mx-auto flex flex-col">
                <div className="w-full mx-auto max-w-8xl h-[50vh] px-2 my-20 relative">
                    <Image
                        src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt=""
                        className="flex object-cover w-full h-full rounded-3xl"
                        width={500}
                        height={500}
                    />

                    <div className="w-full md:flex grid grid-cols-2 items-center gap-8 justify-center border-[7px] text-muted-foreground border-slate-50 max-w-6xl rounded-2xl bg-slate-800 p-6 absolute top-[100%] -translate-y-[50%] left-[50%] -translate-x-[50%]">
                        <span className="flex items-center gap-2 text-xs capitalize text-white border-r md:pr-8">
                            <BedDouble className="w-5 text-primary" /> 5 Beds
                        </span>
                        
                        <span className="flex items-center gap-2 text-xs capitalize text-white md:border-r md:pr-8">
                            <Bath className="w-5 text-primary" /> 5 bathrooms
                        </span>
                        <span className="flex items-center gap-2 text-xs lowercase text-white border-r md:pr-8">
                            <Ratio className="w-5 text-primary" /> 8x10 m<sup className="-ml-2">2</sup>
                        </span>
                        <span className="flex items-center gap-2 text-xs capitalize text-white">
                            <CarFront className="w-5 text-primary" /> parking
                        </span>
                    </div>
                </div>
                <ImageInformation />
                <TestimonialSlider />
            </div> 
        </LayoutWithImageHeader>
    )
}


const ImageInformation = () => {
    return (
        <div className="w-full mx-auto max-w-8xl flex items-center gap-8 md:flex-row flex-col px-2 py-8">
            <div className="w-full max-w-lg flex flex-col items-start gap-4">
                <Button className="flex items-center gap-2">
                    <MapPin className="w-4" />
                    35, Shofunde Close, Admralty Way.
                </Button>
                <h1 className="text-2xl capitalize font-bold text-slate-800 text-start">Victoria Bliss Residence</h1>
                <p className="text-xs text-muted-foreground ">Arcu ac tortor dignissim convallis aenean et tortor at.Ac turpis egestas sed tempus urna et. Quisque eu pellentesque erat, eget bibendum ipsum. Cras euismod massa sed lacus lacinia, quis porta libero consectetur. In pulvinar lobortis eros vitae dapibus. Vestibu</p>

                <div className="w-full flex md:items-center justify-between flex-col md:flex-row items-start gap-4">
                <h3 className="text-xl font-medium ">₦6,000,000 <span className="text-[11px] text-muted-foreground">/year</span></h3>
                    <Button variant='outline' className="flex items-center gap-2 capitalize w-full md:w-fit">
                        explore residence
                        <ArrowRight className="w-4" />
                    </Button>
                </div>
            </div>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
                {
                    _properties.map((image, index) => (
                        <Image
                            key={index} 
                            src={image.image} 
                            alt="" 
                            className="object-cover rounded-lg md:rounded-2xl  md:aspect-square"
                            width={300}
                            height={300}
                        />
                    ))
                }
            </div>
        </div>
    )
}