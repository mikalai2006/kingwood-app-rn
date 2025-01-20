import Realm, { BSON, ObjectSchema } from "realm";

export class MessageRoomSchema extends Realm.Object<MessageRoomSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  productId!: string;
  offerId!: string;
  takeUserId!: string;
  status!: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "MessageRoomSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      productId: "string",
      offerId: "string",
      takeUserId: "string",
      status: "int",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type MessageRoomSchemaInput = {
  [Property in keyof MessageRoomSchema]?: MessageRoomSchema[Property];
};
