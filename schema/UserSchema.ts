import Realm, { BSON, ObjectSchema } from "realm";
import { ImageSchema } from "./ImageSchema";

export class UserSchema extends Realm.Object<UserSchema> {
  _id!: BSON.ObjectId;
  name!: string;
  phone?: string;
  online?: boolean;
  hidden?: number;
  birthday?: string;
  roleId?: string;
  postId?: string;
  typeWork?: Realm.List<string>;
  typePay?: number;
  oklad?: number;
  // workes?: number;
  images?: Realm.List<ImageSchema>;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "UserSchema",
    properties: {
      _id: "objectId",
      name: "string",
      phone: "string?",
      online: "bool?",
      hidden: "int?",
      birthday: "string?",
      roleId: "string?",
      postId: "string?",
      typeWork: "string[]",
      typePay: "int?",
      oklad: "int?",
      // workes: "int?",
      images: "ImageSchema[]",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type UserSchemaInput = {
  [Property in keyof UserSchema]?: UserSchema[Property];
};
