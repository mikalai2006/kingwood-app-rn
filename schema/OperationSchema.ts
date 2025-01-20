import Realm, { BSON, ObjectSchema } from "realm";

export class OperationSchema extends Realm.Object<OperationSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  name!: string;
  color!: string;
  hidden?: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "OperationSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      color: "string",
      hidden: "int?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type OperationSchemaInput = {
  [Property in keyof OperationSchema]?: OperationSchema[Property];
};
