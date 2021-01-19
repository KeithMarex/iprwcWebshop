import {cartProductModel} from "./cartProduct.model";

export class OrderModel {
  private _orderId;
  private _producten: cartProductModel[];
  private _timestamp: string;
  private _tracking_status: string;

  constructor(orderId, producten: cartProductModel[], timestamp: string, tracking_status: string) {
    this._orderId = orderId;
    this._producten = producten;
    this._timestamp = timestamp;
    this._tracking_status = tracking_status;
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

  get timestamp(): string {
    return this._timestamp;
  }

  set timestamp(value: string) {
    this._timestamp = value;
  }

  get tracking_status(): string {
    return this._tracking_status;
  }

  set tracking_status(value: string) {
    this._tracking_status = value;
  }
}

