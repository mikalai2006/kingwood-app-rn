import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Colors } from "./Colors";

export const setMode = (mode: "dark" | "light" | "system") => {
  if (Platform.OS === "android") {
    if (mode === "dark") {
      NavigationBar.setButtonStyleAsync("light");
      NavigationBar.setBackgroundColorAsync(Colors.s[900]);
    } else {
      //   setAppearanceLight();
      NavigationBar.setButtonStyleAsync("dark");
      NavigationBar.setBackgroundColorAsync(Colors.s[100]);
    }

    // NavigationBar.setBehaviorAsync("overlay-swipe");
    // NavigationBar.setPositionAsync("relative");
    // NavigationBar.setVisibilityAsync("hidden");
  }
};

// export const setApperance = (mode: 'dark' | 'light') => {

// }
