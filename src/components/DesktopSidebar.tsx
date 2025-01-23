"use client";

import React from "react";

import { ROUTES } from "@/constants/routes";
import { ICON_SIZE } from "@/constants/icon-size";

import Link from "next/link";

import { buttonVariants } from "./ui/button";
import Logo from "./Logo";

import { useActiveRoute } from "@/components/hooks/use-active-route";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";

const DesktopSidebar = () => {
  const activeRoute = useActiveRoute();

  return (
    <div
      className="relative hidden h-screen w-full min-w-[280px] max-w-[280px] 
      border-separate overflow-hidden border-r-2 bg-primary/5 
      text-muted-foreground dark:bg-secondary/30 dark:text-foreground md:block"
    >
      <div className="flex border-separate items-center justify-center gap-2 border-b-[1px] p-4 ">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2">
        {ROUTES.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={buttonVariants({
              variant:
                activeRoute.href === href ? "sidebarItemActive" : "sidebarItem",
            })}
          >
            <Icon size={ICON_SIZE.M} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DesktopSidebar;
