"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { _properties } from "@/_data/images";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";

export default function Gallery() {

  return (
    <div className="mx-auto w-full flex items-center flex-col gap-6 pt-6 pb-10 bg-slate-900">
      <HomeSearchBox />

      <div className="w-full grid sm:grid-cols-3 grid-cols-1 lg:grid-cols-5 gap-1">
        {[..._properties, ..._properties, ..._properties].map(({ image }, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild className="cursor-pointer">
              <img
                src={image}
                alt={`Property ${index + 1}`}
                className="w-full h-full flex object-cover aspect-square"
              />
            </DialogTrigger>

            <DialogContent
              overlayClassName="bg-black/95 z-[100]"
              className="w-full z-[100] bg-transparent flex items-center justify-center border-0 sm:max-w-4xl h-[70vh] p-0"
            >
                <Carousel className="w-full max-w-2xl">
                    <CarouselContent>
                        {[..._properties, ..._properties, ..._properties].map(({image}, index) => (
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
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
