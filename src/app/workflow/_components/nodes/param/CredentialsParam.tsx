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
import { useQuery } from "@tanstack/react-query";
import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";

type TOption = {
  label: string;
  value: string;
};

const CredentialsParam = ({
  param,
  updateNodeParamValue,
  value,
  disabled,
}: IParamProps) => {
  const id = useId();
  const { data } = useQuery({
    queryKey: ["credentials-for-user"],
    queryFn: async () => GetCredentialsForUser(),
    refetchInterval: 1000 * 10, // 10 seconds
  });

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
            <SelectLabel>Credentials</SelectLabel>
            {data?.map((credential) => (
              <SelectItem key={credential.id} value={credential.id}>
                {credential.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CredentialsParam;
