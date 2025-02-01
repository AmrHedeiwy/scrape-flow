"use client";

import React, { useId } from "react";

import { IParamProps } from "@/types/workflow-node";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TOption = {
  label: string;
  value: string;
};

const SelectParam = ({
  param,
  updateNodeParamValue,
  value,
  disabled,
}: IParamProps) => {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-1">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <span className="px-2 text-red-400">*</span>}
      </Label>
      <Select
        onValueChange={(newValue) => updateNodeParamValue(newValue)}
        value={value}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select value" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Options</SelectLabel>
            {param.options.map((option: TOption) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectParam;
