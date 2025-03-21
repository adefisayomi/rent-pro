"use client"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import useAuthStore from "@/contexts/useAuth"
import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas"
import SingleProperty from "@/sections/property/singleProperty"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import DropDownComp from "@/components/DropdownComp"
import { Button } from "@/components/ui/button"
import { Search, Trash2 } from "lucide-react"
import { _favouriteSort } from "@/_data/images"
import dayjs from "dayjs";
import Image from "next/image"
import currency from "currency.js"
import useAlert from "@/hooks/useAlert"
import { addToFavourites } from "@/actions/favourites"


export default function Favourites ({favourites}: {favourites: (NewPropertySchemaType & { createdAt: string, id: string })[]}) {
    const {claims} = useAuthStore()
    const totalProperty = favourites && favourites.length || 0
    const totalPage = favourites && favourites.length <= 6 ? 1 : customDivision(favourites.length, 6)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const pathname = usePathname()
    const [sort, setSort] = useState('newest')
    const {setAlert} = useAlert()

    const nextPage = () => page < totalPage && setPage(page+1)
    const prevPage = () => page > 1 && setPage(page - 1)

    
    const handleLoveClick = async (propertyId: string) => {
      if (!propertyId) return;
  
      const { data, success } = await addToFavourites(propertyId);
      if (success) {
        setAlert("Removed from favourites", "success");
      } 
    };

    return (
        <div className="w-full flex flex-col  ">
            <h2 className="text-xs font-semibold capitalize pb-4">favourites</h2>

            {
                claims?.accountType === "agent" ? (
                    // Agent component
                    <div className="border rounded-lg min-h-[400px] flex flex-col">
                        <div className="w-full flex items-center justify-between p-2">
                            <p className="text-[11px] text-muted-foreground">You have <span className="font-bold">{totalProperty}</span> properties in your favourite list</p>

                            <div className="flex items-center gap-2">
                                <p className="text-[11px] font-medium capitalize">sort by:</p>
                                <DropDownComp 
                                    title={sort}
                                    className="w-fit gap-2 border text-[11px]" 
                                    component={
                                           <div className="flex w-[100px] flex-col gap-2">
                                            {
                                                 _favouriteSort.map((_sort, index) => (
                                                    <Button key={index} onClick={() => setSort(_sort)} className="text-[11px] w-full capitalize" variant='ghost'>
                                                        {_sort}
                                                    </Button>
                                                ))
                                            }
                                           </div>
                                    }
                                />
                                <Button variant="ghost" className="rounded-[8px] w-8 h-8 bg-muted" size='icon'>
                                    <Search className="w-4"/>
                                </Button>
                            </div>
                        </div>

                        <div className="flex-grow">
                        <Table>
                            <TableHeader className="border-y bg-slate-100">
                            <TableRow className="py-10 h-14">
                                <TableHead className="w-[300px] text-[11px] capitalize text-slate-800 font-semibold">listing</TableHead>
                                <TableHead className=" text-[11px] text-center capitalize text-slate-800 font-semibold">date published</TableHead>
                                <TableHead className=" text-[11px] text-center capitalize text-slate-800 font-semibold">view</TableHead>
                                <TableHead className="text-center text-[11px] capitalize text-slate-800 font-semibold">action</TableHead>
                            </TableRow>
                            </TableHeader>

                            <TableBody>
                              {favourites && favourites.length > 0 && favourites.map((pro, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="flex items-start gap-2">
                                        <Image
                                          src={pro.images[0]! as string || ''}
                                          alt={`Property Image ${index + 1}`}
                                          width={300}
                                          height={300}
                                          className="w-full max-w-28 aspect-[3/2] rounded-md object-cover"
                                          loading="lazy"
                                          unoptimized
                                        />

                                        <div className="flex flex-col gap-1 items-start">
                                            <h4 className="text-[11px] font-semibold capitalize text-gray-600">{pro.title}</h4>
                                            <h4 className="text-[11px] font-medium text-muted-foreground ">{pro.address}</h4>
                                            <h4 className="text-[11px] font-semibold text-gray-700">{currency(pro?.price, { symbol: "₦", precision: 2 }).format()}</h4>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center text-[11px]">{pro?.createdAt ? dayjs(pro?.createdAt).format("DD MMM, YYYY") : '-'}</TableCell> 
                                    <TableCell className="text-center text-[11px] ">20</TableCell>
                                    <TableCell className=" relative">
                                     <Button onClick={() => handleLoveClick(pro.id)} variant='ghost' size='sm' className="flex items-center gap-2  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                      <Trash2 className="w-4" /> Delete
                                     </Button>
                                    </TableCell>
                                  </TableRow>
                              ))}
                            </TableBody>
                            
                        </Table>
                        </div>


                        <div className="border-t p-2 flex items-center justify-end">
                            <PaginationNav currectPage={page} totalPage={totalPage} prevPage={prevPage} nextPage={nextPage} />
                        </div>
                    </div>
                ) 
                
                : 
                
                (
                    //Renter component
                    <div className="w-full flex flex-col">
                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 min-h-[400px] flex-grow">
                            {
                                favourites && favourites.length > 0 && (
                                    favourites.map((fav, index) => (
                                        <SingleProperty property={fav as any} key={index} />
                                    ))
                                )
                            }
                        </div>

                        <div className="w-full flex items-center justify-end border rounded-lg p-2 mt-6">
                        <PaginationNav currectPage={page} totalPage={totalPage} prevPage={prevPage} nextPage={nextPage} />
                        </div>
                    </div>
                )
            }
        </div>
    )
}



  
function PaginationNav ({nextPage, prevPage, currectPage, totalPage}: {nextPage: any, prevPage: any, currectPage: number, totalPage: number}) {

    return (
      <Pagination className="w-fit ">
        <PaginationContent className=" w-fit">

          <PaginationItem>
            <PaginationPrevious onClick={prevPage} />
          </PaginationItem>

          <PaginationItem>
          <PaginationLink href="#" isActive>
            {currectPage}
          </PaginationLink>
        </PaginationItem>

        <span className="text-[10px] lowercase text-muted-foreground font-medium mx-1">of</span>

        <PaginationItem>
          <PaginationLink href="#">
            {totalPage}
          </PaginationLink>
        </PaginationItem>

          <PaginationItem>
            <PaginationNext onClick={nextPage}/>
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    )
  }
  

  function customDivision(dividend: number, divisor: number) {
    const remainder = dividend % divisor;
    return remainder === 0 ? dividend / divisor : Math.floor(dividend / divisor) + 1;
  }

