import { Deserializable } from "./deserializable.model";

export class ProductModel {
  id: number;
  titel: string;
  foto_path: string;
  beschrijving: string;
  prijs: number;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
