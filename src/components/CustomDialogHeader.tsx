import React from "react";

import { LucideIcon } from "lucide-react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { ICON_SIZE } from "@/constants/icon-size";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface CustomDialogHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const CustomDialogHeader = ({
  icon: Icon,
  iconClassName,
  title,
  subtitle,
  titleClassName,
  subtitleClassName,
}: CustomDialogHeaderProps) => {
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="mb-2 flex flex-col items-center gap-2">
          {Icon && (
            <Icon
              size={ICON_SIZE.XL}
              className={cn("stroke-primary", iconClassName)}
            />
          )}
          {title && (
            <p className={cn("text-xl text-primary", titleClassName)}>
              {title}
            </p>
          )}

          {subtitle && (
            <p
              className={cn("text-sm text-muted-foreground", subtitleClassName)}
            >
              {subtitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator />
    </DialogHeader>
  );
};

export default CustomDialogHeader;
