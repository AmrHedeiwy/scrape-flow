import { ROUTES } from "@/constants/routes";

import { usePathname } from "next/navigation";

export const useActiveRoute = () => {
  const pathname = usePathname();

  const activeRoute =
    ROUTES.find(({ href }) => pathname.endsWith(href)) || ROUTES.at(0)!;

  return activeRoute;
};
