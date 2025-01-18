import React from "react";
import { useActiveRoute } from "@/components/hooks/use-active-route";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { ICON_SIZE } from "@/constants/icon-size";

const MobileSidebar = () => {
  const activeRoute = useActiveRoute();

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-0">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] space-y-4 sm:w-[540px]"
            side="left"
          >
            <Logo />
            <div className="flex flex-col">
              {ROUTES.map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={buttonVariants({
                    variant:
                      activeRoute.href === href
                        ? "sidebarItemActive"
                        : "sidebarItem",
                  })}
                  onClick={() => setIsOpen(!open)}
                >
                  <Icon size={ICON_SIZE.M} />
                  {label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default MobileSidebar;
