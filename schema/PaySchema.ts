import Realm, { BSON, ObjectSchema } from "realm";

export class PaySchema extends Realm.Object<PaySchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  workerId!: string;
  month!: number;
  year!: string;
  total!: number;
  name?: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "PaySchema",
    properties: {
      _id: "objectId",
      userId: "string",
      workerId: "string",
      month: "int",
      year: "int",
      total: "int",
      name: "string?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type PaySchemaInput = {
  [Property in keyof PaySchema]?: PaySchema[Property];
};
