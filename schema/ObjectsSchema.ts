import Realm, { BSON, ObjectSchema } from "realm";
export class ObjectsSchema extends Realm.Object<ObjectsSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  name!: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "ObjectsSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type ObjectsSchemaInput = {
  [Property in keyof ObjectsSchema]?: ObjectsSchema[Property];
};
