import Realm, { BSON, ObjectSchema } from "realm";

export class NotifySchema extends Realm.Object<NotifySchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  userTo!: string;
  status!: number;
  message!: string;
  images!: Realm.List<string>;
  readAt!: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "NotifySchema",
    properties: {
      _id: "objectId",
      userId: "string",
      userTo: "string",
      status: "int",
      message: "string",
      images: "string[]",
      readAt: { type: "string", optional: true },
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type NotifySchemaInput = {
  [Property in keyof NotifySchema]?: NotifySchema[Property];
};
