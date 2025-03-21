"use client"

import { _amenities, _propertyTypes, _securities } from "@/_data/images"
  import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { SlidersHorizontal, X } from "lucide-react"
import { filterFormSchema } from "./formSchemas"
import yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import useLocalStorage from "@/hooks/useLocalstorage"
import { useEffect } from "react"
import DropDownComp from "@/components/DropdownComp"





type FilterFormData = yup.InferType<typeof filterFormSchema>;

export default function HomeFilterForm ({onClose}: {onClose?: () => void}) {

  const [savedFilters, setSavedFilters] = useLocalStorage<FilterFormData>('queryfilterForm', {
    type: [],
    amenities: [],
    security: [],
    min: '',
    max: '',
    bedrooms: 0,  // Ensure numbers are explicitly set
    bathrooms: 0,
    garages: 0,
    parkings: 0,
  });
  const _priceList: Record<string, string> = generatePriceList();
  
  const form = useForm<FilterFormData>({
    resolver: yupResolver(filterFormSchema),
    defaultValues: {
      type: savedFilters.type ?? [],
      amenities: savedFilters.amenities ?? [],
      security: savedFilters.security ?? [],
      min: savedFilters.min ?? '',
      max: savedFilters.max ?? '',
      bedrooms: savedFilters.bedrooms ?? 0, 
      bathrooms: savedFilters.bathrooms ?? 0,
      garages: savedFilters.garages ?? 0,
      parkings: savedFilters.parkings ?? 0,
    },
  });
  
  // Update local storage whenever form values change
  useEffect(() => {
    const subscription = form.watch((values: any) => {
      setSavedFilters({
        type: values.type ?? [],
        amenities: values.amenities ?? [],
        security: values.security ?? [],
        min: values.min ?? '',
        max: values.max ?? '',
        bedrooms: values.bedrooms ?? 0,
        bathrooms: values.bathrooms ?? 0,
        garages: values.garages ?? 0,
        parkings: values.parkings ?? 0,
      });
    });
  
    return () => subscription.unsubscribe(); // Cleanup subscription
  }, [form.watch, setSavedFilters]);
  
  const onSubmit = async (data: FilterFormData) => {
    console.log(data);
  };
  
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" text-white flex flex-col w-full">
        <div className="w-full flex items-center bg-slate-900 justify-between gap-2 p-4 pl-10  border-b border-muted-foreground">
            <h2 className="text-sm font-semibold capitalize">Filter</h2>
            <Button onClick={onClose} variant='outline' className=" group/closeButton border-muted-foreground border rounded-xl bg-slate-800 flex items-center gap-2">
                Close
                <X className="w-4 text-muted group-hover/closeButton:text-gray-800" />
            </Button>
        </div>

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full p-4 pl-10 bg-slate-900 flex flex-col items-start gap-3 border-b border-muted-foreground">
              <FormLabel className=" capitalize text-xs text-white font-medium">Property Type</FormLabel>
              <FormControl>
                <div className="w-full flex flex-col gap-2  max-h-72 overflow-y-auto">
                  {_propertyTypes.map((type, index) => (
                    <div key={index} className="w-full flex items-center gap-2 ">
                      <Checkbox
                        id={type}
                        name={type}
                        checked={field.value?.includes(type) || false}
                        onCheckedChange={() => {
                          const newValue = field.value ?? [];
                          if (newValue.includes(type)) {
                            field.onChange(newValue.filter((t) => t !== type));
                          } else {
                            field.onChange([...newValue, type]);
                          }
                        }}
                      />
                      <label className="text-xs capitalize" htmlFor={type}>
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full grid grid-cols-2 gap-4 items-center p-4 pl-10 bg-slate-900 border-b border-muted-foreground">
          <FormField
              control={form.control}
              name="min"
              render={({ field }) => (
                  <FormItem className="w-full">
                  <FormLabel className="capitalize text-xs text-white font-medium">Min Price</FormLabel>
                  <FormControl>
                  <DropDownComp
                      title={_priceList[String(field.value) || '100000']} // Convert field.value to a string
                      className="bg-slate-900 text-white border border-muted-foreground text-[11px]"
                      component={
                        <ul>
                          {Object.entries(_priceList).map(([key, value], i) => (
                            <li
                              key={i}
                              onClick={() => field.onChange(Number(key))} // Ensure key is a number
                              value={key}
                              className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md"
                            >
                              {value}
                            </li>
                          ))}
                        </ul>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="max"
              render={({ field }) => (
                  <FormItem className="w-full">
                  <FormLabel className="capitalize text-xs text-white font-medium">Max Price</FormLabel>
                  <FormControl>
                  <DropDownComp
                      title={_priceList[String(field.value) || '400000']} // Convert field.value to a string
                      className="bg-slate-900 text-white border border-muted-foreground text-[11px]"
                      component={
                        <ul>
                          {Object.entries(_priceList).map(([key, value], i) => (
                            <li
                              key={i}
                              onClick={() => field.onChange(Number(key))} // Ensure key is a number
                              value={key}
                              className="text-muted-foreground text-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 rounded-md"
                            >
                              {value}
                            </li>
                          ))}
                        </ul>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
            />
        </div>

        <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
                <FormItem className="w-full p-4  border-b border-muted-foreground pl-10 bg-slate-900">
                <FormLabel className="capitalize text-xs text-white font-medium">Bedrooms</FormLabel>
                <FormControl>
                <ToggleGroup value={field.value ? String(field.value) : "1"} onValueChange={field.onChange} type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem className="border-muted-foreground" size='sm' value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
                        <p className="text-xs capitalize">{index === 0 ? 'any' : `${index}+`}</p>
                      </ToggleGroupItem>
                    ))
                  }
                </ToggleGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
                <FormItem className="w-full p-4  border-b border-muted-foreground pl-10 bg-slate-900">
                <FormLabel className="capitalize text-xs text-white font-medium">bathrooms</FormLabel>
                <FormControl>
                <ToggleGroup value={field.value ? String(field.value) : "1"} onValueChange={field.onChange} type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem className="border-muted-foreground" size='sm' value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
                        <p className="text-xs capitalize">{index === 0 ? 'any' : `${index}+`}</p>
                      </ToggleGroupItem>
                    ))
                  }
                </ToggleGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="garages"
            render={({ field }) => (
                <FormItem className="w-full p-4  border-b border-muted-foreground pl-10 bg-slate-900">
                <FormLabel className="capitalize text-xs text-white font-medium">garages</FormLabel>
                <FormControl>
                <ToggleGroup value={field.value ? String(field.value) : "1"} onValueChange={field.onChange} type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem className="border-muted-foreground" size='sm' value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
                        <p className="text-xs capitalize">{index === 0 ? 'any' : `${index}+`}</p>
                      </ToggleGroupItem>
                    ))
                  }
                </ToggleGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parkings"
            render={({ field }) => (
                <FormItem className="w-full p-4  border-b border-muted-foreground pl-10 bg-slate-900">
                <FormLabel className="capitalize text-xs text-white font-medium">parkings</FormLabel>
                <FormControl>
                <ToggleGroup value={field.value ? String(field.value) : "1"} onValueChange={field.onChange} type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem className="border-muted-foreground" size='sm' value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
                        <p className="text-xs capitalize">{index === 0 ? 'any' : `${index}+`}</p>
                      </ToggleGroupItem>
                    ))
                  }
                </ToggleGroup>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
          />


        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem className="w-full p-4 pl-10  border-b border-muted-foreground bg-slate-900 flex flex-col items-start gap-3">
              <FormLabel className=" capitalize text-xs text-white font-medium">Amenities</FormLabel>
              <FormControl>
                <div className="w-full flex flex-col gap-2  max-h-72 overflow-y-auto">
                  {_amenities.map((type, index) => (
                    <div key={index} className="w-full flex items-center gap-2 ">
                      <Checkbox
                        id={type}
                        name={type}
                        checked={field.value?.includes(type) || false}
                        onCheckedChange={() => {
                          const newValue = field.value ?? [];
                          if (newValue.includes(type)) {
                            field.onChange(newValue.filter((t) => t !== type));
                          } else {
                            field.onChange([...newValue, type]);
                          }
                        }}
                      />
                      <label className="text-xs capitalize" htmlFor={type}>
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="security"
          render={({ field }) => (
            <FormItem className="w-full p-4 pl-10 border-b border-muted-foreground bg-slate-900 flex flex-col items-start gap-3">
              <FormLabel className=" capitalize text-xs text-white font-medium">securities</FormLabel>
              <FormControl>
                <div className="w-full flex flex-col gap-2  max-h-72 overflow-y-auto">
                  {_securities.map((type, index) => (
                    <div key={index} className="w-full flex items-center gap-2 ">
                      <Checkbox
                        id={type}
                        name={type}
                        checked={field.value?.includes(type) || false}
                        onCheckedChange={() => {
                          const newValue = field.value ?? [];
                          if (newValue.includes(type)) {
                            field.onChange(newValue.filter((t) => t !== type));
                          } else {
                            field.onChange([...newValue, type]);
                          }
                        }}
                      />
                      <label className="text-xs capitalize" htmlFor={type}>
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}


const generatePriceList = (): Record<number, string> => {
  const prices: Record<number, string> = {};

  const addPrice = (price: number, label: string) => {
    prices[price] = `₦ ${label}`;
  };

  // Define specific price ranges and steps
  const ranges = [
    { max: 1_000_000, step: 100_000 },   // 100,000 to 1 Million
    { max: 10_000_000, step: 1_000_000 }, // 1 Million to 10 Million
    { max: 100_000_000, step: 10_000_000 }, // 10 Million to 100 Million
    { max: 300_000_000, step: 50_000_000 }  // 100 Million to 300 Million
  ];

  // Populate price options
  ranges.forEach(({ max, step }) => {
    for (let price = Object.keys(prices).length === 0 ? 100_000 : Math.max(...Object.keys(prices).map(Number)) + step;
      price <= max;
      price += step) {
      const formattedPrice = price >= 1_000_000
        ? `${(price / 1_000_000).toLocaleString()} Million`
        : `${price.toLocaleString()}`;
      addPrice(price, formattedPrice);
    }
  });

  return prices;
};
