import Realm, { BSON, ObjectSchema } from "realm";

export class TaskSchema extends Realm.Object<TaskSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  objectId!: string;
  orderId!: string;
  operationId!: string;
  name!: string;
  sortOrder?: number;
  statusId!: string;
  startAt!: string;
  active?: number;
  autoCheck?: number;
  status!: string;
  typeGo?: string;
  from?: string;
  to?: string;
  // workers?: Realm.List<string>;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "TaskSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      objectId: "string",
      orderId: "string",
      operationId: "string",
      name: "string",
      sortOrder: "int?",
      statusId: "string",
      startAt: "string",
      active: "int?",
      autoCheck: "int?",
      status: "string",
      typeGo: "string?",
      from: "string?",
      to: "string?",
      // workers: "string[]",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type TaskSchemaInput = {
  [Property in keyof TaskSchema]?: TaskSchema[Property];
};
