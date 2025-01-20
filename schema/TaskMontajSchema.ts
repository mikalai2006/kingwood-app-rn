import Realm, { BSON, ObjectSchema } from "realm";

export class TaskMontajSchema extends Realm.Object<TaskMontajSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  objectId!: string;
  // operationId!: string;
  name!: string;
  sortOrder?: number;
  statusId!: string;
  status!: string;
  typeGo?: string;
  from?: string;
  to?: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "TaskMontajSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      objectId: "string",
      // operationId: "string",
      name: "string",
      sortOrder: "int?",
      statusId: "string",
      status: "string",
      typeGo: "string?",
      from: "string?",
      to: "string?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type TaskMontajSchemaInput = {
  [Property in keyof TaskMontajSchema]?: TaskMontajSchema[Property];
};
