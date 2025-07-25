
import { _properties } from "@/_data/images";
import { getAllProperties } from "@/actions/property";
import LayoutWithImageHeader from "@/components/layoutWithImageHeader";
import HomeGallery from "@/sections/home/HomeGallery";
import TestimonialSlider from "@/sections/home/TestimonialSlider";
import WhyChooseUs from "@/sections/home/WhyChooseUs";
import SingleProperty from "@/sections/property/singleProperty";
import { HomeSearchBox } from "@/sections/SearchForms/HomeSearchBox";


export default async function Index() {
  const latestProperties = await (await getAllProperties()).data
  return (
    <LayoutWithImageHeader
      bgImage="https://images.unsplash.com/photo-1649770638560-b0011db12a76?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      component={
        <div className="p-2 w-full flex items-center justify-center absolute top-52 lg:relative z-20 lg:top-0">
          <HomeSearchBox />
        </div>
      }
    >
      <div className="py-32 lg:hidden flex bg-white" />
      <div className="flex w-full items-center justify-center flex-col ">
        <div className="w-full bg-[#edefff] px-2 py-8 md:py-20 md:h-screen flex flex-col items-center justify-center">
          <div className="flex w-full flex-col gap-3 mb-6 md:mb-8">
            <p className="text-xs font-medium uppercase text-primary text-center">explore properties</p>
            <h2 className="text-xl md:text-3xl capitalize font-bold text-center">comfort living solution</h2>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-2 gap-4 max-w-8xl mx-auto">
            {
              latestProperties && latestProperties.length > 0 && latestProperties.slice(0, 4).map((property, index) => (
                <SingleProperty property={property as any} key={index} />
              ))
            }
          </div>
        </div>

        <HomeGallery images={_properties.map((_) => _.image)} />
        <WhyChooseUs />
        <TestimonialSlider />
      </div>
    </LayoutWithImageHeader>
  );
}
