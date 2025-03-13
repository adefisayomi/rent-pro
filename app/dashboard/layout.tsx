import { Metadata } from "next";
import { ReactNode } from "react";
import DashboardLayout from "./DashboardLayout";
import PageTransition from "@/components/PageTransition";
import { currUser } from "@/actions/auth";

export const metadata: Metadata = {
  title: "Dashboard ",
  description: "manage all your activities here"
};

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currUser()
  return (
    <DashboardLayout user={user!}>
      <PageTransition>
      {children}
      </PageTransition>
    </DashboardLayout>
  );
}
