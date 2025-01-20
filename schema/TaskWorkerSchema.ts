import Realm, { BSON, ObjectSchema } from "realm";

export class TaskWorkerSchema extends Realm.Object<TaskWorkerSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  objectId!: string;
  orderId!: string;
  taskId!: string;
  workerId!: string;
  sortOrder?: number;
  statusId?: string;
  status!: string;
  from?: string;
  to?: string;
  typeGo?: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "TaskWorkerSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      objectId: "string",
      orderId: "string",
      taskId: "string",
      workerId: "string",
      sortOrder: "int?",
      statusId: "string?",
      status: "string",
      from: "string?",
      to: "string?",
      typeGo: "string?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type TaskWorkerSchemaInput = {
  [Property in keyof TaskWorkerSchema]?: TaskWorkerSchema[Property];
};
