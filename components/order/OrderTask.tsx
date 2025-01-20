// import { View, Text } from "react-native";
// import React from "react";
// import { useObject, useQuery } from "@realm/react";
// import { BSON } from "realm";
// import { OrderSchema, TaskSchema, TaskStatusSchema } from "@/schema";
// import useTask from "@/hooks/useTask";
// import OrderTaskWorkers from "./OrderTaskWorkers";
// import Animated from "react-native-reanimated";

// export type OrderTaskProps = {
//   taskId: string;
// };

// const OrderTask = ({ taskId }: OrderTaskProps) => {
//   const task = useObject(TaskSchema, new BSON.ObjectId(taskId));

//   const taskStatus = useObject(TaskStatusSchema, new BSON.ObjectId(task?.statusId));

//   return (
//     <View>
//       {taskStatus?.icon && (
//               <Animated.View
//                 style={
//                   task?.status === "process"
//                     ? {
//                         transform: [{ rotate: spin }],
//                         backgroundColor: taskStatus.color,
//                       }
//                     : { backgroundColor: taskStatus.color }
//                 }
//                 className="rounded-full p-2"
//               >
//                 <SIcon
//                   pathText={taskStatus.icon}
//                   size={30}
//                   color={colorScheme === "dark" ? Colors.white : Colors.white}
//                 />

//                 {/* <Text className="text-s-500 leading-5 mb-1">
//                   {taskStatus.status}
//                 </Text> */}
//               </Animated.View>
//             )}
//     </View>
//   );
// };

// export default OrderTask;
