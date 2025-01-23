"use client";

import { GetAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { ICON_SIZE } from "@/constants/icon-size";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Coins, Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import ReactCountupWrapper from "./ReactCountupWrapper";
import { buttonVariants } from "./ui/button";

const UserAvailableCreditsBadge = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-available-credits"],
    queryFn: () => GetAvailableCredits(),
    refetchInterval: 30 * 1000, // 30 seconds
  });

  return (
    <Link
      href="/billing"
      className={buttonVariants({
        variant: "outline",
        className: cn("w-full items-center space-x-2"),
      })}
    >
      <Coins size={ICON_SIZE.M} className="text-primary" />
      <span className="font-semibold capitalize">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && data !== undefined && (
          <ReactCountupWrapper value={data} />
        )}
        {!isLoading && data === undefined && "-"}
      </span>
    </Link>
  );
};

export default UserAvailableCreditsBadge;
