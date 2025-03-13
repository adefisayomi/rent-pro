"use client"

import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { propertySearchSchema } from "./formSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import useLocalStorage from "@/hooks/useLocalstorage";
import AutocompleteComponent from "./AutocompleteComponent";
import useResponsive from "@/hooks/useResponsive";
import MobileFilter from "../filter/mobileFilter";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import DropDownComp from "@/components/DropdownComp";
import { _propertyTypes } from "@/_data/images";



export function HomeSearchBox() {

  const isDesktop = useResponsive() === "desktop";

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
    console.log("Submitted Data:", data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 md:p-6 p-4 bg-slate-900 rounded-2xl max-w-5xl"
      >

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center w-full border-b border-muted-foreground text-background pb-3">
                <FormControl>
                  <ToggleGroup value={field.value} defaultValue={field.value} onValueChange={field.onChange} type="single" className="grid grid-cols-3 w-full max-w-sm">
                      <ToggleGroupItem value="buy" aria-label="buy">
                        <h3 className="text-sm capitalize font-semibold ">buy</h3>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="rent" aria-label="rent">
                      <h3 className="text-sm capitalize font-semibold ">rent</h3>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="short-let" aria-label="short-let">
                      <h3 className="text-sm capitalize font-semibold ">short let</h3>
                      </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />


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
                    title={field.value!}
                    component={
                      <div className="flex w-full flex-col gap-2 items-start">
                        {_priceList.map((price, index) => (
                          <Button
                            onClick={() => field.onChange(price.label)}
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
                    title={field.value!}
                    component={
                      <div className="flex w-full flex-col gap-2 items-start">
                        {_priceList.map((price, index) => (
                          <Button
                            onClick={() => field.onChange(price.label)}
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

          <Button className="px-4 hidden md:flex">Search</Button>
        </div>

        {!isDesktop && (
          <div className="md:hidden flex items-center w-full gap-4">
            <Button className="w-full" type='submit'>Search</Button>
            <MobileFilter />
          </div>
        )}
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