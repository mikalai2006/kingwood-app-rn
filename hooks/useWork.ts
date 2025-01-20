import { ITaskWorker, IWorkHistory } from "@/types";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useFetchWithAuth } from "./useFetchWithAuth";
import dayjs from "@/utils/dayjs";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setWorkHistory, workHistory, workTime } from "@/store/storeSlice";

const useWork = () => {
  const realm = useRealm();

  const dispatch = useAppDispatch();

  const workHistoryFromStore = useAppSelector(workHistory);
  const workTimeFromStore = useAppSelector(workTime);

  const { onFetchWithAuth } = useFetchWithAuth();

  const onWriteWorkHistory = async (
    statusName: string,
    taskWorker: ITaskWorker
  ) => {
    if (["process"].includes(statusName)) {
      await onFetchWithAuth(`${hostAPI}/work_history`, {
        method: "POST",
        body: JSON.stringify({
          status: 0,
          from: dayjs().utc().format(),
          objectId: taskWorker?.objectId,
          orderId: taskWorker?.orderId,
          taskId: taskWorker?.taskId,
          workerId: taskWorker?.workerId,
          operationId: taskWorker?.task.operationId,
          workTimeId: workTimeFromStore?.id,
          oklad: workTimeFromStore?.oklad,
        }),
      })
        .then((res) => res.json())
        .then((res: IWorkHistory) => {
          realm.write(() => {
            try {
              realm.create(
                "WorkHistorySchema",
                {
                  ...res,
                  _id: new BSON.ObjectId(res.id),
                },
                UpdateMode.Modified
              );
            } catch (e) {
              isWriteConsole && console.log("onWriteWorkHistory error: ", e);
            }
          });

          dispatch(setWorkHistory(res));
        })
        .catch((e) => {
          isWriteConsole && console.log("onWriteWorkHistory Error", e);
        });
    } else {
      await onFetchWithAuth(
        `${hostAPI}/work_history/${workHistoryFromStore?.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: 1,
            to: dayjs().utc().format(),
          }),
        }
      )
        .then((res) => res.json())
        .then((res: IWorkHistory) => {
          realm.write(() => {
            try {
              realm.create(
                "WorkHistorySchema",
                {
                  ...res,
                  _id: new BSON.ObjectId(res.id),
                },
                UpdateMode.Modified
              );

              dispatch(setWorkHistory(null));
            } catch (e) {
              isWriteConsole && console.log("onWriteWorkHistory error: ", e);
            }
          });
        })
        .catch((e) => {
          isWriteConsole && console.log("onWriteWorkHistory Error", e);
        });
    }
  };

  return {
    onWriteWorkHistory,
  };
};

export { useWork };
