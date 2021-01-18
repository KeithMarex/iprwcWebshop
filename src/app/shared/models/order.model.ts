import {cartProductModel} from "./cartProduct.model";

export class OrderModel{
  private _orderId;
  private _producten: cartProductModel[];

  constructor(orderId, producten: cartProductModel[]) {
    this._orderId = orderId;
    this._producten = producten;
  }

  get orderId() {
    return this._orderId;
  }

  set orderId(value) {
    this._orderId = value;
  }

  get producten(): cartProductModel[] {
    return this._producten;
  }

  set producten(value: cartProductModel[]) {
    this._producten = value;
  }
}
