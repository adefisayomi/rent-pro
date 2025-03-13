import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Property Listing",
  description: "Browse and manage property listings on the RentHouse platform."
};

export default function Layout ({children}: {children: ReactNode}) {
    return <>{children}</>
}