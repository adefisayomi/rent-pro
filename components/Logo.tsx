"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  isDark?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ isDark = false, className }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const logoSrc = isDark ? "/logo-dark.svg" : "/logo-light.svg";

  if (!isHydrated)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );

  return (
    <div className="flex items-center">
      <Link href="/" className="flex w-fit items-center gap-1">
        <Image
          src={logoSrc}
          alt="logo"
          width={140}
          height={40} // Adjust as needed
          className={clsx("h-auto", className)}
          priority // Ensures faster loading
        />
      </Link>
    </div>
  );
};

export default Logo;
