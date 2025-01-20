import Realm, { BSON, ObjectSchema } from "realm";
import { ImageSchema } from "./ImageSchema";

export class TaskStatusSchema extends Realm.Object<TaskStatusSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  name!: string;
  description!: string;
  props?: any;
  color?: string;
  enabled?: number;
  icon?: string;
  animate?: string;
  // start?: number;
  // finish?: number;
  // process?: number;
  status?: string;
  // images?: Realm.List<ImageSchema>;
  // user!: UserSchema;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "TaskStatusSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      name: "string",
      description: "string",
      props: "mixed?",
      color: "string?",
      enabled: "int?",
      icon: "string?",
      animate: "string?",
      // start: "int?",
      // finish: "int",
      // process: "int",
      status: "string",
      // images: "ImageSchema[]",
      // user: {
      //   type: "linkingObjects",
      //   objectType: "UserSchema",
      //   property: "products",
      // },
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type TaskStatusSchemaInput = {
  [Property in keyof TaskStatusSchema]?: TaskStatusSchema[Property];
};
