"use client"

import { _properties } from "@/_data/images";
import GlobalProperties from "@/sections/about-us/GlobalProperties";
import SignatureFeature from "@/sections/about-us/SignatureFeature";
import HomeGallery from "@/sections/home/HomeGallery";
import TestimonialSlider from "@/sections/home/TestimonialSlider";
import Team from "@/sections/about-us/Team";



export default function About () {

    return (
        <div className="w-full flex flex-col">
            <div className="w-full bg-white md:px-0 px-2"><GlobalProperties /></div>
            <SignatureFeature />
            <HomeGallery images={_properties.map((_) => _.image)} />
            <TestimonialSlider />
            <Team />
        </div>
    )
}