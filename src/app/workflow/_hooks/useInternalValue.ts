import React, { useEffect } from "react";

export const useInternalValue = <T>(value: T) => {
  const [internal, setInternal] = React.useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  return [internal, setInternal] as const;
};
