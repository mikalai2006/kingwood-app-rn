import Realm, { BSON, ObjectSchema } from "realm";

export class PayTemplateSchema extends Realm.Object<PayTemplateSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  total!: number;
  name?: string;
  description?: string;
  enabled?: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "PayTemplateSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      total: "int",
      name: "string?",
      description: "string?",
      enabled: "int?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type PayTemplateSchemaInput = {
  [Property in keyof PayTemplateSchema]?: PayTemplateSchema[Property];
};
