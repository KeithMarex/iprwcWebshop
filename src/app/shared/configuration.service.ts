import {UserModel} from "./models/user.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ConfigurationService{
  public user: UserModel;
  public itemCount = 0;
  public hostname = 'localhost';

  constructor() {}
}
