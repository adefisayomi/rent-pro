import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Bath, BedDouble, Diamond, Sparkle, ChevronLeft, ChevronRight, Heart, Ratio } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useRef, useState } from "react";
import { _properties } from "@/_data/images";
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";


export default function SingleProperty () {
  const router = useRouter()
    return (
        <div className="w-full rounded-2xl p-1 bg-white shadow-sm">

            <div className="w-full">
                <ImageSlider images={_properties.map((image) => image.image)} />
            </div>

            <div className="w-full flex flex-col items-start gap-2 px-2 py-3">
                <div className="w-full flex flex-col items-start gap-1">
                    <h3 className="scroll-m-20 text-xs text-slate-800 capitalize font-bold tracking-tight">
                    comform nest residence
                    </h3>
                    <p className="w-full flex items-center gap-2 text-muted-foreground text-[11px] ">
                        <MapPin className="w-4 text-primary" />
                        15, Admiralty Way, VI
                    </p>
                </div>

                <p className="text-[11px] text-muted-foreground py-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex harum quo explicabo expedita nesciunt iusto voluptatem laboriosam tempore eum delectus.</p>

                <div className="w-full flex items-center gap-4">
                    <span className="flex items-center gap-2 text-[11px] capitalize text-muted-foreground">
                        <BedDouble className="w-4 text-primary" /> 5 Beds
                    </span>
                    <span className="flex items-center gap-2 text-[11px] capitalize text-muted-foreground">
                        <Bath className="w-4 text-primary" /> 5 bathrooms
                    </span>
                    <span className="flex items-center gap-2 text-[11px] lowercase text-muted-foreground">
                        <Ratio className="w-4 text-primary" /> 8x10 m<sup className="-ml-2">2</sup>
                    </span>
                </div>
            </div>

            <div className="w-full flex items-center justify-between gap-2 px-2 py-3 border-t ">
                <h3 className="text-sm font-medium ">₦6,000,000 / <span className="text-[11px] text-muted-foreground">year</span></h3>
                <Button onClick={() => router.push('/listings/somerandomid')} size='icon' variant='default' className="rounded-full w-8 h-8" >
                    <ChevronRight className="w-4"/>
                </Button>
            </div>
        </div>
    )
}





export function ImageSlider({ images = [] }: { images?: string[] }) {
    const randomDelay = useMemo(() => Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000, []);
  
  // Create a ref with a unique Autoplay instance using the random delay
  const pluginRef = useRef(Autoplay({ delay: randomDelay, stopOnInteraction: true }));
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
  
    useEffect(() => {
      if (!api) return;
  
      setCount(api.scrollSnapList().length);
  
      const onSelect = () => {
        setCurrent(api.selectedScrollSnap());
      };
  
      api.on("select", onSelect);
      return () => {
        api.off("select", onSelect);
      };
    }, [api]);
  
    return (
      <Carousel
        setApi={setApi}
        className="w-full relative h-[200px] max-h-[200px] overflow-hidden rounded-2xl"
        plugins={[pluginRef.current]}
        onMouseEnter={() => pluginRef.current.stop()}
        onMouseLeave={() => pluginRef.current.play()}
      >
        {/* Popular Button */}
        <div className="absolute top-3 left-3 z-10">
          <Button size="sm" className="rounded-full flex items-center gap-1 text-[11px] capitalize">
            <Sparkle className="w-4" /> Popular
          </Button>
        </div>
  
        {/* Navigation Buttons */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-4">
          <CarouselPrevious className="border-none relative left-0 top-3" />
          <CarouselNext className="border-none relative left-0 top-3" />
        </div>
  
        {/* Favorite Button */}
        <div className="absolute w-fit right-0 bottom-0 p-3 rounded-xl items-center z-10">
          <Button size="icon" className="rounded-full bg-background hover:bg-slate-100 text-black">
            <Heart className="w-4" />
          </Button>
        </div>
  
        {/* Carousel Content */}
        <CarouselContent className="rounded-xl">
          {images.length === 0 ? (
            <CarouselItem>
              <Skeleton className="w-full rounded-xl h-[200px]" />
            </CarouselItem>
          ) : (
            images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <img src={image} alt="image" className="w-full h-full object-cover flex rounded-xl" />
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
      </Carousel>
    );
  }