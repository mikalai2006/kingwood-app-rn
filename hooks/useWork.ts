import { ITaskWorker, IWorkHistory } from "@/types";
import { hostAPI, isWriteConsole } from "@/utils/global";
import { useFetchWithAuth } from "./useFetchWithAuth";
import dayjs from "@/utils/dayjs";
import { useQuery, useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setActiveTaskWorker,
  setWorkHistory,
  user,
  workHistory,
  workTime,
} from "@/store/storeSlice";
import { TaskStatusSchema, TaskWorkerSchema } from "@/schema";

const useWork = () => {
  const realm = useRealm();

  const dispatch = useAppDispatch();

  const workHistoryFromStore = useAppSelector(workHistory);
  const workTimeFromStore = useAppSelector(workTime);

  const userFromStore = useAppSelector(user);

  const { onFetchWithAuth } = useFetchWithAuth();

  const allTaskStatus = useQuery(TaskStatusSchema);

  const onWriteWorkHistory = async (
    statusName: string,
    taskWorker: TaskWorkerSchema //ITaskWorker
  ) => {
    const _status = allTaskStatus.find((x) => x.status === statusName);
    if (!_status) {
      return;
    }

    const _statusWait = allTaskStatus.find((x) => x.status === "wait");
    if (!_statusWait) {
      return;
    }

    const timeDate = dayjs(new Date()).utc();

    if (["process"].includes(statusName)) {
      await onFetchWithAuth(`${hostAPI}/work_history`, {
        method: "POST",
        body: JSON.stringify({
          status: 0,
          from: timeDate.format(),
          objectId: taskWorker?.objectId,
          orderId: taskWorker?.orderId,
          taskId: taskWorker?.taskId,
          workerId: userFromStore?.id, //taskWorker?.workerId,
          operationId: taskWorker?.operationId,
          workTimeId: workTimeFromStore?.id,
          oklad: userFromStore?.oklad, //workTimeFromStore?.oklad,
        }),
      })
        .then((res) => res.json())
        .then((res: IWorkHistory) => {
          realm.write(() => {
            try {
              realm.create(
                "TaskWorkerSchema",
                {
                  ...taskWorker,
                  _id: new BSON.ObjectId(taskWorker._id.toString()),
                  status: _status.name,
                  statusId: _status._id.toString(),
                },
                UpdateMode.Modified
              );

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

          const _activeTaskWorker = Object.assign(
            {},
            JSON.parse(JSON.stringify(taskWorker)),
            {
              id: taskWorker._id.toString(),
              status: _status.name,
              statusId: _status._id.toString(),
            }
          );
          dispatch(setActiveTaskWorker(_activeTaskWorker));
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
                "TaskWorkerSchema",
                {
                  ...taskWorker,
                  _id: new BSON.ObjectId(taskWorker._id.toString()),
                  status: _statusWait.name,
                  statusId: "000000000000000000000000", //_statusWait._id.toString(),
                },
                UpdateMode.Modified
              );

              realm.create(
                "WorkHistorySchema",
                {
                  ...res,
                  _id: new BSON.ObjectId(res.id),
                },
                UpdateMode.Modified
              );

              const _activeTaskWorker = Object.assign(
                {},
                JSON.parse(JSON.stringify(taskWorker)),
                {
                  id: taskWorker._id.toString(),
                  status: _statusWait.name,
                  statusId: "000000000000000000000000",
                }
              );

              dispatch(setActiveTaskWorker(_activeTaskWorker));
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
