"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bath, BedDouble, CarFront, MapPin, Ratio } from "lucide-react";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import { Button } from "@/components/ui/button";
import TestimonialSlider from "@/sections/home/TestimonialSlider";
import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import Autoplay from "embla-carousel-autoplay";


export default async function ListingDetails({ property }: {property: NewPropertySchemaType}) {
  return (
    <LayoutWithImageHeader
      title={property?.title || "Property Details"}
      bgImage={property?.images?.[0] as string ?? "/placeholder.jpg"} // ✅ Fallback Image
      showCrumbs={false}
      className="hidden"
    >
      <div className="w-full mx-auto flex flex-col px-2">
        <div className="w-full mx-auto max-w-8xl h-[50vh] mt-5 mb-20 relative " 
          style={{
            backgroundImage: `url(${property?.images?.[1]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: "16px", // Optional: Rounds the edges
          }}
        >

          <div className="w-full flex items-center justify-center border-[7px] border-slate-50 max-w-[93%] sm:max-w-6xl rounded-2xl bg-slate-800 p-6 absolute top-[100%] -translate-y-[50%] left-[50%] -translate-x-[50%]">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4 w-full max-w-3xl">
            <InfoItem icon={<BedDouble />} text={`${property?.bedrooms ?? "N/A"} Beds`} />
            <InfoItem icon={<Bath />} text={`${property?.bathrooms ?? "N/A"} Bathrooms`} />
            <InfoItem icon={<Ratio />} text="8 m²" />
            <InfoItem icon={<CarFront />} text={`${property?.parking ?? "N/A"} Parking`} />
            </div>
          </div>
        </div>

        <ImageInformation property={property} />
        <TestimonialSlider />
      </div>
    </LayoutWithImageHeader>
  );
}

const ImageInformation = ({ property }: { property: NewPropertySchemaType }) => {
  const randomDelay = useMemo(() => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000, []);
  const pluginRef = useRef(Autoplay({ delay: randomDelay, stopOnInteraction: true }));
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [modalApi, setModalApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!modalApi) return;

    modalApi.scrollTo(current); // Set the initial slide position
    const onSelect = () => setCurrent(modalApi.selectedScrollSnap());
    modalApi.on("select", onSelect);

    return () => {
      modalApi.off("select", onSelect);
    };
  }, [modalApi, current]);

  return (
    <div className="w-full mx-auto max-w-8xl flex items-center gap-8 md:flex-row flex-col px-2 py-8">
      <div className="w-full max-w-lg flex flex-col items-start gap-4">
        <Button className="flex items-center gap-2">
          <MapPin className="w-4" />
          {property?.address ?? "Address not available"}
        </Button>
        <h1 className="text-2xl capitalize font-bold text-slate-800 text-start">
          {property?.title ?? "No Title"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {property?.description ?? "No description available"}
        </p>

        <div className="w-full flex md:items-center justify-between flex-col md:flex-row items-start gap-4">
          <h3 className="text-xl font-medium">
            ₦{property?.price ?? "N/A"} <span className="text-[11px] text-muted-foreground">/year</span>
          </h3>
          <Button variant="outline" className="flex items-center gap-2 capitalize w-full md:w-fit">
            Explore Residence
            <ArrowRight className="w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {property?.images?.length ? (
          <Dialog>
            {property.images.map((image, index) => (
              <React.Fragment key={index}>
                <DialogTrigger onClick={() => setCurrent(index)}>
                  <ImageWithLoader src={image as string} alt={`Property image ${index + 1}`} />
                </DialogTrigger>

                {index === current && (
                  <DialogContent
                    overlayClassName="bg-black/90 z-[100]"
                    className="md:h-[70vh] h-[80vh] w-full z-[100] p-0 sm:max-w-4xl bg-transparent border-0"
                  >
                    <Carousel setApi={setModalApi} className="w-full h-full">
                      <CarouselContent className="h-full">
                        {property.images.map((img, idx) => (
                          <CarouselItem key={idx} className="flex items-center justify-center h-full">
                            <Image
                              src={img as string}
                              alt={`Modal Image ${idx + 1}`}
                              width={800}
                              height={800}
                              className="w-auto max-h-full object-contain"
                              loading="lazy"
                              unoptimized
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious variant="ghost" className="bg-transparent text-white sm:-left-10" />
                      <CarouselNext variant="ghost" className="bg-transparent text-white sm:-right-10" />
                    </Carousel>
                    <div className="py-2 text-center text-white text-[11px]">
                      Slide {current + 1} of {property.images.length}
                    </div>
                  </DialogContent>
                )}
              </React.Fragment>
            ))}
          </Dialog>
        ) : (
          <div className="col-span-2 md:col-span-3 flex items-center justify-center bg-gray-200 p-6 rounded-lg">
            No Images Available
          </div>
        )}
      </div>
    </div>
  );
};


// ✅ **Reusable Image Loader Component**
const ImageWithLoader = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loading, setLoading] = useState(true);

  if (!src) {
    return <div className="bg-gray-300 rounded-lg w-full h-full" />; // Fallback UI
  }

  return (
    <div className={`relative ${className} w-full h-full`}>
      {/* Skeleton Loader */}
      {loading && <Skeleton className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />}

      {/* Image */}
      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        className={`object-cover w-full h-full rounded-lg transition-opacity duration-300 ${
          loading ? "opacity-70" : "opacity-100"
        }`}
        loading="lazy"
        unoptimized // ✅ For external storage images (Cloudinary, Google Storage, etc.)
        onLoad={() => setLoading(false)} // ✅ Next.js proper loading event
      />
    </div>
  );
};
// ✅ **Reusable Property Info Component**
const InfoItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <span className="flex items-center justify-center gap-2 text-xs w-full capitalize text-white border-slate-700 p-3 rounded-lg border cursor-pointer">
    {icon}
    {text}
  </span>
);
