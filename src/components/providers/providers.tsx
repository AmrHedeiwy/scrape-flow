"use client";

import React, { PropsWithChildren, useState } from "react";
import ThemeProvider from "./theme-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import NextTopLoadLoader from "nextjs-toploader";

const Providers = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoadLoader color="#10b981" showSpinner={false} />
      <ThemeProvider>{children}</ThemeProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default Providers;
