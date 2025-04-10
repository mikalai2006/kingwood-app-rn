import Realm, { BSON, ObjectSchema } from "realm";

export class ArchiveNotifySchema extends Realm.Object<ArchiveNotifySchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  userTo!: string;
  status!: number;
  message!: string;
  link?: string;
  linkOption?: any;
  images!: Realm.List<string>;
  readAt!: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "ArchiveNotifySchema",
    properties: {
      _id: "objectId",
      userId: "string",
      userTo: "string",
      status: "int",
      message: "string",
      link: "string?",
      linkOption: "mixed?",
      images: "string[]",
      readAt: { type: "string", optional: true },
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type ArchiveNotifySchemaInput = {
  [Property in keyof ArchiveNotifySchema]?: ArchiveNotifySchema[Property];
};
