import React, { useContext } from "react";

export type ErrContent = {
  err: Error | null;
  setErr: (c: Error | null) => void | null;
};

export const ErrContext = React.createContext<ErrContent>({
  err: null,
  setErr: () => {},
});

export const useErrContext = () => useContext(ErrContext);
