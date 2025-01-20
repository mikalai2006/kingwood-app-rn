import Realm, { BSON, ObjectSchema } from "realm";

export class TaskMontajWorkerSchema extends Realm.Object<TaskMontajWorkerSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  objectId!: string;
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
    name: "TaskMontajWorkerSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      objectId: "string",
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

export type TaskMontajWorkerSchemaInput = {
  [Property in keyof TaskMontajWorkerSchema]?: TaskMontajWorkerSchema[Property];
};
