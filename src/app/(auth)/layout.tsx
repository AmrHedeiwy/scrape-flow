import Logo from "@/components/Logo";
import React, { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Logo />
      {children}
    </div>
  );
};

export default layout;
