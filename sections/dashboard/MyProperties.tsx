import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Eye, MoreHorizontal, PenLine, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DropDownComp from "@/components/DropdownComp";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Property = {
  id: string;
  name: string;
  location: string;
  price: string;
  datePublished: string;
  views: number;
  status: "active" | "pending" | "sold";
  image: string;
};

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: "name",
    header: () => <span>Listing</span>,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <img src={row.original.image} alt={row.original.name} className="object-cover rounded-xl aspect-[4/3] w-20" />
        <div className="flex flex-col">
          <p className="text-[11px] font-medium text-muted-foreground capitalize">{row.original.name}</p>
          <p className="text-[10px] text-muted-foreground capitalize">{row.original.location}</p>
          <p className="text-[11px] font-semibold capitalize">{row.original.price}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "datePublished",
    header: () => <span>Date Published</span>,
    cell: ({ row }) => <div className="text-[11px] text-muted-foreground font-medium">{row.original.datePublished}</div>,
  },
  {
    accessorKey: "views",
    header: () => <span>Views</span>,
    cell: ({ row }) => <div className="text-[11px] text-muted-foreground font-medium">{row.original.views}</div>,
  },
  {
    accessorKey: "status",
    header: () => <span>Status</span>,
    cell: ({ row }) => (
      <Button className="rounded-2xl capitalize" variant="outline" size="sm">
        {row.original.status}
      </Button>
    ),
  },
  {
    id: "actions",
    header: () => <span>Action</span>,
    cell: ({ row }) => (
      // <div className="flex gap-2">
        // <Button variant="ghost" size="icon">
        //   <Eye className="w-4" />
        // </Button>
        // <Button variant="ghost" size="icon">
        //   <PenLine className="w-4" />
        // </Button>
        // <Button variant="ghost" size="icon">
        //   <Trash className="w-4" />
        // </Button>
      // </div>
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 bg-slate-100">
              <MoreHorizontal className="w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col ">
            <Button variant="ghost" size="icon" className="w-full flex items-center gap-2 text-[11px] text-muted-foreground capitalize justify-start px-3">
              <Eye className="w-4" />
              view
            </Button>
            <Button variant="ghost" size="icon" className="w-full flex items-center gap-2 text-[11px] text-muted-foreground capitalize justify-start px-3">
              <PenLine className="w-4" />
              edit
            </Button>
            <Button variant="ghost" size="icon" className="w-full flex items-center gap-2 text-[11px] text-muted-foreground capitalize justify-start px-3">
              <Trash className="w-4" />
              delete
            </Button>
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
];

function PropertyTable({ properties }: { properties: Property[] }) {
  const table = useReactTable({
    data: properties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full border rounded-xl">
      <div className="flex items-center justify-between py-4 text-xs text-muted-foreground px-2">
        <p>
          Showing <span className="font-semibold text-slate-800">1 - {properties.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{properties.length}</span> results
        </p>
        <DropDownComp title="Sort by" className="w-fit gap-2 border" component={<p className="text-[11px]">Newest</p>} />
      </div>

      <Table>
        <TableHeader className="border-y bg-slate-100 h-14">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-[11px] font-semibold capitalize text-slate-800">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="w-full flex justify-between items-center border-t px-2 py-4">
        <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <ChevronLeft className="w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <ChevronRight className="w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function MyProperty() {
  return (
    <div className="w-full flex flex-col gap-5 p-6 ">
      <PropertyTable properties={propertiesData as any} />
    </div>
  );
}

const getRandomDate = (): string => {
  const start = dayjs("2020-01-01");
  const end = dayjs("2025-12-31");
  const randomTimestamp = start.valueOf() + Math.random() * (end.valueOf() - start.valueOf());
  return dayjs(randomTimestamp).format("DD MMM, YYYY");
};

const getRandomViews = (): number => Math.floor(Math.random() * 2001);

export const propertiesData = [
  {
    id: "prop1",
    name: "Luxury Apartment",
    location: "Lekki, Lagos",
    price: "₦25,000,000",
    datePublished: getRandomDate(),
    views: getRandomViews(),
    status: "active",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "prop2",
    name: "Modern Duplex",
    location: "Victoria Island, Lagos",
    price: "₦45,000,000",
    datePublished: getRandomDate(),
    views: getRandomViews(),
    status: "active",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "prop3",
    name: "Cozy Bungalow",
    location: "Ikeja, Lagos",
    price: "₦15,000,000",
    datePublished: getRandomDate(),
    views: getRandomViews(),
    status: "pending",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
