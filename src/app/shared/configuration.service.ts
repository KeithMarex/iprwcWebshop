import {UserModel} from "./models/user.model";
import {Injectable} from "@angular/core";
import {ProductModel} from "./models/product.model";

@Injectable()
export class ConfigurationService{
  public user: UserModel;
  public winkelWagen: ProductModel[] = [];
  public itemCount = 0;
  public hostname = 'localhost';

  constructor() {}
}
