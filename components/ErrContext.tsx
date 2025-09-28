import { CustomError } from "@/hooks/useErrors";
import React, { useContext } from "react";

export type ErrContent = {
  err: CustomError[];
  setErr: (c: CustomError[]) => void | null;
  // addErr: (c: CustomError) => void | null;
};

export const ErrContext = React.createContext<ErrContent>({
  err: [],
  setErr: () => {},
  // addErr: () => {},
});

export const useErrContext = () => useContext(ErrContext);
