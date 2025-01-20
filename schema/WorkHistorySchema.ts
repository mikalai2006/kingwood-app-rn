import Realm, { BSON, ObjectSchema } from "realm";

export class WorkHistorySchema extends Realm.Object<WorkHistorySchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  objectId!: string;
  orderId!: string;
  taskId!: string;
  workerId!: string;
  operationId!: string;
  from!: string;
  to!: string;
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
      from: "string",
      to: "string",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type WorkHistorySchemaInput = {
  [Property in keyof WorkHistorySchema]?: WorkHistorySchema[Property];
};
