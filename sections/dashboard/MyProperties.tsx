"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { NewPropertySchemaType } from "@/sections/dashboard/formSchemas";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DropDownComp from "@/components/DropdownComp";
import { Button } from "@/components/ui/button";
import { Ellipsis, Eye, Pen, Route, Search, Trash2 } from "lucide-react";
import { _favouriteSort } from "@/_data/images";
import dayjs from "dayjs";
import Image from "next/image";
import currency from "currency.js";
import useAlert from "@/hooks/useAlert";
import { addToFavourites } from "@/actions/favourites";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation";
import Routes from "@/Routes";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteProperty } from "@/actions/property";



export default function MyProperties({
  properties,
}: {
  properties: (NewPropertySchemaType & { createdAt: string; id: string })[];
}) {
  const itemsPerPage = 5; // Number of properties per page
  const totalProperty = properties?.length || 0;
  const totalPage = !properties ? 0 : properties && properties.length <= itemsPerPage ? 1 : Math.ceil(properties.length / itemsPerPage);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const { setAlert } = useAlert();
  const router = useRouter()

  const nextPage = () => page < totalPage && setPage(page + 1);
  const prevPage = () => page > 1 && setPage(page - 1);

  // Get the properties to display on the current page
  const currentProperties = properties && properties.length > 0 ? properties.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ) : []

  const [deleting, setDeleting] = useState(false)
  const handleDelete = async (id: string) => {
    const {success, message} = await deleteProperty(id)
    if (!success) {
      setAlert(message, 'error')
    }
    else {
      setAlert('Propery deleted successfuly', 'success')
    }
    return setDeleting(false)
  }

  return (
    <div className="w-full flex flex-col">
      <h2 className="text-xs font-semibold capitalize pb-4">my properties</h2>

      <div className="border rounded-lg min-h-[400px] flex flex-col">
        <div className="w-full flex items-center justify-between p-2">
          <p className="text-[11px] text-muted-foreground">
          Showing <span className="font-bold">{(page - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(page * itemsPerPage, totalProperty)}</span> of <span className="font-bold">{totalProperty}</span> results
          </p>

          <div className="flex items-center gap-2">
            <p className="text-[11px] font-medium capitalize">sort by:</p>
            <DropDownComp
              title={sort}
              className="w-fit gap-2 border text-[11px]"
              component={
                <div className="flex w-[100px] flex-col gap-2">
                  {_favouriteSort.map((_sort, index) => (
                    <Button
                      key={index}
                      onClick={() => setSort(_sort)}
                      className="text-[11px] w-full capitalize"
                      variant="ghost"
                    >
                      {_sort}
                    </Button>
                  ))}
                </div>
              }
            />
            <Button variant="ghost" className="rounded-[8px] w-8 h-8 bg-muted" size="icon">
              <Search className="w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-grow">
          <Table>
            <TableHeader className="border-y bg-slate-100">
              <TableRow className="py-10 h-14">
                <TableHead className="w-[300px] text-[11px] capitalize text-slate-800 font-semibold">listing</TableHead>
                <TableHead className="text-[11px] text-center capitalize text-slate-800 font-semibold">date published</TableHead>
                <TableHead className="text-[11px] text-center capitalize text-slate-800 font-semibold">view</TableHead>
                <TableHead className="text-[11px] text-center capitalize text-slate-800 font-semibold">status</TableHead>
                <TableHead className="text-center text-[11px] capitalize text-slate-800 font-semibold">action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentProperties && currentProperties.length > 0 && currentProperties.map((pro, index) => (
                <TableRow key={index} className="border-b">
                  <TableCell className="flex items-start gap-2">
                    <Image
                      src={pro.images[0] as string || ""}
                      alt={`Property Image ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full max-w-28 aspect-[3/2] rounded-md object-cover"
                      loading="lazy"
                      unoptimized
                    />
                    <div className="flex flex-col gap-1 items-start">
                      <h4 className="text-[11px] font-semibold capitalize text-gray-600">{pro.title}</h4>
                      <h4 className="text-[11px] font-medium text-muted-foreground truncate max-w-[200px]">{pro.address}</h4>
                      <h4 className="text-[11px] font-semibold text-gray-700">
                        {currency(pro.price, { symbol: "₦", precision: 2 }).format()}
                      </h4>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-[11px]">
                    {pro.createdAt ? dayjs(pro.createdAt).format("DD MMM, YYYY") : "-"}
                  </TableCell>
                  <TableCell className="text-center text-[11px]">20</TableCell>

                  <TableCell className="relative">
                    <Button
                      variant={'outline'}
                      size="sm"
                      className={cn("flex items-center font-normal capitalize text-[11px] gap-2 rounded-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", pro.published ? 'border-primary bg-slate-100' : 'border-destructive bg-red-100')}
                    >
                      {pro.published ? 'active' : 'pending'}
                      </Button>
                  </TableCell>

                  <TableCell className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex items-center bg-slate-100 gap-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        >
                          <Ellipsis className="w-4" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-32 flex rounded-t-none flex-col items-center p-0">
                        <Button onClick={() => router.push(`${Routes.listing}/${pro.id}`)} variant='ghost' className="border-b w-full rounded-none text-[11px] flex items-center gap-2 text-gray-700 ">
                          <Eye className="w-4" />
                          View
                        </Button>
                        <Button onClick={() => router.push(`${Routes.dashboard["professional tools"]["my properties"]}/edit/${pro.id}`)} variant='ghost' className="border-b w-full rounded-none text-[11px] flex items-center gap-2 text-gray-700">
                          <Pen className="w-4" />
                          Edit
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant='ghost' className=" w-full rounded-t-none rounded-b-lg text-[11px] flex items-center gap-2 text-gray-700">
                              <Trash2 className="w-4" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md p-6 rounded-lg shadow-lg z-[100]" overlayClassName="z-[100]">
                            <DialogHeader>
                              <DialogTitle className="text-sm font-semibold text-gray-900">
                                Delete Property
                              </DialogTitle>
                              <DialogDescription className="text-xs text-gray-600">
                                Are you sure you want to delete this property? This action <span className="font-semibold text-red-600">cannot be undone</span> and will permanently remove all associated data.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 py-4">
                              <p className="text-xs text-gray-500">
                                If you're unsure, you can cancel this action and review your decision.
                              </p>
                            </div>

                            <DialogFooter className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                              
                              <Button loading={deleting} onClick={ async () => await handleDelete(pro.id)} variant="destructive">Delete Property</Button>
                            </DialogFooter>
                          </DialogContent>

                        </Dialog>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t p-2 flex items-center justify-end">
          <PaginationNav
            currectPage={page}
            totalPage={totalPage}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </div>
      </div>
    </div>
  );
}

function PaginationNav({ nextPage, prevPage, currectPage, totalPage }: { nextPage: any; prevPage: any; currectPage: number; totalPage: number }) {
  return (
    <Pagination className="w-fit">
      <PaginationContent className="w-fit">
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
          <PaginationLink href="#">{totalPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={nextPage} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
