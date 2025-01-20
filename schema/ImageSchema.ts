import Realm, { BSON, ObjectSchema } from "realm";

export class ImageSchema extends Realm.Object<ImageSchema> {
  id!: string;
  userId!: string;
  serviceId!: string;
  service!: string;
  path!: string;
  ext!: string;
  title!: string;
  dir!: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "ImageSchema",
    properties: {
      id: "string",
      userId: "string",
      serviceId: "string",
      service: "string",
      path: "string",
      ext: "string",
      title: "string",
      dir: "string",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
  };
}

export type ImageSchemaInput = {
  [Property in keyof ImageSchema]?: ImageSchema[Property];
};
