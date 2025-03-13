"use client"

import { Button } from "@/components/ui/button"


type ImagesProps = {
    images: string[]
}
export default function HomeGallery ({images}: ImagesProps) {

    return (
        <div className="w-full bg-white">
        <div className="w-full px-4 py-8 md:py-20 max-w-8xl mx-auto md:h-screen">
            <div className="w-full flex flex-col h-full md:flex-row-reverse md:items-center items-start gap-8 md:gap-20">
                <Gallery images={images} />
                <div className='flex flex-col items-start gap-3 max-w-md'>
                    <h4 className="text-primary uppercase text-xs font-medium">mervelous world</h4>
                    <h1 className="text-2xl md:text-4xl capitalize font-bold text-start">Image Speaks <br /> Volume: Explore the <br /> Our Gallery.</h1>
                    <p className="text-xs text-muted-foreground">Lorem ipsum dolor sit  molestiae delectus, iste velit ad quidem perferendis.</p>
                    <Button className="w-full max-w-[150px] text-xs md:h-12">
                        View all photo
                    </Button>
                </div>
            </div>
        </div>
        </div>
    )
}

const Gallery = ({ images }: ImagesProps) => {
    return (
       <div className="w-full h-full rounded-xl grid grid-cols-3 grid-rows-2 gap-2 md:gap-4">
            <div className="grid grid-rows-2 row-span-2 gap-2 md:gap-4">
                <div className="rounded-xl overflow-hidden">
                    <img src={images[0]} alt="" className="w-full h-full rounded-lg object-cover hover:scale-105 duration-300" />
                </div>
                <div className="rounded-xl overflow-hidden">
                    <img src={images[1]} alt="" className="w-full h-full rounded-lg object-cover hover:scale-105 duration-300" />
                </div>
            </div>
            <div className="grid row-span-2 overflow-hidden rounded-xl">
                <img src={images[2]} alt="" className="w-full h-full rounded-lg object-cover hover:scale-105 duration-300" />
            </div>
            <div className="grid grid-rows-2 row-span-2 gap-2 md:gap-4">
                <div className="rounded-xl overflow-hidden">
                    <img src={images[3]} alt="" className="w-full h-full rounded-lg object-cover hover:scale-105 duration-300" />
                </div>
                <div className="rounded-xl overflow-hidden">
                    <img src={images[4]} alt="" className="w-full h-full rounded-lg object-cover hover:scale-105 duration-300" />
                </div>
            </div>
       </div>
    );
  };
