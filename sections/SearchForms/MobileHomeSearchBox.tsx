import { _propertyTypes } from "@/_data/images"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import AutocompleteComponent from "./AutocompleteComponent"
import useCookies from "@/hooks/useCookies"
import MobileFilter from "../filter/mobileFilter"

  

export function MobileHomeSearchBox () {
    const _priceList = generatePriceList();

    const [query, setQuery] = useCookies('searc-query', {
        type: '',
        min: '',
        max: '',
        location: {},
        filter: {}
    }, 10)
    const setLocation = (location: any) => setQuery({...query, location})
    const handleSetQuery = (e: any, value: any) => setQuery({...query, [e.target.name]: value})
    console.log(query)

    return (
        <div className="w-full max-w-[93%] mx-auto rounded-xl flex flex-col gap-3 bg-theme-dark p-4">
            <Select name="type" >
                <SelectTrigger className="w-full text-xs capitalize bg-background">
                    <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                
                <SelectContent>
                    <SelectGroup>
                        {
                            _propertyTypes.map((type, index) => (
                                <SelectItem value={type} className='text-xs capitalize p-2' key={index}>{type}</SelectItem>
                            ))
                        }
                    </SelectGroup>
                </SelectContent>
            </Select>

            <AutocompleteComponent setLocation={setLocation} />

            <div className="w-full grid grid-cols-2 gap-2 items-center">
                <Select>
                    <SelectTrigger className="text-xs capitalize bg-background">
                        <SelectValue placeholder="Min Price" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
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

                <Select>
                    <SelectTrigger className="text-xs capitalize bg-background">
                        <SelectValue placeholder="Max Price" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectGroup>
                        <SelectItem className="text-xs" value="no min">No Max</SelectItem>
                        {_priceList.map((price, index) => (
                            <SelectItem key={index} className="text-xs capitalize" value={price.value.toString()}>
                            {price.label}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="w-full flex items-center gap-2">
               <Button className="w-full h-12">Search</Button>
               <MobileFilter />
            </div>
        </div>
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
  