"use client"

import { ArrowRight, MapPin, Bath, BedDouble, Diamond, Sparkle, ChevronLeft, Ratio, ChevronsRight, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import useAlert from "@/hooks/useAlert";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay"
import { usePathname, useRouter } from "next/navigation";
import { NewPropertySchemaType } from "../dashboard/formSchemas";
import currency from 'currency.js';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { addToFavourites, isPropertyLoved } from "@/actions/favourites";



export default function SingleProperty({ property }: { property: NewPropertySchemaType & { id: string } }) {
  const router = useRouter();
  useEffect(() => {
    router.prefetch(`/listings/${property?.id}`);
  }, [router, property?.id]);

  return (
    <div className="w-full rounded-2xl p-1 bg-white shadow-sm border">
      <div className="w-full">
        <ImageSlider propertyId={property.id} images={property?.images?.map(image => (typeof image === "string" ? image : "")).filter(Boolean) || []} />
      </div>

      <div className="w-full flex flex-col items-start gap-2 px-2 py-3" onClick={() => router.push(`/listings/${property?.id}`)}>
        <h3 className="text-xs text-slate-800 capitalize font-bold tracking-tight">{property?.title}</h3>
        <p className="flex items-center gap-2 text-muted-foreground text-[11px]">
          <MapPin className="w-4 text-primary" /> {property?.address}
        </p>
        <p className="text-[11px] text-muted-foreground py-2">
          {property?.description?.split(" ").slice(0, 30).join(" ") + (property?.description?.split(" ").length > 30 ? "..." : "")}
        </p>
        <div className="w-full flex items-center gap-4">
          <span className="flex items-center gap-2 text-[11px] capitalize text-muted-foreground">
            <BedDouble className="w-4 text-primary" /> {property.bedrooms} Beds
          </span>
          <span className="flex items-center gap-2 text-[11px] capitalize text-muted-foreground">
            <Bath className="w-4 text-primary" /> {property.bathrooms} Baths
          </span>
          <span className="flex items-center gap-2 text-[11px] lowercase text-muted-foreground">
            <Ratio className="w-4 text-primary" /> 8x10 m<sup className="-ml-2">2</sup>
          </span>
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-2 px-2 py-3 border-t">
        <h3 className="text-sm font-medium">{currency(property.price, { symbol: "₦", precision: 2 }).format()} / <span className="text-[11px] text-muted-foreground">year</span></h3>
        <Button
          onClick={() => router.push(`/listings/${property?.id}`)}
          size="sm"
          variant="outline"
          className="px-5 text-primary border-primary"
        >
          <ChevronsRight className="w-4" />
        </Button>
      </div>
    </div>
  );
}





export function ImageSlider({ images = [], propertyId }: { images?: string[], propertyId: string }) {
  const randomDelay = useMemo(() => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000, []);
  const pluginRef = useRef(Autoplay({ delay: randomDelay, stopOnInteraction: true }));
  const [modalApi, setModalApi] = useState<CarouselApi | null>(null);
  const [loading, setLoading] = useState(true);
  // 
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Scroll to the selected image when the modal opens
  useEffect(() => {
    if (api && selectedIndex !== null) {
      api.scrollTo(selectedIndex);
    }
  }, [api, selectedIndex]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={[pluginRef.current]}
        className="w-full relative h-[200px] max-h-[200px] overflow-hidden rounded-2xl"
        onMouseEnter={() => pluginRef.current.stop()}
        onMouseLeave={() => pluginRef.current.play()}
      >
        <div className="absolute top-3 left-3 z-10">
          <Button size="sm" className="rounded-full flex items-center gap-1 text-[11px] capitalize">
            <Sparkle className="w-4" /> Popular
          </Button>
        </div>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-4">
          <CarouselPrevious className="border-none relative left-0 top-3" />
          <CarouselNext className="border-none relative left-0 top-3" />
        </div>
        <div className="absolute right-0 bottom-0 p-3 rounded-xl items-center z-10">
          <LoveButton propertyId={propertyId} />
        </div>

        <CarouselContent className="rounded-md">
          {images.length === 0 ? (
            <CarouselItem>
              <Skeleton className="w-full rounded-xl h-[200px]" />
            </CarouselItem>
          ) : (
            images.map((image, index) => (
              <Dialog key={index} onOpenChange={(open) => open && setSelectedIndex(index)}>
                <DialogTrigger
                  asChild
                  onClick={() => setCurrent(index)}
                  className="cursor-pointer"
                >
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    width={300}
                    height={300}
                    className={`object-cover w-full h-full rounded-xl transition-opacity duration-300 ${
                      loading ? "opacity-70" : "opacity-100"
                    }`}
                    loading="lazy"
                    unoptimized
                    onLoad={() => setLoading(false)}
                  />
                </DialogTrigger>

                <DialogContent
                  overlayClassName="bg-black/95 z-[100]"
                  className="w-full z-[100] bg-transparent flex items-center justify-center border-0 sm:max-w-4xl h-[70vh] p-0"
                >
                  <Carousel setApi={setApi} className="w-full max-w-2xl">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <img
                              src={image}
                              alt={`Property ${index + 1}`}
                              className="w-full h-full flex object-cover aspect-square"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  

                    {/* Dot Slider */}
                    <div className="w-full flex items-center justify-center md:justify-between p-2">
                      <div className="relative items-center gap-4 hidden md:flex">
                      <CarouselPrevious className="left-0 size-6"/>
                      <CarouselNext className="left-10 size-6"/>
                      </div>
                    <div className="flex justify-center space-x-2 mt-4">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-[3px] rounded-full transition-all ${
                            index === current ? "bg-white" : "bg-gray-500"
                          }`}
                          onClick={() => api?.scrollTo(index)}
                        />
                      ))}
                    </div>
                  </div>
                  </Carousel>
                </DialogContent>
              </Dialog>
            ))
          )}
        </CarouselContent>
      </Carousel>
    </div>
  );
}



interface LoveButtonProps {
  propertyId: string;
}

const LoveButton = ({ propertyId }: LoveButtonProps) => {

  const pathname = usePathname()
  const [loved, setLoved] = useState(false);
  const { setAlert } = useAlert();
  const router = useRouter()

  const checkLovedStatus = useCallback(async () => {
    const isLoved = await isPropertyLoved(propertyId);
    setLoved(isLoved);
  }, [propertyId]);

  useEffect(() => {
    checkLovedStatus();
  }, [checkLovedStatus, pathname]);

  const handleLoveClick = async () => {
    if (!propertyId) return;

    const { data, success } = await addToFavourites(propertyId);

    if (success) {
      setLoved(data);
      setAlert(data ? "Added to favourites" : "Removed from favourites", "success");
      // return reload ? router.push(pathname) : null
    } else {
      setAlert("Failed to update favourites", "error");
    }
  };

  return (
    <Button
      onClick={handleLoveClick}
      size="icon"
      className="rounded-full w-8 h-8 p-1 flex items-center justify-center bg-white hover:bg-slate-50"
    >
      <Heart className="text-red-500 w-5" fill={loved ? "currentColor" : "none"} />
    </Button>
  );
};