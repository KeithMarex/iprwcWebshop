export class ProductModel {
  private _id: string;
  private _foto_path: string;
  private _beschrijving: string;
  private _voorraad: number;
  private _prijs: number;
  private _titel: string;

  constructor(id: string, titel: string, beschrijving: string, voorraad: number, prijs: number, fotoPath: string) {
    this.id = id;
    this.titel = titel;
    this.beschrijving = beschrijving;
    this.voorraad = voorraad;
    this.prijs = prijs;
    this.foto_path = fotoPath;
  }

  get voorraad(): number {
    return this._voorraad;
  }

  set voorraad(value: number) {
    this._voorraad = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get foto_path(): string {
    return this._foto_path;
  }

  set foto_path(value: string) {
    this._foto_path = value;
  }

  get beschrijving(): string {
    return this._beschrijving;
  }

  set beschrijving(value: string) {
    this._beschrijving = value;
  }

  get prijs(): number {
    return this._prijs;
  }

  set prijs(value: number) {
    this._prijs = value;
  }

  get titel(): string {
    return this._titel;
  }

  set titel(value: string) {
    this._titel = value;
  }
}
