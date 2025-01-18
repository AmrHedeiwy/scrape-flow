import React from "react";

import { FlowValidationContext } from "../context/FlowValidationContext";

export const useFlowValidation = () => {
  const context = React.useContext(FlowValidationContext);
  if (!context)
    throw new Error(
      "useFlowValidation must be used within a FlowValidationProvider",
    );

  return context;
};
