import React, { useContext } from "react";
import { AppStateStatus } from "react-native";

export type AppStateStatusContext = {
  appStateStatus: AppStateStatus | undefined;
  setAppStateStatus: React.Dispatch<
    React.SetStateAction<AppStateStatus | undefined>
  >;
};

export const AppStateStatusContext = React.createContext<AppStateStatusContext>(
  {
    appStateStatus: undefined,
    setAppStateStatus: () => {},
  }
);

export const useAppStateStatusContext = () => useContext(AppStateStatusContext);
