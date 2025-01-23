"use client";

import React from "react";

import CountUp from "react-countup";

const ReactCountupWrapper = ({ value }: { value: number }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  if (!mounted) return "-";
  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
};

export default ReactCountupWrapper;
