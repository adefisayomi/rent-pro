import Routes from "@/Routes";

export const navConfig: { title: string; href: string }[] = [
    {
      title: "home",
      href: Routes.home,
    },
    {
      title: "about us",
      href: Routes.aboutUs,
    },
    {
      title: "listing",
      href: Routes.listing,
    },
    {
      title: "services",
      href: Routes.services,
    },
    {
        title: "contact",
        href: Routes.contact,
      },
  ]