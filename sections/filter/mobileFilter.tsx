import { _amenities, _propertyTypes, _securities } from "@/_data/images"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"


  
  export default function MobileFilter () {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="bg-background w-12 hover:bg-muted" size='icon'>
            <SlidersHorizontal className="w-4 text-black" />
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent className="border-none p-0" >
          <div className="w-full h-screen bg-theme-dark text-white">
              <AlertDialogTitle className="w-full flex items-center justify-between p-3 border-b">
                <h2 className="text-sm font-semibold capitalize">Filter</h2>
                  <AlertDialogCancel>
                    <Button className="bg-theme-dark border-muted" variant='outline'>
                      Close
                      <X className="w-5" />
                    </Button>
                  </AlertDialogCancel>
              </AlertDialogTitle>

              <div className="w-full h-full overflow-y-auto pb-10">
                <FilterForm />
              </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    )
  }



type FilterFormData = yup.InferType<typeof filterFormSchema>;

export const FilterForm = () => {

  const form = useForm<FilterFormData>({
    resolver: yupResolver(filterFormSchema),
    defaultValues: {type: [], max: '', min: ''},
  });

  const _priceList = generatePriceList();

  const onSubmit = async (data: FilterFormData) => {
    console.log(data)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="py-5">

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="w-full border-b p-4 flex flex-col items-start gap-3">
              <FormLabel className=" capitalize">Property Type</FormLabel>
              <FormControl>
                <div className="w-full flex flex-col gap-2">
                  {_propertyTypes.map((type, index) => (
                    <div key={index} className="w-full flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={field.value?.includes(type) || false}
                        onChange={() => {
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


        <div className="w-full grid grid-cols-2 gap-2 items-center p-4 border-b">
        <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
                <FormItem className="w-full">
                <FormLabel>Min Price</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="text-xs capitalize bg-transparent">
                          <SelectValue placeholder="Min Price" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectGroup>
                          <SelectItem className="text-xs" value="no min">no min</SelectItem>
                          {_priceList.map((price, index) => (
                              <SelectItem key={index} className="text-xs capitalize" value={price.value.toString()}>
                              {price.label}
                              </SelectItem>
                          ))}
                          </SelectGroup>
                      </SelectContent>
                  </Select>
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
                <FormLabel>Max Price</FormLabel>
                <FormControl>
                  <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="text-xs capitalize bg-transparent">
                          <SelectValue placeholder="Max Price" />
                      </SelectTrigger>
                      <SelectContent className="text-xs">
                          <SelectGroup>
                          <SelectItem className="text-xs" value="no min">no max</SelectItem>
                          {_priceList.map((price, index) => (
                              <SelectItem key={index} className="text-xs capitalize" value={price.value.toString()}>
                              {price.label}
                              </SelectItem>
                          ))}
                          </SelectGroup>
                      </SelectContent>
                  </Select>
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
                <FormItem className="w-full p-4 border-b">
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                <ToggleGroup type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
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
                <FormItem className="w-full p-4 border-b">
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                <ToggleGroup type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
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
                <FormItem className="w-full p-4 border-b">
                <FormLabel>Garages</FormLabel>
                <FormControl>
                <ToggleGroup type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
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
                <FormItem className="w-full p-4 border-b">
                <FormLabel>Parkings</FormLabel>
                <FormControl>
                <ToggleGroup type="single" variant="outline" className="w-full flex items-center justify-between gap-1">
                  {
                    Array.from({length: 6}).map((_, index) => (
                      <ToggleGroupItem value={index === 0 ? 'any' : JSON.stringify(index)} aria-label="Toggle bold" key={index}>
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
            <FormItem className="w-full border-b p-4 flex flex-col items-start gap-3">
              <FormLabel className=" capitalize">Amenities</FormLabel>
              <FormControl>
                <div className="w-full flex flex-col gap-2">
                  {_amenities.map((type, index) => (
                    <div key={index} className="w-full flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={field.value?.includes(type) || false}
                        onChange={() => {
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
            <FormItem className="w-full border-b p-4 flex flex-col items-start gap-3">
              <FormLabel className=" capitalize">Security</FormLabel>
              <FormControl>
                <div className="w-full flex flex-col gap-2">
                  {_securities.map((type, index) => (
                    <div key={index} className="w-full flex items-center gap-2">
                      <Checkbox
                        id={type}
                        checked={field.value?.includes(type) || false}
                        onChange={() => {
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
     
       <div className="w-full p-3 pt-4"> <Button type="submit" className="w-full">Update</Button></div>
      </form>
    </Form>
  )
}


const generatePriceList = (): { value: number, label: string }[] => {
  const prices: { value: number, label: string }[] = [];

  const addPrice = (price: number, label: string) => {
    prices.push({ value: price, label: `₦ ${label}` });
  };

  // Add specific ranges
  const ranges = [
    { max: 1000000, step: 100000 },   // 100,000 to 1 Million
    { max: 10000000, step: 1000000 }, // 1 Million to 10 Million
    { max: 100000000, step: 10000000 }, // 10 Million to 100 Million
    { max: 300000000, step: 50000000 }  // 100 Million to 300 Million
  ];

  // Populate price options
  ranges.forEach(({ max, step }) => {
    for (let price = prices.length === 0 ? 100000 : prices[prices.length - 1].value + step; price <= max; price += step) {
      const formattedPrice = price >= 1000000
        ? `${(price / 1000000).toLocaleString()} Million`
        : `${price.toLocaleString()}`;
      addPrice(price, formattedPrice);
    }
  });

  return prices;
};