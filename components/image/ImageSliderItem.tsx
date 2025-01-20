import { IImage } from "@/types";
import React from "react";
import { useWindowDimensions } from "react-native";
import RImage from "../r/RImage";

export type TImageSliderItemProps = {
  item: IImage;
};

export default function OnboardingItem({ item }: TImageSliderItemProps) {
  const { width } = useWindowDimensions();

  return (
    <RImage
      image={item}
      className="h-full"
      style={{ width, aspectRatio: 1, resizeMode: "contain" }}
    />
  ); // , resizeMode: "contain"
}
