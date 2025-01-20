import Realm, { BSON, ObjectSchema } from "realm";
export class PostSchema extends Realm.Object<PostSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  name!: string;
  description?: string;
  props?: any;
  color?: string;
  sortOrder?: number;
  hidden?: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "PostSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      description: "string?",
      props: "mixed?",
      color: "string?",
      sortOrder: "int?",
      hidden: "int?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type PostSchemaInput = {
  [Property in keyof PostSchema]?: PostSchema[Property];
};
