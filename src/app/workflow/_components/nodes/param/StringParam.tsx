import React, { useId } from "react";

import { IParamProps } from "@/types/task";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const StringParam = ({ param, value, updateNodeParamValue }: IParamProps) => {
  const [internalValue, setInternalValue] = React.useState(value);
  const id = useId();

  return (
    <div className="w-full space-y-1 p-1">
      <Label htmlFor={id} className="flex text-xs">
        {param.name}
        {param.required && <span className="px-2 text-red-400">*</span>}
      </Label>
      <Input
        id={id}
        className="text-xs"
        placeholder="Enter value here"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeParamValue(e.target.value)}
      />
      {param.helperText && (
        <p className="px-2 text-muted-foreground">{param.helperText}</p>
      )}
    </div>
  );
};

export default StringParam;
