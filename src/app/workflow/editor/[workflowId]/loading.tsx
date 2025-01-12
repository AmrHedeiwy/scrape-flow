import { ICON_SIZE } from "@/constants/icon-size";
import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="animate-spin stroke-primary" size={ICON_SIZE.XL} />
    </div>
  );
};

export default Loading;
