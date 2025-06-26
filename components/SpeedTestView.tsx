import { View, Text } from "react-native";
import React, { useState } from "react";
import RnSpeedTestProvider, {
  RnSpeedTestConfig,
  useRnSpeedTest,
} from "@/components/SpeedTest";

const ExampleSpeedTest = ({ err }: { err: string }) => {
  const { networkSpeed, networkSpeedText } = useRnSpeedTest();

  return (
    <Text className="mt-12 text-xl">
      {err ? err : networkSpeed ? networkSpeedText : "calculating..."}
    </Text>
  );
};

const SpeedTestView = ({ err }: { err: string }) => {
  const configSpeedTest: RnSpeedTestConfig = {
    token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
    timeout: 2000,
    https: true,
    urlCount: 2,
    bufferSize: 8,
    unit: "MBps",
  };

  return (
    <View className="mt-12">
      <RnSpeedTestProvider
        initialConfig={configSpeedTest}
        onError={(e) => {
          console.log("error speedTest:", e);
        }}
        setSpeed={(speed) => {
          console.log("SPEED:", speed);
        }}
      >
        <ExampleSpeedTest err={err} />
      </RnSpeedTestProvider>
    </View>
  );
};

export default SpeedTestView;
