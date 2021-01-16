import {UserModel} from "./models/user.model";
import {Injectable} from "@angular/core";
import {cartProductModel} from "./models/cartProduct.model";

@Injectable()
export class ConfigurationService{
  public user: UserModel;
  public winkelWagen: cartProductModel[] = [];
  public itemCount = 0;
  public hostname = 'https://iprwc.kvdmr.nl';
  // public hostname = 'http://localhost:80';
  public productenCount = 0;


  constructor() {}
}
