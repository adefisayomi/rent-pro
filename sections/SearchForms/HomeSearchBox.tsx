"use client"

import { useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { generatePriceList } from "./generatePriceList";


export function HomeSearchBox() {

  const isDesktop = useResponsive() === "desktop";
  const router = useRouter()

  const [savedFormValues, setSavedFormValues] = useLocalStorage("propertySearchForm", {
    min: "",
    max: "",
    type: "all type",
    location: {},
    listedIn: 'all',
  });
  const setLocation = (location: any) => setSavedFormValues({...savedFormValues, location})

  const form = useForm<yup.InferType<typeof propertySearchSchema>>({
    resolver: yupResolver(propertySearchSchema),
    defaultValues: savedFormValues, // Load saved values
  });

  const _priceList = generatePriceList();

  useEffect(() => {
    const subscription = form.watch((values) => {
      setSavedFormValues({...savedFormValues, ...values});
    });
  
    return () => subscription.unsubscribe(); // Cleanup subscription
  }, [form.watch, setSavedFormValues]);

  
  function onSubmit(data: yup.InferType<typeof propertySearchSchema>) {
    const query: Record<string, string | number> = {
      min: data.min ?? "",
      max: data.max ?? "",
      type: data.type ?? "",
      address: (savedFormValues.location as any)?.display_name ?? "", // ✅ Fix type error
      country: (savedFormValues.location as any)?.address?.country ?? "",
      state: (savedFormValues.location as any)?.address?.state ?? "",
      city: (savedFormValues.location as any)?.display_place ?? "",
      coordinates:
      (savedFormValues.location as any)?.lat !== undefined && (savedFormValues.location as any)?.lon !== undefined
          ? `${(savedFormValues.location as any)?.lat},${(savedFormValues.location as any)?.lon}`
          : "",
      listedIn: data.listedIn ?? "",
    };

    const filteredQuery = Object.fromEntries(
      Object.entries(query).filter(([_, v]) => v !== "")
    );
  
    // Convert to query string
    const queryString = new URLSearchParams(filteredQuery as Record<string, string>).toString();
  
    router.push(`/listings?${queryString}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3 md:p-6 p-4 bg-slate-900 rounded-2xl max-w-5xl"
      >

          <FormField
            control={form.control}
            name="listedIn"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center w-full border-b border-muted-foreground text-background pb-3">
                <FormControl>
                  <ToggleGroup value={field.value} defaultValue={field.value} onValueChange={field.onChange} type="single" className="grid grid-cols-2 md:grid-cols-4 w-full max-w-md">
                      <ToggleGroupItem value="all" aria-label="all">
                        <h3 className="text-sm capitalize font-semibold ">all</h3>
                      </ToggleGroupItem>
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
          name="type"
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


        <div className="w-full col-span-3">
          <AutocompleteComponent setLocation={setLocation} />
        </div>

        <div className="w-full flex items-center gap-2 col-span-2">
        <FormField
          control={form.control}
          name="min"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <DropDownComp
                  title={_priceList.find((p) => p.value === Number(field.value))?.label || "min Price"}
                  component={
                    <div className="flex w-full flex-col gap-2 items-start">
                      {_priceList.map((price, index) => (
                        <Button
                          onClick={() => field.onChange(price.value)}
                          variant="ghost"
                          key={index}
                          className="text-xs capitalize w-full"
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
            name="max"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DropDownComp
                    title={_priceList.find((p) => p.value === Number(field.value))?.label || "max Price"}
                    component={
                      <div className="flex w-full flex-col gap-2 items-start">
                        {_priceList.map((price, index) => (
                          <Button
                            onClick={() => field.onChange(price.value)}
                            variant="ghost"
                            key={index}
                            className="text-xs capitalize w-full"
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


          <Button type='submit' loading={form.formState.isSubmitting} className="px-4 hidden md:flex">Search</Button>
        </div>

        {!isDesktop && (
          <div className="md:hidden flex items-center w-full gap-4">
            <Button loading={form.formState.isSubmitting} className="w-full">Search</Button>
            <MobileFilter />
          </div>
        )}
        </div>
      </form>
    </Form>
  );
}

