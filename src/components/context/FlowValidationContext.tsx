"use client";

import React from "react";

import { TWorkflowNodeMissingInputs } from "@/types/workflow-node";

type FlowValidationContextType = {
  invalidInputs: TWorkflowNodeMissingInputs[];
  setInvalidInputs: React.Dispatch<
    React.SetStateAction<TWorkflowNodeMissingInputs[]>
  >;
  clearErrors: () => void;
};

export const FlowValidationContext =
  React.createContext<FlowValidationContextType>({
    invalidInputs: [],
    setInvalidInputs: () => {},
    clearErrors: () => {},
  });

export const FlowValidationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [invalidInputs, setInvalidInputs] = React.useState<
    TWorkflowNodeMissingInputs[]
  >([]);

  const clearErrors = () => {
    setInvalidInputs([]);
  };

  return (
    <FlowValidationContext.Provider
      value={{
        invalidInputs,
        setInvalidInputs,
        clearErrors,
      }}
    >
      {children}
    </FlowValidationContext.Provider>
  );
};
