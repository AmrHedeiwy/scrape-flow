import Logo from "@/components/Logo";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { Separator } from "@/components/ui/separator";
import { ICON_SIZE } from "@/constants/icon-size";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen w-full flex-col">
      {children}
      <Separator />
      <footer className="flex items-center justify-between p-2">
        <Logo iconSize={ICON_SIZE.S} fontSize="text-xl" />
        <ThemeModeToggle />
      </footer>
    </div>
  );
};

export default Layout;
