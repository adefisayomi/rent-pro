import { Metadata } from "next";
import { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Dashboard ",
  description: "manage all your activities here"
};

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <DashboardLayout>
      <PageTransition>
      {children}
      </PageTransition>
    </DashboardLayout>
  );
}
