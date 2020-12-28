export class cartProductModel{
  constructor(id: string, fotoPath: string, beschrijving: string, voorraad: number, prijs: number, titel: string, count: number) {
    this._id = id;
    this._foto_path = fotoPath;
    this._beschrijving = beschrijving;
    this._voorraad = voorraad;
    this._prijs = prijs;
    this._titel = titel;
    this._count = count;
  }
  private _id: string;
  private _foto_path: string;
  private _beschrijving: string;
  private _voorraad: number;
  private _prijs: number;
  private _titel: string;
  private _count: number;


  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get fotoPath(): string {
    return this._foto_path;
  }

  set fotoPath(value: string) {
    this._foto_path = value;
  }

  get beschrijving(): string {
    return this._beschrijving;
  }

  set beschrijving(value: string) {
    this._beschrijving = value;
  }

  get voorraad(): number {
    return this._voorraad;
  }

  set voorraad(value: number) {
    this._voorraad = value;
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

  get count(): number {
    return this._count;
  }

  set count(value: number) {
    this._count = value;
  }
}
