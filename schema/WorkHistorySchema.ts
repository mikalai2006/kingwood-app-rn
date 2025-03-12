import Realm, { BSON, ObjectSchema } from "realm";

export class WorkHistorySchema extends Realm.Object<WorkHistorySchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  objectId!: string;
  orderId!: string;
  taskId!: string;
  workerId!: string;
  operationId!: string;
  taskWorkerId!: string;
  status!: number;
  date!: string;
  from!: string;
  to!: string;
  oklad!: number;
  total!: number;
  totalTime!: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "WorkHistorySchema",
    properties: {
      _id: "objectId",
      objectId: "string",
      orderId: "string",
      taskId: "string",
      workerId: "string",
      operationId: "string",
      taskWorkerId: "string",
      status: "int",
      date: "string",
      from: "string",
      to: "string",
      oklad: "int",
      total: "int",
      totalTime: "int",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type WorkHistorySchemaInput = {
  [Property in keyof WorkHistorySchema]?: WorkHistorySchema[Property];
};
