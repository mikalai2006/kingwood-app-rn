import Realm, { BSON, ObjectSchema } from "realm";

export class QuestionSchema extends Realm.Object<QuestionSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  productId!: string;
  userProductId!: string;
  question?: string;
  answer?: string;
  status?: number;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "QuestionSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      productId: "string",
      userProductId: "string",
      question: "string?",
      answer: "string?",
      status: "int?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type QuestionSchemaInput = {
  [Property in keyof QuestionSchema]?: QuestionSchema[Property];
};
