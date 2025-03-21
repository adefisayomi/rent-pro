"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import useLocalStorage from "@/hooks/useLocalstorage";
import useResponsive from "@/hooks/useResponsive";
import DropDownComp from "@/components/DropdownComp";
import { _propertyTypes } from "@/_data/images";
import { useRouter } from "next/navigation";
import AutocompleteComponent from "@/sections/SearchForms/AutocompleteComponent";
import { propertySearchSchema } from "@/sections/SearchForms/formSchemas";



export default function GalleryFilter () {

  const isDesktop = useResponsive() === "desktop";
  const router = useRouter()

  const [savedFormValues, setSavedFormValues] = useLocalStorage("propertySearchForm", {
    minPrice: "no min",
    maxPrice: "no max",
    propertyType: "All type",
    bedrooms: "any",
    location: {},
    type: 'rent'
  });

  const form = useForm<yup.InferType<typeof propertySearchSchema>>({
    resolver: yupResolver(propertySearchSchema),
    defaultValues: savedFormValues, // Load saved values
  });

  const _priceList = generatePriceList();

  useEffect(() => {
    const subscription = form.watch((values) => {
      setSavedFormValues({
        minPrice: values.minPrice ?? "no min",
        maxPrice: values.maxPrice ?? "no max",
        propertyType: values.propertyType ?? "All type",
        bedrooms: values.bedrooms ?? "any",
        location: values.location ?? {}, // Ensure location is an object
        type: 'rent'
      });
    });
  
    return () => subscription.unsubscribe(); // Cleanup subscription
  }, [form.watch, setSavedFormValues]);

  function onSubmit(data: yup.InferType<typeof propertySearchSchema>) {
    const query = {
      min: data.minPrice,
      max: data.maxPrice,
      type: data.type,
      address: data.location?.display_address,
      country: data.location?.address?.country,
      state: data.location?.address?.state,
      city: data.location?.address?.county,
      lon: data.location?.lon,
      lat: data.location?.lat,
      bedrooms: data.bedrooms,
      propertyType: data.propertyType
    }
    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== undefined && v !== null)
    );
    
    // Convert to query string
    const queryString = new URLSearchParams(filteredQuery).toString();
    
    router.push(`/gallery?${queryString}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full bg-slate-900 max-w-8xl"
      >

        <div className="w-full md:grid flex flex-col md:grid-cols-6 gap-4 md:gap-2">
        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DropDownComp
                  title={field.value || "property type"}
                  component={
                    <div className="flex w-full flex-col gap-1 items-start">
                      {_propertyTypes.map((type, index) => (
                        <Button
                          size="sm"
                          onClick={() => field.onChange(type)}
                          variant="ghost"
                          key={index}
                          className="text-xs w-full flex justify-start items-center rounded-none capitalize"
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
          name="location"
          render={({ field }) => (
            <FormItem className="w-full col-span-3">
              <FormControl>
                <div className="">
                  <AutocompleteComponent setLocation={field.onChange} />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="w-full flex items-center gap-2 col-span-2">
        <FormField
          control={form.control}
          name="minPrice"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DropDownComp
                  title={_priceList.find((p) => p.value === Number(field.value))?.label || "Min Price"}
                  component={
                    <div className="flex w-full flex-col gap-2 items-start">
                      {_priceList.map((price, index) => (
                        <Button
                          onClick={() => field.onChange(price.value)}
                          variant="ghost"
                          key={index}
                          className="text-xs capitalize"
                        >
                          {price.label}
                        </Button>
                      ))}
                    </div>
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />

          <p className="text-background">-</p>
          <FormField
            control={form.control}
            name="maxPrice"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DropDownComp
                    title={_priceList.find((p) => p.value === Number(field.value))?.label || "Max Price"}
                    component={
                      <div className="flex w-full flex-col gap-2 items-start">
                        {_priceList.map((price, index) => (
                          <Button
                            onClick={() => field.onChange(price.value)}
                            variant="ghost"
                            key={index}
                            className="text-xs capitalize"
                          >
                            {price.label}
                          </Button>
                        ))}
                      </div>
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />


          <Button className="px-4 hidden md:flex">Apply</Button>
        </div>
        </div>
      </form>
    </Form>
  );
}

// Helper function to generate price list
const generatePriceList = (): { value: number; label: string }[] => {
  const prices: { value: number; label: string }[] = [];

  const addPrice = (price: number, label: string) => {
    prices.push({ value: price, label: `₦ ${label}` });
  };

  const ranges = [
    { max: 1000000, step: 100000 }, // 100,000 to 1 Million
    { max: 10000000, step: 1000000 }, // 1 Million to 10 Million
    { max: 100000000, step: 10000000 }, // 10 Million to 100 Million
    { max: 300000000, step: 50000000 }, // 100 Million to 300 Million
  ];

  ranges.forEach(({ max, step }) => {
    for (
      let price =
        prices.length === 0 ? 100000 : prices[prices.length - 1].value + step;
      price <= max;
      price += step
    ) {
      const formattedPrice =
        price >= 1000000
          ? `${(price / 1000000).toLocaleString()} Million`
          : `${price.toLocaleString()}`;
      addPrice(price, formattedPrice);
    }
  });

  return prices;
};