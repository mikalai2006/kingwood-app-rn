import Realm, { BSON, ObjectSchema } from "realm";

export class MessageSchema extends Realm.Object<MessageSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  // productId!: string;
  roomId!: string;
  message?: string;
  images?: Realm.List<string>;
  status!: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "MessageSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      // productId: "string",
      roomId: "string",
      message: "string?",
      images: "string?[]",
      status: "int",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type MessageSchemaInput = {
  [Property in keyof MessageSchema]?: MessageSchema[Property];
};
