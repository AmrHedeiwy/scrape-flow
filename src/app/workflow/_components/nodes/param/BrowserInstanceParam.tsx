"use client";

import React from "react";

import { IParamProps } from "@/types/task";

const BrowserInstanceParam = ({ param, updateNodeParamValue }: IParamProps) => {
  return <p className="text-xs">{param.name}</p>;
};

export default BrowserInstanceParam;
