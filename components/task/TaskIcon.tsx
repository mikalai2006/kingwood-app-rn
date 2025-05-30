import { Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { Easing } from "react-native-reanimated";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import { useObject } from "@realm/react";
import { TaskStatusSchema } from "@/schema";
import { BSON } from "realm";
import { invertColor } from "@/utils/utils";

export interface ITaskIconProps {
  statusId: string;
  className?: string;
  size?: number;
}

const TaskIcon = (props: ITaskIconProps) => {
  const { colorScheme } = useColorScheme();

  const taskStatus = useObject(
    TaskStatusSchema,
    new BSON.ObjectId(props.statusId)
  );

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // First set up animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear, // Easing is an additional import from react-native
        useNativeDriver: true, // To make use of native driver for performance
      })
    ).start();
  }, []);

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return taskStatus ? (
    <Animated.View
      style={
        taskStatus.status === "process"
          ? {
              transform: [{ rotate: spin }],
              backgroundColor: taskStatus.color,
              // backgroundColor: Colors.gr[600],
            }
          : {
              backgroundColor: taskStatus.color,
              // backgroundColor:
              //   colorScheme === "dark" ? Colors.s[600] : Colors.s[100],
            }
      }
      className={`rounded-full ${props.className}`}
    >
      <SIcon
        pathText={taskStatus.icon}
        size={props.size || 15}
        color={
          invertColor(taskStatus.color, true)
          // taskStatus.status === "process"
          //   ? colorScheme === "dark"
          //     ? Colors.white
          //     : Colors.white
          //   : taskStatus.status === "finish"
          //   ? colorScheme === "dark"
          //     ? Colors.white
          //     : Colors.white
          //   : Colors.s[400]
        }
      />
    </Animated.View>
  ) : null;
};

export default TaskIcon;
